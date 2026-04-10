import { useEffect, useMemo, useState } from 'react';
import { fetchServices, createService, updateService, archiveItem, deleteItem, toAssetUrl } from '../api/api';
import ImageCropUpload from '../components/ImageCropUpload';

const PAGE_SIZE = 5;

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    details: '',
    category: 'General',
    imageUrl: '',
    imageAlt: '',
    metaTitle: '',
    metaDescription: '',
    noIndex: false,
  });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetchServices();
    setServices(data);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (editingId) {
      const updated = await updateService(editingId, form);
      setMessage(`Updated ${updated.title}`);
      setEditingId(null);
    } else {
      const created = await createService(form);
      setMessage(`Created ${created.title}`);
    }
    setForm({
      title: '',
      slug: '',
      summary: '',
      details: '',
      category: 'General',
      imageUrl: '',
      imageAlt: '',
      metaTitle: '',
      metaDescription: '',
      noIndex: false,
    });
    load();
  }

  async function handleDelete(id, title) {
    const label = title ? `"${title}"` : 'this service';
    if (!window.confirm(`Delete ${label} permanently? This cannot be undone.`)) return;
    await deleteItem('services', id);
    load();
  }

  async function handleArchive(id) {
    await archiveItem('services', id, true);
    if (editingId === id) {
      setEditingId(null);
      setForm({
        title: '',
        slug: '',
        summary: '',
        details: '',
        category: 'General',
        imageUrl: '',
        imageAlt: '',
        metaTitle: '',
        metaDescription: '',
        noIndex: false,
      });
    }
    load();
  }

  function handleEdit(service) {
    setEditingId(service._id);
    setForm({
      title: service.title || '',
      slug: service.slug || '',
      summary: service.summary || '',
      details: service.details || '',
      category: service.category || 'General',
      imageUrl: service.imageUrl || '',
      imageAlt: service.imageAlt || '',
      metaTitle: service.metaTitle || '',
      metaDescription: service.metaDescription || '',
      noIndex: Boolean(service.noIndex),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category || 'General'));
    return ['all', ...Array.from(set)];
  }, [services]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return services.filter((service) => {
      const matchCategory = categoryFilter === 'all' || (service.category || 'General') === categoryFilter;
      const matchSearch =
        text.length === 0 ||
        service.title?.toLowerCase().includes(text) ||
        service.slug?.toLowerCase().includes(text) ||
        service.summary?.toLowerCase().includes(text);
      return matchCategory && matchSearch;
    });
  }, [services, query, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Services</span>
        <h1>Manage service offerings</h1>
      </div>
      <form className="admin-form glass-card" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit service' : 'Add service'}</h2>
        <div className="form-grid">
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
          <label>Summary<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required /></label>
          <label>Details<textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} required /></label>
          <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
          <ImageCropUpload
            label="Service image"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            folder="services"
            aspect={16 / 9}
            outputWidth={1280}
            outputHeight={720}
          />
          <label>Image alt text<input value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} placeholder="Describe the image for SEO/accessibility" /></label>
        </div>
        <h3 className="form-section-title">SEO</h3>
        <div className="form-grid">
          <label>
            Meta title (optional)
            <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} maxLength={70} />
          </label>
          <label>
            Meta description (optional)
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              maxLength={320}
              rows={3}
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.noIndex}
              onChange={(e) => setForm({ ...form, noIndex: e.target.checked })}
            />
            Hide from search engines (noindex)
          </label>
        </div>
        {message && <p className="success-text">{message}</p>}
        <div className="form-actions-row">
          <button className="button button-primary">{editingId ? 'Update service' : 'Save service'}</button>
          {editingId ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({
                  title: '',
                  slug: '',
                  summary: '',
                  details: '',
                  category: 'General',
                  imageUrl: '',
                  imageAlt: '',
                  metaTitle: '',
                  metaDescription: '',
                  noIndex: false,
                });
              }}
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
      <div className="list-card glass-card">
        <h2>Published services</h2>
        <div className="table-toolbar">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search title, slug, summary..."
          />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All categories' : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((service) => (
                <tr key={service._id}>
                  <td>
                    {service.imageUrl ? (
                      <img src={toAssetUrl(service.imageUrl)} alt={service.imageAlt || service.title} className="list-thumb" />
                    ) : (
                      <span className="table-muted">No image</span>
                    )}
                  </td>
                  <td>{service.title}</td>
                  <td>{service.slug}</td>
                  <td>{service.category || 'General'}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn"
                        onClick={() => handleEdit(service)}
                        title="Edit service"
                        aria-label="Edit service"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn"
                        onClick={() => handleArchive(service._id)}
                        title="Archive service"
                        aria-label="Archive service"
                      >
                        📥
                      </button>
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn icon-action-danger"
                        onClick={() => handleDelete(service._id, service.title)}
                        title="Delete service"
                        aria-label="Delete service"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-row">
          <p>Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="pagination-actions">
            <button className="button button-secondary" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <span>Page {currentPage} / {totalPages}</span>
            <button className="button button-secondary" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
