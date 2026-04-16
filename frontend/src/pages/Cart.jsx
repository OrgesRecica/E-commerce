import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeItem, updateQty, clear } from '../store/cartSlice.js';
import api from '../api/axios.js';
import { useReveal } from '../hooks/useReveal.js';

export default function Cart() {
  useReveal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  const checkout = async () => {
    if (!user) return navigate('/login');
    const order = await api.post('/orders', {
      items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
    });
    const intent = await api.post('/payments/intent', { orderId: order.data._id });
    alert(`Order created. Client secret: ${intent.data.clientSecret}`);
    dispatch(clear());
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 container mx-auto px-4 max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-4 reveal">Your bag</p>
        <h1 className="text-display-md mb-6 reveal">Empty — for now.</h1>
        <p className="text-muted mb-8 reveal">
          Nothing's waiting here yet. Browse the archive and start a collection worth keeping.
        </p>
        <Link to="/products" className="reveal inline-flex h-14 px-8 rounded-full bg-lime text-ink font-semibold items-center gap-2 hover:bg-lime-600 transition">
          Browse the shop →
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-7xl">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">Checkout</p>
        <h1 className="text-display-md reveal">Your bag — {items.length} item{items.length > 1 ? 's' : ''}.</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((i, idx) => (
            <div
              key={i.productId}
              className="reveal flex gap-4 p-4 bg-ink-800 border border-ink-600 rounded-2xl"
              data-delay={idx * 60}
            >
              <div className="w-28 h-28 rounded-xl bg-ink-700 overflow-hidden shrink-0">
                {i.image ? <img src={i.image} alt={i.title} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{i.title}</h3>
                    <p className="text-sm text-muted mt-1">${i.price.toFixed(2)} each</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeItem(i.productId))}
                    className="text-muted hover:text-coral transition text-sm"
                    aria-label="Remove"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center gap-1 bg-ink border border-ink-600 rounded-full">
                    <button
                      onClick={() => dispatch(updateQty({ productId: i.productId, quantity: i.quantity - 1 }))}
                      className="w-9 h-9 grid place-items-center hover:text-lime"
                    >−</button>
                    <span className="w-8 text-center text-sm tabular-nums">{i.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQty({ productId: i.productId, quantity: i.quantity + 1 }))}
                      className="w-9 h-9 grid place-items-center hover:text-lime"
                    >+</button>
                  </div>
                  <span className="font-bold text-lime">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="reveal" data-effect="right">
          <div className="sticky top-28 p-6 rounded-2xl border border-ink-600 bg-ink-800">
            <h2 className="text-lg font-bold mb-4">Order summary</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>Calculated at checkout</dd></div>
              <div className="pt-3 border-t border-ink-600 flex justify-between text-base">
                <dt className="font-semibold">Total</dt><dd className="font-bold text-lime">${total.toFixed(2)}</dd>
              </div>
            </dl>
            {subtotal < 150 && (
              <div className="mt-4 p-3 rounded-xl bg-ink text-xs text-muted">
                Add <span className="text-lime font-semibold">${(150 - subtotal).toFixed(2)}</span> more for free shipping.
              </div>
            )}
            <button
              onClick={checkout}
              className="mt-5 w-full h-14 rounded-full bg-lime text-ink font-semibold hover:bg-lime-600 transition"
            >
              Checkout securely
            </button>
            <button
              onClick={() => dispatch(clear())}
              className="mt-2 w-full h-11 rounded-full text-sm text-muted hover:text-coral transition"
            >
              Clear bag
            </button>

            <ul className="mt-6 pt-6 border-t border-ink-600 space-y-2 text-xs text-muted">
              <li className="flex gap-2"><span className="text-lime">✓</span> Secure Stripe checkout</li>
              <li className="flex gap-2"><span className="text-lime">✓</span> 30-day returns</li>
              <li className="flex gap-2"><span className="text-lime">✓</span> Carbon-neutral shipping</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
