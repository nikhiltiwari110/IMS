import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Folder, Users, ArrowRightLeft, List, LogOut } from 'lucide-react';

export default function SidebarLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">IMS</h2>
          <p className="text-sm text-gray-500">Inventory System</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {user?.role === 'ADMIN' && (
            <>
              <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem to="/products" icon={<Package size={20} />} label="Products" />
              <NavItem to="/categories" icon={<Folder size={20} />} label="Categories" />
              <NavItem to="/suppliers" icon={<Users size={20} />} label="Suppliers" />
            </>
          )}
          
          <NavItem to="/stock" icon={<ArrowRightLeft size={20} />} label="Stock Operations" />
          <NavItem to="/transactions" icon={<List size={20} />} label="Transactions" />
        </nav>
        
        <div className="p-4 border-t">
          <div className="mb-2 px-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm text-red-600 rounded hover:bg-red-50"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-2 py-2 text-sm rounded-md transition-colors ${
          isActive 
            ? 'bg-blue-50 text-blue-700 font-medium' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
}
