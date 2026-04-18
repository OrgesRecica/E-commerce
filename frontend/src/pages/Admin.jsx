import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../api/axios.js';

const CATEGORIES = ['furniture', 'lighting', 'ceramics', 'textiles', 'books', 'accessories'];
const EMPTY = { name: '', description: '', category: CATEGORIES[0], price: '', stock: '1', featured: false };

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  paid: 'text-lime bg-lime/10 border-lime/30',
  shipped: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled: 'text-coral bg-coral/10 border-coral/30',
};

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function Admin() {
  const { user } = useSelector((s) => s.auth);
  const qc = useQueryClient();
  const [tab, setTab] = useState('products');
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null);

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await api.get('/products', { params: { limit: 100 } })).data,
    enabled: !!user && user.role === 'admin',
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await api.get('/orders/admin/all')).data,
    enabled: !!user && user.role === 'admin' && tab === 'orders',
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

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => (await api.patch(`/orders/${id}/status`, { status })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
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
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3">Admin</p>
          <h1 className="text-4xl md:text-5xl font-bold">Dashboard.</h1>
          <p className="text-muted mt-2">Signed in as {user.email}.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 p-1 bg-ink-800 border border-ink-600 rounded-full w-fit">
          {['products', 'orders'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-10 px-6 rounded-full text-sm font-medium transition capitalize ${
                tab === t ? 'bg-lime text-ink' : 'text-muted hover:text-bone'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
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
                    required type="number" min="0" step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="mt-2 w-full h-12 px-4 bg-ink-900 border border-ink-600 rounded-xl focus:border-lime outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted">Stock</span>
                  <input
                    type="number" min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="mt-2 w-full h-12 px-4 bg-ink-900 border border-ink-600 rounded-xl focus:border-lime outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-muted">Image</span>
                <input
                  required type="file" accept="image/*" onChange={onImage}
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
                  type="checkbox" checked={form.featured}
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
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted text-sm">{ordersData?.length ?? 0} total orders</p>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 bg-ink-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : ordersData?.length ? (
              <div className="space-y-3">
                {ordersData.map((order) => (
                  <div key={order._id} className="p-5 bg-ink-800 border border-ink-600 rounded-2xl">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-xs text-muted">#{order._id.slice(-8).toUpperCase()}</span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[order.status] || ''}`}>
                            {order.status}
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Customer info */}
                        {order.shippingAddress?.fullName && (
                          <div className="text-sm">
                            <span className="font-medium">{order.shippingAddress.fullName}</span>
                            {order.shippingAddress.email && <span className="text-muted"> · {order.shippingAddress.email}</span>}
                            {order.shippingAddress.phone && <span className="text-muted"> · {order.shippingAddress.phone}</span>}
                          </div>
                        )}
                        {order.shippingAddress?.line1 && (
                          <p className="text-xs text-muted">
                            {order.shippingAddress.line1}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                          </p>
                        )}

                        {/* Items */}
                        <p className="text-xs text-muted mt-1">
                          {order.items.map((i) => `${i.title} ×${i.quantity}`).join(' · ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-bold text-lime text-lg">${order.total?.toFixed(2)}</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus.mutate({ id: order._id, status: e.target.value })}
                          className="h-9 px-3 bg-ink-900 border border-ink-600 rounded-xl text-sm focus:border-lime outline-none capitalize"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-ink-600 rounded-2xl">
                <p className="text-2xl font-semibold mb-2">No orders yet.</p>
                <p className="text-muted">Orders will appear here once customers check out.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
