// ProductModal.jsx
// Bottom-sheet modal opened by "More Details" on ItemCard.
// • Items WITH modifiers → "Customise & Add" delegates to ModifierModal
// • Items WITHOUT modifiers → inline quantity stepper + direct addToCart

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import VegBadge from "./VegBadge";
import ModifierModal from "./ModifierModal";

/* ── tiny icon components ──────────────────────── */
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.69l1.66-9.31H6" />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function ProductModal({ item, close }) {
  const { addToCart, getItemTotalQuantity } = useCart();

  const [qty, setQty] = useState(1);
  const [showModifierModal, setShowModifierModal] = useState(false);

  const hasCustomization = item.operationGroups?.length > 0;
  const alreadyInCart = getItemTotalQuantity(item._id) > 0;

  const handleAddDirect = () => {
    for (let i = 0; i < qty; i++) addToCart(item, {});
    close();
  };

  const handleCustomise = () => setShowModifierModal(true);

  /* if modifier modal opened from here, close both on confirm */
  if (showModifierModal) {
    return (
      <ModifierModal
        item={item}
        close={() => {
          setShowModifierModal(false);
          close();
        }}
      />
    );
  }

  return (
    /* ── backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={close}
    >
      {/* ── sheet - now at 80vh height ── */}
      <div
        className="bg-white w-full max-w-xl rounded-t-3xl overflow-hidden flex flex-col mb-16"
        style={{ height: "70vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero image - fixed height ── */}
        <div className="relative w-full bg-stone-100 flex-shrink-0" style={{ height: "180px" }}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-stone-100">
              <span className="text-6xl opacity-30">🍽️</span>
            </div>
          )}

          {/* gradient overlay at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />

          {/* close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
          >
            <IconClose />
          </button>

          {/* popular badge */}
          {item.isPopular && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-amber-400 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
              <IconStar />
              Popular
            </div>
          )}
        </div>

        {/* ── scrollable content area ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-5 pt-3 pb-4">

            {/* name + veg badge */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <h2 className="text-[20px] font-bold text-gray-900 leading-snug flex-1">
                {item.name}
              </h2>
              <div className="mt-1 shrink-0">
                <VegBadge isVeg={item.isVeg} />
              </div>
            </div>

            {/* price row */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[20px] font-bold text-emerald-600">
                ₹{item.price}
              </span>
              {item.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{item.originalPrice}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* description - scrollable if needed */}
            {item.description && (
              <div className="mb-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 sticky top-0 bg-white">
                  About this dish
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed max-h-[196px] overflow-y-auto pr-1">
                  {item.description}
                </p>
              </div>
            )}

            {/* customisation notice */}
            {hasCustomization && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
                <span className="text-amber-500 text-base">✦</span>
                <p className="text-[12px] text-amber-800 font-medium">
                  This item has customisation options. You'll choose them on the next step.
                </p>
              </div>
            )}

            {/* Add some bottom padding to ensure content doesn't get hidden behind the fixed footer */}
            <div className="h-4"></div>
          </div>
        </div>

        {/* ── Fixed bottom footer with add to cart ── */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-5 py-3 shadow-lg">
          <div className="flex items-center gap-3">

            {/* qty stepper — only shown for plain items */}
            {!hasCustomization && (
              <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden shrink-0 mb-5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-10 flex items-center justify-center text-gray-700 text-xl font-bold hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                  −
                </button>
                <span className="w-7 text-center font-bold text-gray-900 text-base select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-10 flex items-center justify-center text-gray-700 text-xl font-bold hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            )}

            {/* primary CTA */}
            {hasCustomization ? (
              <button
                onClick={handleCustomise}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-[16px] rounded-xl shadow-lg shadow-emerald-200 transition-all mb-5"
              >
                <IconCart />
                Customise &amp; Add
              </button>
            ) : (
              <button
                onClick={handleAddDirect}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-[16px] rounded-xl shadow-lg shadow-emerald-200 transition-all mb-5"
              >
                <IconCart />
                Add to Cart · ₹{item.price * qty}
              </button>
            )}
          </div>

          {/* already-in-cart hint */}
          {alreadyInCart && (
            <p className="text-center text-[11px] text-emerald-600 font-medium mt-2">
              ✓ Already in your cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}