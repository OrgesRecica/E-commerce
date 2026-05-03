import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeItem, updateQty, clear } from '../store/cartSlice.js';
import Magnetic from '../components/Magnetic.jsx';
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

  const checkout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout', { state: { items, total } });
  };

  return (
    <>
      <section className="page-top pb-12">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-muted mb-10 reveal">
            <Link to="/" className="link-underline">Home</Link>
            <span>/</span>
            <span className="text-bone">Cart</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="section-mark mb-6 reveal">N° 06 — Your selection</p>
              <h1 className="kinetic text-display-xl text-bone reveal">
                {items.length === 0
                  ? <span className="line-mask"><span>Empty <em>for now</em>.</span></span>
                  : <><span className="line-mask"><span>Your <em>cart</em></span></span><span className="line-mask"><span>· {items.length} item{items.length > 1 ? 's' : ''}</span></span></>}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l border-black/10 reveal" data-delay="200">
              <p className="text-bone-300 leading-relaxed text-[15px]">
                {items.length === 0
                  ? 'Browse our sustainable packaging products and add items to start your order.'
                  : 'Review your items, then proceed to secure Stripe checkout.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="py-32 border-t border-black/10 text-center">
          <Magnetic>
            <Link to="/products" className="btn-primary">
              Browse products →
            </Link>
          </Magnetic>
        </section>
      ) : (
        <section className="py-12 border-t border-black/10">
          <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12">
            {/* Items */}
            <div className="lg:col-span-8 space-y-px bg-black/10">
              {items.map((i) => (
                <div key={i.productId} className="reveal flex gap-6 p-6 bg-white">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-ink-800 overflow-hidden shrink-0 p-3 grid place-items-center">
                    {i.image ? <img src={i.image} alt={i.title} className="w-full h-full object-contain" /> : null}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-base font-medium text-bone tracking-normal">{i.title}</h3>
                        <p className="text-sm text-muted mt-1 tabular">€{i.price.toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => dispatch(removeItem(i.productId))}
                        className="text-muted hover:text-coral transition link-underline text-xs uppercase tracking-[0.28em]"
                        aria-label="Remove"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center border border-black/15">
                        <button
                          onClick={() => dispatch(updateQty({ productId: i.productId, quantity: i.quantity - 1 }))}
                          className="w-9 h-9 grid place-items-center text-bone hover:text-lime"
                        >−</button>
                        <span className="w-10 text-center text-sm font-medium text-bone tabular">{i.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQty({ productId: i.productId, quantity: i.quantity + 1 }))}
                          className="w-9 h-9 grid place-items-center text-bone hover:text-lime"
                        >+</button>
                      </div>
                      <span className="text-lg font-medium text-bone tabular">€{(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="lg:col-span-4 reveal" data-effect="right">
              <div className="sticky top-32 lg:pl-12 lg:border-l border-black/10">
                <p className="text-xs uppercase tracking-[0.32em] text-muted mb-6">Summary</p>
                <dl className="space-y-4 text-sm pb-6 border-b border-black/10">
                  <div className="flex justify-between"><dt className="text-bone-300">Subtotal</dt><dd className="text-bone tabular">€{subtotal.toFixed(2)}</dd></div>
                  <div className="flex justify-between"><dt className="text-bone-300">Shipping</dt><dd className="text-bone tabular">{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</dd></div>
                  <div className="flex justify-between"><dt className="text-bone-300">VAT</dt><dd className="text-muted">At checkout</dd></div>
                </dl>

                <div className="flex justify-between items-baseline pt-6 mb-8">
                  <dt className="text-base font-medium text-bone">Total</dt>
                  <dd className="text-3xl font-light text-bone tabular tracking-normal">€{total.toFixed(2)}</dd>
                </div>

                {subtotal < 150 && (
                  <p className="mb-6 text-xs text-muted">
                    Add <span className="text-bone font-medium tabular">€{(150 - subtotal).toFixed(2)}</span> for free shipping.
                  </p>
                )}

                <div className="space-y-3">
                  <Magnetic>
                    <button onClick={checkout} className="btn-primary w-full justify-between h-14">
                      Secure checkout
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </button>
                  </Magnetic>
                  <button onClick={() => dispatch(clear())} className="text-xs uppercase tracking-[0.28em] text-muted hover:text-coral transition link-underline">
                    Clear cart
                  </button>
                </div>

                <ul className="mt-12 pt-6 border-t border-black/10 space-y-3 text-xs text-muted">
                  <li>— Stripe secure payment</li>
                  <li>— 30-day return policy</li>
                  <li>— 100% recycled packaging</li>
                  <li>— ISO 9001 certified</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      )}
    </>
  );
}
