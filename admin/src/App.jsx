import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Leads from './pages/Leads';
import AdminLayout from './components/AdminLayout';

function App() {
  const token = localStorage.getItem('flora_admin_token');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={token ? <AdminLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="blog" element={<Blog />} />
        <Route path="leads" element={<Leads />} />
      </Route>
      <Route path="*" element={<Navigate to={token ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
