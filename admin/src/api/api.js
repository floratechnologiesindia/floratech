import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('flora_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginAdmin(credentials) {
  const response = await axios.post(`${API_BASE}/auth/login`, credentials);
  return response.data;
}

export async function fetchServices() {
  const response = await axios.get(`${API_BASE}/services`);
  return response.data;
}

export async function fetchPortfolio() {
  const response = await axios.get(`${API_BASE}/portfolio`);
  return response.data;
}

export async function fetchBlogPosts() {
  const response = await axios.get(`${API_BASE}/blog`);
  return response.data;
}

export async function fetchLeads() {
  const response = await axios.get(`${API_BASE}/leads`, { headers: getAuthHeaders() });
  return response.data;
}

export async function createService(payload) {
  const response = await axios.post(`${API_BASE}/services`, payload, { headers: getAuthHeaders() });
  return response.data;
}

export async function updateService(id, payload) {
  const response = await axios.put(`${API_BASE}/services/${id}`, payload, { headers: getAuthHeaders() });
  return response.data;
}

export async function createPortfolio(payload) {
  const response = await axios.post(`${API_BASE}/portfolio`, payload, { headers: getAuthHeaders() });
  return response.data;
}

export async function updatePortfolio(id, payload) {
  const response = await axios.put(`${API_BASE}/portfolio/${id}`, payload, { headers: getAuthHeaders() });
  return response.data;
}

export async function createBlogPost(payload) {
  const response = await axios.post(`${API_BASE}/blog`, payload, { headers: getAuthHeaders() });
  return response.data;
}

export async function updateBlogPost(id, payload) {
  const response = await axios.put(`${API_BASE}/blog/${id}`, payload, { headers: getAuthHeaders() });
  return response.data;
}

export async function uploadMedia(file, options = {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', options.folder || 'misc');
  if (options.maxWidth) formData.append('maxWidth', String(options.maxWidth));
  if (options.maxHeight) formData.append('maxHeight', String(options.maxHeight));
  if (options.quality) formData.append('quality', String(options.quality));

  const response = await axios.post(`${API_BASE}/media/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export function toAssetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  const base = API_BASE.replace(/\/api$/, '');
  return `${base}${path}`;
}

export async function deleteItem(collection, id) {
  const response = await axios.delete(`${API_BASE}/${collection}/${id}`, { headers: getAuthHeaders() });
  return response.data;
}

export async function archiveItem(collection, id, archived = true) {
  const response = await axios.patch(
    `${API_BASE}/${collection}/${id}/archive`,
    { archived },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
