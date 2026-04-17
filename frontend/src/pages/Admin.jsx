import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../api/axios.js';

const CATEGORIES = ['furniture', 'lighting', 'ceramics', 'textiles', 'books', 'accessories'];

const EMPTY = { name: '', description: '', category: CATEGORIES[0], price: '', stock: '1', featured: false };

export default function Admin() {
  const { user } = useSelector((s) => s.auth);
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null);

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await api.get('/products', { params: { limit: 100 } })).data,
    enabled: !!user && user.role === 'admin',
  });

  const create = useMutation({
    mutationFn: async (fd) => (await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    onSuccess: (product) => {
      setStatus({ type: 'ok', msg: `Created "${product.title}" — live on the shop.` });
      setForm(EMPTY);
      setImage(null);
      setPreview(null);
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err) => setStatus({ type: 'err', msg: err.response?.data?.message || 'Failed to create product' }),
  });

  const remove = useMutation({
    mutationFn: async (id) => (await api.delete(`/products/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const onImage = (e) => {
    const f = e.target.files?.[0];
    setImage(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = (e) => {
    e.preventDefault();
    setStatus(null);
    if (!image) return setStatus({ type: 'err', msg: 'Please select an image' });
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('price', form.price);
    fd.append('stock', form.stock || '1');
    fd.append('featured', form.featured ? 'true' : 'false');
    fd.append('images', image);
    create.mutate(fd);
  };

  return (
    <div className="pt-32 pb-24">
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3">Admin</p>
          <h1 className="text-4xl md:text-5xl font-bold">Create a product.</h1>
          <p className="text-muted mt-2">Signed in as {user.email}. New items appear on the shop instantly.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <form onSubmit={submit} className="lg:col-span-3 space-y-4 p-6 bg-ink-800 border border-ink-600 rounded-2xl">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full h-12 px-4 bg-ink-900 border border-ink-600 rounded-xl focus:border-lime outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Description</span>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-2 w-full p-4 bg-ink-900 border border-ink-600 rounded-xl focus:border-lime outline-none resize-none"
              />
            </label>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-muted">Category</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-2 w-full h-12 px-4 bg-ink-900 border border-ink-600 rounded-xl focus:border-lime outline-none capitalize"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-muted">Price ($)</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-2 w-full h-12 px-4 bg-ink-900 border border-ink-600 rounded-xl focus:border-lime outline-none"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-muted">Stock</span>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="mt-2 w-full h-12 px-4 bg-ink-900 border border-ink-600 rounded-xl focus:border-lime outline-none"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Image</span>
              <input
                required
                type="file"
                accept="image/*"
                onChange={onImage}
                className="mt-2 w-full text-sm text-muted file:mr-4 file:h-10 file:px-4 file:rounded-full file:border-0 file:bg-lime file:text-ink file:font-semibold hover:file:bg-lime-600"
              />
            </label>

            {preview && (
              <div className="rounded-xl overflow-hidden border border-ink-600 max-w-xs">
                <img src={preview} alt="preview" className="w-full h-auto" />
              </div>
            )}

            <label className="flex items-center gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-lime"
              />
              Feature this product on the home page
            </label>

            {status && (
              <p className={`p-3 rounded-xl text-sm ${
                status.type === 'ok'
                  ? 'bg-lime/10 border border-lime/30 text-lime'
                  : 'bg-coral/10 border border-coral/30 text-coral'
              }`}>{status.msg}</p>
            )}

            <button
              disabled={create.isPending}
              className="w-full h-14 rounded-full bg-lime text-ink font-semibold hover:bg-lime-600 transition disabled:opacity-60"
            >
              {create.isPending ? 'Publishing...' : 'Publish to shop →'}
            </button>
          </form>

          <aside className="lg:col-span-2 p-6 bg-ink-800 border border-ink-600 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Recent products</h2>
            <ul className="space-y-3 max-h-[600px] overflow-auto pr-2">
              {productsData?.items?.length ? productsData.items.map((p) => (
                <li key={p._id} className="flex items-center gap-3 p-3 bg-ink-900 border border-ink-600 rounded-xl">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-ink-700" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted capitalize">{p.category} · ${p.price?.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => { if (confirm(`Delete "${p.title}"?`)) remove.mutate(p._id); }}
                    className="text-xs text-coral hover:underline"
                  >
                    Delete
                  </button>
                </li>
              )) : <p className="text-sm text-muted">No products yet.</p>}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
