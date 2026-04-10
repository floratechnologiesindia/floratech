import { useEffect, useMemo, useState } from 'react';
import { fetchPortfolio, createPortfolio, updatePortfolio, archiveItem, deleteItem, toAssetUrl } from '../api/api';
import ImageCropUpload from '../components/ImageCropUpload';

const PAGE_SIZE = 5;

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    client: '',
    industry: '',
    imageUrl: '',
    imageAlt: '',
    summary: '',
    challenges: '',
    solution: '',
    results: '',
    metaTitle: '',
    metaDescription: '',
    noIndex: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetchPortfolio();
    setItems(data);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (editingId) {
      await updatePortfolio(editingId, form);
      setEditingId(null);
    } else {
      await createPortfolio(form);
    }
    setForm({
      title: '',
      slug: '',
      client: '',
      industry: '',
      imageUrl: '',
      imageAlt: '',
      summary: '',
      challenges: '',
      solution: '',
      results: '',
      metaTitle: '',
      metaDescription: '',
      noIndex: false,
    });
    load();
  }

  async function handleDelete(id) {
    await deleteItem('portfolio', id);
    load();
  }

  async function handleArchive(id) {
    await archiveItem('portfolio', id, true);
    if (editingId === id) {
      setEditingId(null);
      setForm({
        title: '',
        slug: '',
        client: '',
        industry: '',
        imageUrl: '',
        imageAlt: '',
        summary: '',
        challenges: '',
        solution: '',
        results: '',
        metaTitle: '',
        metaDescription: '',
        noIndex: false,
      });
    }
    load();
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      client: item.client || '',
      industry: item.industry || '',
      imageUrl: item.imageUrl || '',
      imageAlt: item.imageAlt || '',
      summary: item.summary || '',
      challenges: item.challenges || '',
      solution: item.solution || '',
      results: item.results || '',
      metaTitle: item.metaTitle || '',
      metaDescription: item.metaDescription || '',
      noIndex: Boolean(item.noIndex),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const industries = useMemo(() => {
    const set = new Set(items.map((x) => x.industry || 'Unspecified'));
    return ['all', ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchIndustry = industryFilter === 'all' || (item.industry || 'Unspecified') === industryFilter;
      const matchSearch =
        text.length === 0 ||
        item.title?.toLowerCase().includes(text) ||
        item.slug?.toLowerCase().includes(text) ||
        item.client?.toLowerCase().includes(text);
      return matchIndustry && matchSearch;
    });
  }, [items, query, industryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Portfolio</span>
        <h1>Manage case studies and client stories</h1>
      </div>
      <form className="admin-form glass-card" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit portfolio item' : 'Add portfolio item'}</h2>
        <div className="form-grid">
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
          <label>Client<input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required /></label>
          <label>Industry<input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} required /></label>
          <ImageCropUpload
            label="Portfolio image"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            folder="portfolio"
            aspect={16 / 9}
            outputWidth={1280}
            outputHeight={720}
          />
          <label>Image alt text<input value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} placeholder="Describe the image for SEO/accessibility" /></label>
          <label>Summary<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required /></label>
          <label>Challenges<textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} required /></label>
          <label>Solution<textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} required /></label>
          <label>Results<textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} required /></label>
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
        <div className="form-actions-row">
          <button className="button button-primary">{editingId ? 'Update portfolio item' : 'Save portfolio item'}</button>
          {editingId ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({
                  title: '',
                  slug: '',
                  client: '',
                  industry: '',
                  imageUrl: '',
                  imageAlt: '',
                  summary: '',
                  challenges: '',
                  solution: '',
                  results: '',
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
        <h2>Portfolio items</h2>
        <div className="table-toolbar">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search title, slug, client..."
          />
          <select
            value={industryFilter}
            onChange={(e) => {
              setIndustryFilter(e.target.value);
              setPage(1);
            }}
          >
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry === 'all' ? 'All industries' : industry}
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
                <th>Client</th>
                <th>Industry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.imageUrl ? (
                      <img src={toAssetUrl(item.imageUrl)} alt={item.imageAlt || item.title} className="list-thumb" />
                    ) : (
                      <span className="table-muted">No image</span>
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.client}</td>
                  <td>{item.industry}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn"
                        onClick={() => handleEdit(item)}
                        title="Edit portfolio item"
                        aria-label="Edit portfolio item"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn"
                        onClick={() => handleArchive(item._id)}
                        title="Archive portfolio item"
                        aria-label="Archive portfolio item"
                      >
                        📥
                      </button>
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn icon-action-danger"
                        onClick={() => handleDelete(item._id)}
                        title="Delete portfolio item"
                        aria-label="Delete portfolio item"
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
