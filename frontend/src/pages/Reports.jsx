import React, { useEffect, useState } from 'react';
import { getTopSelling, getDeadStock, exportInventory } from '../services/reportService';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
  const [topSelling, setTopSelling] = useState([]);
  const [deadStock, setDeadStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [topData, deadData] = await Promise.all([
        getTopSelling(10),
        getDeadStock()
      ]);
      setTopSelling(topData);
      setDeadStock(deadData);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportInventory();
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button onClick={handleExport} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm transition-colors">
          <Download size={20} className="mr-2" />
          Export to Excel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Selling Products</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSelling} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="price" fill="#3b82f6" name="Price" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Dead Stock (No recent txns)</h3>
          <div className="overflow-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {deadStock.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">${p.price}</td>
                  </tr>
                ))}
                {deadStock.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-4 py-8 text-sm text-center text-gray-500 italic">No dead stock found. Great job!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
