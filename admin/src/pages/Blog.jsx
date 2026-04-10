import { useEffect, useMemo, useState } from 'react';
import { fetchBlogPosts, createBlogPost, updateBlogPost, archiveItem, deleteItem, toAssetUrl } from '../api/api';
import ImageCropUpload from '../components/ImageCropUpload';
import RichTextEditor from '../components/RichTextEditor';

function hasBodyText(html) {
  if (!html || typeof html !== 'string') return false;
  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim();
  return text.length > 0;
}

const PAGE_SIZE = 5;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    featuredImageAlt: '',
    metaTitle: '',
    metaDescription: '',
    noIndex: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [imageFilter, setImageFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetchBlogPosts();
    setPosts(data);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!hasBodyText(form.content)) {
      window.alert('Please add article content in the rich text editor.');
      return;
    }
    if (editingId) {
      await updateBlogPost(editingId, form);
      setEditingId(null);
    } else {
      await createBlogPost(form);
    }
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      featuredImageAlt: '',
      metaTitle: '',
      metaDescription: '',
      noIndex: false,
    });
    load();
  }

  async function handleDelete(id, title) {
    const label = title ? `"${title}"` : 'this blog post';
    if (!window.confirm(`Delete ${label} permanently? This cannot be undone.`)) return;
    await deleteItem('blog', id);
    load();
  }

  async function handleArchive(id) {
    await archiveItem('blog', id, true);
    if (editingId === id) {
      setEditingId(null);
      setForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        featuredImageAlt: '',
        metaTitle: '',
        metaDescription: '',
        noIndex: false,
      });
    }
    load();
  }

  function handleEdit(post) {
    setEditingId(post._id);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featuredImage: post.featuredImage || '',
      featuredImageAlt: post.featuredImageAlt || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      noIndex: Boolean(post.noIndex),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return posts.filter((post) => {
      const hasImage = Boolean(post.featuredImage);
      const matchImage =
        imageFilter === 'all' ||
        (imageFilter === 'with' && hasImage) ||
        (imageFilter === 'without' && !hasImage);
      const matchSearch =
        text.length === 0 ||
        post.title?.toLowerCase().includes(text) ||
        post.slug?.toLowerCase().includes(text) ||
        post.excerpt?.toLowerCase().includes(text);
      return matchImage && matchSearch;
    });
  }, [posts, query, imageFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Blog Posts</span>
        <h1>Manage SEO-ready articles</h1>
      </div>
      <form className="admin-form glass-card" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit blog post' : 'Create new blog post'}</h2>
        <div className="form-grid">
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
          <ImageCropUpload
            label="Featured image"
            value={form.featuredImage}
            onChange={(url) => setForm({ ...form, featuredImage: url })}
            folder="blog"
            aspect={16 / 9}
            outputWidth={1280}
            outputHeight={720}
          />
          <label>Image alt text<input value={form.featuredImageAlt} onChange={(e) => setForm({ ...form, featuredImageAlt: e.target.value })} placeholder="Describe the image for SEO/accessibility" /></label>
          <label>Excerpt<textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required /></label>
          <label className="rich-text-field">
            <span className="rich-text-field-label">Content</span>
            <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
          </label>
        </div>
        <h3 className="form-section-title">SEO</h3>
        <div className="form-grid">
          <label>
            Meta title (optional, ~60 chars)
            <input
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              maxLength={70}
              placeholder="Overrides browser title; brand suffix added on site"
            />
          </label>
          <label>
            Meta description (optional)
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              maxLength={320}
              rows={3}
              placeholder="Search snippet; defaults to excerpt if empty"
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
          <button className="button button-primary">{editingId ? 'Update post' : 'Publish post'}</button>
          {editingId ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({
                  title: '',
                  slug: '',
                  excerpt: '',
                  content: '',
                  featuredImage: '',
                  featuredImageAlt: '',
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
        <h2>Published posts</h2>
        <div className="table-toolbar">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search title, slug, excerpt..."
          />
          <select
            value={imageFilter}
            onChange={(e) => {
              setImageFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All posts</option>
            <option value="with">With image</option>
            <option value="without">Without image</option>
          </select>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Excerpt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((post) => (
                <tr key={post._id}>
                  <td>
                    {post.featuredImage ? (
                      <img src={toAssetUrl(post.featuredImage)} alt={post.featuredImageAlt || post.title} className="list-thumb" />
                    ) : (
                      <span className="table-muted">No image</span>
                    )}
                  </td>
                  <td>{post.title}</td>
                  <td>{post.slug}</td>
                  <td className="table-ellipsis">{post.excerpt}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn"
                        onClick={() => handleEdit(post)}
                        title="Edit blog post"
                        aria-label="Edit blog post"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn"
                        onClick={() => handleArchive(post._id)}
                        title="Archive blog post"
                        aria-label="Archive blog post"
                      >
                        📥
                      </button>
                      <button
                        type="button"
                        className="button button-secondary icon-action-btn icon-action-danger"
                        onClick={() => handleDelete(post._id, post.title)}
                        title="Delete blog post"
                        aria-label="Delete blog post"
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
