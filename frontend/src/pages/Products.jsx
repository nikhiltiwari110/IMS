import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getSuppliers } from '../services/supplierService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', reorderLevel: '0', categoryId: '', supplierId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pData, cData, sData] = await Promise.all([
        getProducts({ size: 100 }),
        getCategories(),
        getSuppliers()
      ]);
      setProducts(pData.content || []);
      setCategories(cData);
      setSuppliers(sData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ ...newProduct, price: parseFloat(newProduct.price), reorderLevel: parseInt(newProduct.reorderLevel) });
      toast.success('Product created');
      setShowModal(false);
      setNewProduct({ name: '', description: '', price: '', reorderLevel: '0', categoryId: '', supplierId: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create product');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Product</button>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">New Product</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Reorder Level</label>
                <input required type="number" value={newProduct.reorderLevel} onChange={e => setNewProduct({...newProduct, reorderLevel: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})} className="w-full border p-2 rounded">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Supplier</label>
                <select value={newProduct.supplierId} onChange={e => setNewProduct({...newProduct, supplierId: e.target.value})} className="w-full border p-2 rounded">
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{p.sku}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">${p.price}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
