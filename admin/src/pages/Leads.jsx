import { useEffect, useState } from 'react';
import { fetchLeads, deleteItem } from '../api/api';

export default function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetchLeads();
    setLeads(data);
  }

  async function handleDelete(id) {
    await deleteItem('leads', id);
    await load();
    window.dispatchEvent(new Event('flora-leads-changed'));
  }

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Leads</span>
        <h1>Manage incoming inquiries</h1>
        <p>View lead submissions from the website and follow up quickly.</p>
      </div>
      <div className="list-card glass-card">
        <h2>Captured leads</h2>
        <ul>
          {leads.map((lead) => (
            <li key={lead._id} className="list-item lead-item">
              <div>
                <strong>{lead.name}</strong>
                <p>{lead.email} • {lead.phone}</p>
                <p><em>{lead.service}</em></p>
                <p>{lead.message}</p>
              </div>
              <button className="button button-secondary" onClick={() => handleDelete(lead._id)}>Archive</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
