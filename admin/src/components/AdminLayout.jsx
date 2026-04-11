import { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { fetchLeads } from '../api/api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [leadCount, setLeadCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCount() {
      try {
        const leads = await fetchLeads();
        if (!cancelled) setLeadCount(leads.length);
      } catch {
        if (!cancelled) setLeadCount(null);
      }
    }
    loadCount();
    const id = setInterval(loadCount, 90000);
    const onLeadsChanged = () => loadCount();
    window.addEventListener('flora-leads-changed', onLeadsChanged);
    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener('flora-leads-changed', onLeadsChanged);
    };
  }, [location.pathname]);

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
          <NavLink
            to="/leads"
            className={({ isActive }) => `admin-nav-leads${isActive ? ' active' : ''}`}
          >
            <span>Leads</span>
            {leadCount != null && leadCount > 0 ? (
              <span className="nav-badge" aria-label={`${leadCount} leads`}>
                {leadCount > 99 ? '99+' : leadCount}
              </span>
            ) : null}
          </NavLink>
        </nav>
        <button className="button button-secondary logout-button" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-content glass-card">
        <Outlet />
      </main>
    </div>
  );
}
