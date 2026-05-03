import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../api/axios.js';
import Logo from '../components/Logo.jsx';
import Magnetic from '../components/Magnetic.jsx';

const CATEGORIES = ['shopping-bags', 'garbage-bags', 'packing-rolls'];
const CATEGORY_LABELS = {
  'shopping-bags': 'Shopping Bags',
  'garbage-bags':  'Garbage Bags',
  'packing-rolls': 'Packing Rolls',
};
const EMPTY = { name: '', description: '', category: CATEGORIES[0], price: '', stock: '1', featured: false };
const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLE = {
  pending:   'text-amber-700  bg-amber-50  border-amber-200',
  paid:      'text-orange     bg-orange/10 border-orange/30',
  shipped:   'text-blue-700   bg-blue-50   border-blue-200',
  delivered: 'text-violet     bg-violet/10 border-violet/30',
  cancelled: 'text-coral      bg-red-50    border-red-200',
};

function StatCard({ label, value, sub }) {
  return (
    <div className="p-8 bg-white border border-black/10">
      <p className="text-xs uppercase tracking-[0.24em] text-muted mb-3">{label}</p>
      <p className="text-4xl lg:text-5xl font-light text-bone tabular tracking-normal">{value}</p>
      {sub && <p className="text-xs uppercase tracking-[0.22em] text-muted mt-3">{sub}</p>}
    </div>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-3 text-sm font-medium tracking-normal transition-colors border-b border-black/5 ${
        active ? 'text-orange' : 'text-bone hover:text-orange'
      }`}
    >
      <span className="flex items-center justify-between">
        {label}
        <span className={`block w-4 h-px transition-all ${active ? 'bg-orange w-8' : 'bg-bone/20'}`} />
      </span>
    </button>
  );
}

export default function Admin() {
  const { user } = useSelector((s) => s.auth);
  const qc = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [createStatus, setCreateStatus] = useState(null);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/orders/admin/stats')).data,
    refetchInterval: 30000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await api.get('/orders/admin/all')).data,
    enabled: tab === 'orders' || tab === 'overview',
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await api.get('/products', { params: { limit: 100 } })).data,
  });

  const createProduct = useMutation({
    mutationFn: async (fd) => (await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    onSuccess: (p) => {
      setCreateStatus({ type: 'ok', msg: `"${p.title}" is live on the shop.` });
      setForm(EMPTY); setImage(null); setPreview(null);
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => setCreateStatus({ type: 'err', msg: err.response?.data?.message || 'Failed to create product.' }),
  });

  const removeProduct = useMutation({
    mutationFn: async (id) => (await api.delete(`/products/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => (await api.patch(`/orders/${id}/status`, { status })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const onImage = (e) => {
    const f = e.target.files?.[0];
    setImage(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submitProduct = (e) => {
    e.preventDefault();
    setCreateStatus(null);
    if (!image) return setCreateStatus({ type: 'err', msg: 'Please select an image.' });
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('price', form.price);
    fd.append('stock', form.stock || '1');
    fd.append('featured', form.featured ? 'true' : 'false');
    fd.append('images', image);
    createProduct.mutate(fd);
  };

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen page-top flex bg-ink-800">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-black/10 bg-white flex flex-col p-8 gap-2 sticky top-24 h-[calc(100vh-6rem)] overflow-auto">
        <div className="mb-8 pb-6 border-b border-black/10">
          <Logo size={32} textSize="text-base" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-orange">Admin Panel</p>
          <p className="text-xs text-muted truncate mt-1">{user.email}</p>
        </div>

        <NavItem label="Overview"   active={tab === 'overview'} onClick={() => setTab('overview')} />
        <NavItem label="Orders"     active={tab === 'orders'}   onClick={() => setTab('orders')} />
        <NavItem label="Products"   active={tab === 'products'} onClick={() => setTab('products')} />
        <NavItem label="Add product" active={tab === 'create'}  onClick={() => setTab('create')} />

        <div className="mt-auto pt-6 border-t border-black/10">
          <a href="/" className="text-xs uppercase tracking-[0.22em] text-muted hover:text-orange transition link-underline">
            ← Back to store
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-10 lg:p-14">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-12">
            <div>
              <p className="section-mark mb-4">Dashboard</p>
              <h1 className="kinetic text-display-md text-bone">Overview</h1>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-px bg-black/10">
              <StatCard label="Total revenue" value={fmt(stats?.totalRevenue)} sub="From paid orders" />
              <StatCard label="Total orders"  value={stats?.totalOrders ?? '—'} sub={`${stats?.ordersByStatus?.pending ?? 0} pending`} />
              <StatCard label="Products"      value={stats?.totalProducts ?? '—'} sub="In the shop" />
              <StatCard label="Customers"     value={stats?.totalUsers ?? '—'} sub="Registered" />
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-black/10">
              <div className="p-8 bg-white">
                <h2 className="text-xs uppercase tracking-[0.24em] text-muted mb-6">Orders by status</h2>
                <div className="space-y-4">
                  {STATUS_OPTIONS.map((s) => {
                    const count = stats?.ordersByStatus?.[s] || 0;
                    const total = stats?.totalOrders || 1;
                    return (
                      <div key={s}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="capitalize text-bone-300">{s}</span>
                          <span className="text-bone tabular font-medium">{count}</span>
                        </div>
                        <div className="h-px bg-black/10">
                          <div className="h-full bg-orange transition-all" style={{ width: `${(count / total) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-8 bg-white">
                <h2 className="text-xs uppercase tracking-[0.24em] text-muted mb-6">Recent orders</h2>
                <div className="space-y-4">
                  {stats?.recentOrders?.length ? stats.recentOrders.map((o) => (
                    <div key={o._id} className="flex items-center justify-between gap-3 py-3 border-b border-black/10 last:border-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-bone truncate tracking-normal">{o.shippingAddress?.fullName || o.userId?.name || 'Guest'}</p>
                        <p className="text-xs text-muted">{fmtDate(o.createdAt)} · {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 border capitalize uppercase tracking-[0.2em] ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                        <span className="text-sm font-medium text-bone tabular">{fmt(o.total)}</span>
                      </div>
                    </div>
                  )) : <p className="text-sm text-muted">No orders yet.</p>}
                </div>
                {(stats?.recentOrders?.length > 0) && (
                  <button onClick={() => setTab('orders')} className="mt-6 text-xs uppercase tracking-[0.22em] text-orange link-underline">View all →</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div className="space-y-12">
            <div>
              <p className="section-mark mb-4">Fulfilment</p>
              <h1 className="kinetic text-display-md text-bone mb-2">Orders</h1>
              <p className="text-bone-300">{ordersData?.length ?? 0} total orders.</p>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-white animate-pulse border border-black/10" />)}</div>
            ) : ordersData?.length ? (
              <div className="space-y-px bg-black/10 border-y border-black/10">
                {ordersData.map((order) => (
                  <div key={order._id} className="p-6 bg-white">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-xs text-muted">#{order._id.slice(-8).toUpperCase()}</span>
                          <span className={`text-[10px] uppercase tracking-[0.22em] px-2 py-0.5 border capitalize ${STATUS_STYLE[order.status]}`}>{order.status}</span>
                          <span className="text-xs text-muted">{fmtDate(order.createdAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                          {order.shippingAddress?.fullName && <span className="font-medium text-bone tracking-normal">{order.shippingAddress.fullName}</span>}
                          {order.shippingAddress?.email && <span className="text-bone-300">{order.shippingAddress.email}</span>}
                          {order.shippingAddress?.phone && <span className="text-bone-300 tabular">{order.shippingAddress.phone}</span>}
                        </div>
                        {order.shippingAddress?.line1 && (
                          <p className="text-xs text-muted">
                            {order.shippingAddress.line1}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {order.items?.map((item, i) => (
                            <span key={i} className="text-xs bg-ink-800 px-2.5 py-1 text-bone-300">
                              {item.title} ×{item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span className="text-2xl font-light text-bone tabular tracking-normal">{fmt(order.total)}</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus.mutate({ id: order._id, status: e.target.value })}
                          className="h-9 px-3 bg-white border border-black/15 text-sm text-bone outline-none capitalize focus:border-bone"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border border-black/10 bg-white">
                <p className="kinetic text-2xl font-medium text-bone mb-2">No orders <em>yet</em>.</p>
                <p className="text-bone-300">Orders will appear here once customers check out.</p>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div className="space-y-12">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="section-mark mb-4">Catalogue</p>
                <h1 className="kinetic text-display-md text-bone mb-2">Products</h1>
                <p className="text-bone-300">{productsData?.items?.length ?? 0} products in the shop.</p>
              </div>
              <Magnetic>
                <button onClick={() => setTab('create')} className="btn-primary">+ Add product</button>
              </Magnetic>
            </div>

            <div className="border border-black/10 overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-black/10">
                  <tr>
                    <th className="text-left px-6 py-5 text-[11px] uppercase tracking-[0.22em] text-muted font-medium">Product</th>
                    <th className="text-left px-6 py-5 text-[11px] uppercase tracking-[0.22em] text-muted font-medium hidden md:table-cell">Category</th>
                    <th className="text-left px-6 py-5 text-[11px] uppercase tracking-[0.22em] text-muted font-medium">Price</th>
                    <th className="text-left px-6 py-5 text-[11px] uppercase tracking-[0.22em] text-muted font-medium hidden sm:table-cell">Stock</th>
                    <th className="text-left px-6 py-5 text-[11px] uppercase tracking-[0.22em] text-muted font-medium hidden sm:table-cell">Featured</th>
                    <th className="px-6 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {productsData?.items?.map((p) => (
                    <tr key={p._id} className="hover:bg-ink-800 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-ink-800 overflow-hidden shrink-0 p-1">
                            {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-contain" />}
                          </div>
                          <span className="font-medium text-bone truncate max-w-[220px] tracking-normal">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-bone-300 hidden md:table-cell">{(CATEGORY_LABELS[p.category] || p.category).replace(/-/g, ' ')}</td>
                      <td className="px-6 py-4 font-medium text-bone tabular">€{p.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-bone-300 hidden sm:table-cell tabular">{p.stock}</td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        {p.featured
                          ? <span className="text-[10px] uppercase tracking-[0.22em] px-2 py-0.5 bg-orange/10 text-orange border border-orange/30">Yes</span>
                          : <span className="text-xs text-muted">—</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => { if (confirm(`Delete "${p.title}"?`)) removeProduct.mutate(p._id); }}
                          className="text-xs uppercase tracking-[0.22em] text-coral link-underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!productsData?.items?.length && (
                <div className="py-20 text-center text-bone-300 bg-white">No products yet.</div>
              )}
            </div>
          </div>
        )}

        {/* CREATE */}
        {tab === 'create' && (
          <div className="space-y-12 max-w-2xl">
            <div>
              <p className="section-mark mb-4">New entry</p>
              <h1 className="kinetic text-display-md text-bone mb-2">Add product</h1>
              <p className="text-bone-300">New items appear on the shop instantly.</p>
            </div>

            <form onSubmit={submitProduct} className="space-y-8 p-8 lg:p-10 bg-white border border-black/10">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">Product name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone" />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">Description</span>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-3 w-full bg-transparent border-b border-black/15 focus:border-bone outline-none resize-none text-bone leading-relaxed" />
              </label>

              <div className="grid sm:grid-cols-3 gap-x-8 gap-y-8">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Category</span>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Price (€)</span>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone tabular" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Stock</span>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone tabular" />
                </label>
              </div>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">Image</span>
                <input required type="file" accept="image/*" onChange={onImage}
                  className="mt-3 w-full text-sm text-bone-300 file:mr-4 file:h-10 file:px-5 file:border-0 file:bg-bone file:text-white file:text-xs file:uppercase file:tracking-[0.22em] hover:file:bg-orange cursor-pointer" />
              </label>

              {preview && (
                <div className="overflow-hidden border border-black/10 w-48 bg-ink-800 p-2">
                  <img src={preview} alt="preview" className="w-full h-auto" />
                </div>
              )}

              <label className="flex items-center gap-3 text-sm text-bone cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-orange w-4 h-4" />
                Feature on home page
              </label>

              {createStatus && (
                <div className={`text-sm ${createStatus.type === 'ok' ? 'text-violet' : 'text-coral'}`}>
                  — {createStatus.msg}
                </div>
              )}

              <Magnetic>
                <button disabled={createProduct.isPending} className="btn-primary justify-between w-full h-14 disabled:opacity-50">
                  {createProduct.isPending ? 'Publishing…' : 'Publish to shop →'}
                </button>
              </Magnetic>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
