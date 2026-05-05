import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../services/categoryService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCategory(newCat);
      toast.success('Category created');
      setNewCat({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteCategory(id);
        toast.success('Deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input required type="text" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" value={newCat.description} onChange={e => setNewCat({...newCat, description: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{c.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.description}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
