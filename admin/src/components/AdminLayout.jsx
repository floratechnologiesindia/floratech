import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar glass-card">
        <div className="admin-brand">
          <strong>Flora Admin</strong>
          <span>Dashboard</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/portfolio">Portfolio</NavLink>
          <NavLink to="/blog">Blog Posts</NavLink>
          <NavLink to="/leads">Leads</NavLink>
        </nav>
        <button className="button button-secondary logout-button" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-content glass-card">
        <Outlet />
      </main>
    </div>
  );
}
