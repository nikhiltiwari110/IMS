import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/transactionService';
import { getProducts } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tData, pData] = await Promise.all([
        getTransactions({ size: 100 }), // large page for simplicity
        getProducts({ size: 1000 })
      ]);
      setTransactions(tData.content || []);
      setProducts(pData.content || []);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.map(t => {
              const p = products.find(prod => prod.id === t.productId);
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(t.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm"><StatusBadge status={t.type} /></td>
                  <td className="px-6 py-4 text-sm font-bold">{t.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
