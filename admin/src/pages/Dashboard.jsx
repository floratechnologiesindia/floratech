import { useEffect, useState } from 'react';
import { fetchServices, fetchPortfolio, fetchBlogPosts, fetchLeads } from '../api/api';

export default function Dashboard() {
  const [counts, setCounts] = useState({ services: 0, portfolio: 0, blog: 0, leads: 0 });

  useEffect(() => {
    async function loadCounts() {
      const [services, portfolio, blog, leads] = await Promise.all([fetchServices(), fetchPortfolio(), fetchBlogPosts(), fetchLeads()]);
      setCounts({ services: services.length, portfolio: portfolio.length, blog: blog.length, leads: leads.length });
    }
    loadCounts().catch(console.error);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Manage Flora Technologies content and leads</h1>
          <p>Monitor submissions, publish new services, update portfolio items, and keep the blog fresh.</p>
        </div>
      </div>
      <div className="grid stats-grid">
        <div className="stat-card glass-card"><strong>{counts.services}</strong><p>Services</p></div>
        <div className="stat-card glass-card"><strong>{counts.portfolio}</strong><p>Portfolio items</p></div>
        <div className="stat-card glass-card"><strong>{counts.blog}</strong><p>Blog posts</p></div>
        <div className="stat-card glass-card"><strong>{counts.leads}</strong><p>Leads captured</p></div>
      </div>
    </div>
  );
}
