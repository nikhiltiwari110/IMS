import React, { useEffect, useState } from 'react';
import { getStockLevels, stockIn, stockOut, stockAdjust } from '../services/stockService';
import { getProducts } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Stock() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [operation, setOperation] = useState('IN');
  const [formData, setFormData] = useState({ productId: '', quantity: '', note: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sData = await getStockLevels();
      const pData = await getProducts({ size: 1000 });
      setStocks(sData);
      setProducts(pData.content || []);
    } catch (error) {
      toast.error('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleOperation = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, quantity: parseInt(formData.quantity) };
      if (operation === 'IN') await stockIn(payload);
      else if (operation === 'OUT') await stockOut(payload);
      else await stockAdjust(payload);
      
      toast.success(`Stock ${operation} successful`);
      setFormData({ productId: '', quantity: '', note: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to perform stock ${operation}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex gap-4 mb-6 border-b pb-2">
          {['IN', 'OUT', 'ADJUST'].map(op => (
            <button 
              key={op}
              onClick={() => setOperation(op)}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${operation === op ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Stock {op}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleOperation} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <input type="text" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors">Submit</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {stocks.map(s => {
              const p = products.find(prod => prod.id === s.productId);
              return (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">{s.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
