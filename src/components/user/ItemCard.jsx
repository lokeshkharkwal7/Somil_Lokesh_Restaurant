// ItemCard.jsx
// "More Details" now calls onDetails(item) → opens ProductModal.
// Full Tailwind styling refresh.

import VegBadge from "./VegBadge";
import AddButton from "./AddButton";

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function ItemCard({ item, onCustomize, onDetails }) {
  const hasCustomization = item.operationGroups?.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-3.5 flex justify-between items-start gap-3 hover:shadow-md transition-shadow duration-200">

      {/* ── LEFT ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <VegBadge isVeg={item.isVeg} />
          {item.isPopular && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              ★ Popular
            </span>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-[15px] leading-snug">
          {item.name}
        </h3>

        {/* price */}
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-bold text-gray-900 text-[15px]">₹{item.price}</span>
          {item.originalPrice && (
            <span className="line-through text-gray-400 text-[13px]">₹{item.originalPrice}</span>
          )}
          {item.originalPrice && (
            <span className="text-[11px] font-semibold text-emerald-600">
              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
            </span>
          )}
        </div>

        {/* description */}
        {item.description && (
          <p className="text-gray-500 text-[13px] mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        {/* More Details */}
        <button
          onClick={() => onDetails?.(item)}
          className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors"
        >
          More Details
          <IconChevron />
        </button>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex flex-col items-center relative shrink-0" style={{ width: "112px" }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-24 w-24 object-cover rounded-xl shadow-sm"
          />
        ) : (
          <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-stone-100 to-emerald-50 flex items-center justify-center">
            <span className="text-3xl opacity-30">🍽️</span>
          </div>
        )}

        {/* ADD button — overlaps bottom of image */}
        <div className="absolute bottom-5">
          <AddButton item={item} onCustomize={onCustomize} />
        </div>

        {hasCustomization && (
          <p className="text-[11px] text-gray-400 font-medium mt-1.5">
            Customisable
          </p>
        )}
      </div>

    </div>
  );
}