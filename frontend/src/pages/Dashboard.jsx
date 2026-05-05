import React, { useEffect, useState } from 'react';
import { getSummary } from '../services/dashboardService';
import { Package, DollarSign, AlertTriangle, List } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const summary = await getSummary();
      setData(summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000); // 60s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Products" value={data.totalProducts} icon={<Package />} color="bg-blue-500" />
        <SummaryCard title="Total Value" value={`$${data.totalValue?.toFixed(2) || 0}`} icon={<DollarSign />} color="bg-green-500" />
        <SummaryCard title="Low Stock Items" value={data.lowStockCount} icon={<AlertTriangle />} color="bg-red-500" />
        <SummaryCard title="Recent Activity" value={data.recentTransactions?.length || 0} icon={<List />} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentTransactions?.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={tx.type} /></td>
                    <td className="px-4 py-3 text-sm font-medium">{tx.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:-translate-y-1">
      <div className={`p-4 rounded-full text-white ${color} mr-5 shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
