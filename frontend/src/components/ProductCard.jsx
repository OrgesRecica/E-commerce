import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice.js';

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const img = product.images?.[0]?.url;
  const categoryLabel = (product.category || 'product').replace(/-/g, ' ');
  const meter = 68 + ((index * 11) % 25);

  return (
    <article className="reveal group card-tilt premium-panel flex flex-col p-3" data-delay={(index % 4) * 90}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-ink-700">
        {img ? (
          <img src={img} alt={product.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-[1.035]" />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted text-sm">No image</div>
        )}

        <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-between">
          <span className="rounded-md bg-navy/90 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase text-white font-medium">
            {String(index + 1).padStart(2, '0')}
          </span>
          {product.featured && (
            <span className="rounded-md bg-orange px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.13em] text-white">
              Featured
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/0 to-navy/0 opacity-0 group-hover:opacity-100 transition duration-500" />

        <button
          onClick={() => dispatch(addItem({ productId: product._id, title: product.title, price: product.price, image: img }))}
          className="absolute left-3 right-3 bottom-3 z-10 h-11 rounded-md bg-white text-bone text-xs font-medium uppercase tracking-[0.12em] opacity-100 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-3 shadow-card"
        >
          Add to cart
          <span className="block w-4 h-px bg-orange" />
        </button>
      </div>

      <div className="pt-5 px-1 pb-1 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted mb-2 font-medium">
              {categoryLabel}
            </p>
            <h3 className="font-medium text-bone text-[15px] leading-snug line-clamp-2">
              <span className="link-underline">{product.title}</span>
            </h3>
          </div>
          <span className="text-bone font-semibold shrink-0 tabular text-[15px]">
            €{product.price?.toFixed(2)}
          </span>
        </div>

        <div className="mt-5 rounded-md bg-ink-700 p-3">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.12em] text-muted font-medium mb-2">
            <span>Run fit</span>
            <span>{meter}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-gradient-to-r from-violet to-orange" style={{ width: `${meter}%` }} />
          </div>
        </div>
      </div>
    </article>
  );
}
