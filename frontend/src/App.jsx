import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import SidebarLayout from './components/SidebarLayout';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Stock from './pages/Stock';
import Transactions from './pages/Transactions';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <SidebarLayout>{children}</SidebarLayout>;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute allowedRoles={['ADMIN']}><Products /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><Categories /></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute allowedRoles={['ADMIN']}><Suppliers /></ProtectedRoute>} />
        
        <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        
        {/* Default route */}
        <Route path="/" element={<Navigate to={user ? (user.role === 'ADMIN' ? '/dashboard' : '/stock') : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
