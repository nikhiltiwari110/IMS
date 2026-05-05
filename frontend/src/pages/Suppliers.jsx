import React, { useEffect, useState } from 'react';
import { getSuppliers, createSupplier, deleteSupplier } from '../services/supplierService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSup, setNewSup] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createSupplier(newSup);
      toast.success('Supplier created');
      setNewSup({ name: '', email: '', phone: '' });
      fetchSuppliers();
    } catch (error) {
      toast.error('Failed to create supplier');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteSupplier(id);
        toast.success('Deleted');
        fetchSuppliers();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input required type="text" value={newSup.name} onChange={e => setNewSup({...newSup, name: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={newSup.email} onChange={e => setNewSup({...newSup, email: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" value={newSup.phone} onChange={e => setNewSup({...newSup, phone: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Supplier</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {suppliers.map(s => (
              <tr key={s.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.phone}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
