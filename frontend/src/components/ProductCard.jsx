import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice.js';

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const img = product.images?.[0]?.url;
  return (
    <article
      className="reveal group relative bg-ink-800 rounded-2xl overflow-hidden border border-ink-600 hover:border-lime/40 transition-colors"
      data-delay={(index % 4) * 80}
    >
      <div className="relative aspect-[4/5] bg-ink-700 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms] ease-out"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-ink-500 text-sm">No image</div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-lime text-ink text-[10px] font-bold uppercase tracking-widest">
            Featured
          </span>
        )}
        <button
          onClick={() =>
            dispatch(addItem({ productId: product._id, title: product.title, price: product.price, image: img }))
          }
          className="absolute bottom-3 right-3 h-10 px-4 rounded-full bg-bone text-ink text-xs font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
        >
          Add to bag
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
            {product.category || 'Object'}
          </p>
          <h3 className="font-semibold truncate">{product.title}</h3>
        </div>
        <span className="text-lime font-bold shrink-0">${product.price?.toFixed(2)}</span>
      </div>
    </article>
  );
}
