import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import menuData from "../../../data/menuData";
import { Icon } from "@iconify/react";
import BottomNavBar from "../../../components/user/BottomNavBar";

function FoodTypeDot({ isVeg }) {
  return (
    <span className="relative inline-flex items-center justify-center w-5 h-5">
      <span
        className={`absolute inset-0 rounded-sm ${
          isVeg ? "bg-emerald-50" : "bg-rose-50"
        }`}
      />
      <span
        className={`relative w-2.5 h-2.5 rounded-sm border-2 ${
          isVeg ? "border-emerald-600" : "border-rose-500"
        }`}
      >
        <span
          className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full ${
            isVeg ? "bg-emerald-600" : "bg-rose-500"
          }`}
        />
      </span>
    </span>
  );
}

function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f8fafc]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4fa] via-[#ffffff] to-[#f5f7fc]"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#007aff] opacity-[0.08] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#5856d6] opacity-[0.06] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#007aff] via-[#5856d6] to-[#ff2d55] opacity-[0.03] rounded-full blur-3xl"></div>
      </div>
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      ></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 122, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 255, 0.04) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>
    </div>
  );
}

function EnhancedStepper({ quantity, onAdd, onRemove, animKey, size = "md" }) {
  const [isPressing, setIsPressing] = useState(false);
  const sizeClasses = {
    sm: "w-7 h-7 text-sm",
    md: "w-9 h-9 text-base",
    lg: "w-11 h-11 text-lg",
  };

  const handlePress = (action) => {
    setIsPressing(true);
    if (window.navigator?.vibrate) window.navigator.vibrate(5);
    action();
    setTimeout(() => setIsPressing(false), 100);
  };

  return (
    <div
      key={animKey}
      className={`flex items-center gap-0 bg-gradient-to-r from-emerald-600 to-emerald-500 
                  rounded-full shadow-lg shadow-emerald-200/50 transform transition-transform
                  ${isPressing ? "scale-95" : ""}`}
      style={{ animation: "stepperPop 200ms cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      <button
        onClick={() => handlePress(onRemove)}
        aria-label="Decrease quantity"
        className={`${sizeClasses[size]} flex items-center justify-center text-white font-light
                   rounded-l-full active:bg-emerald-700 transition-all select-none
                   hover:bg-emerald-600/90`}
      >
        −
      </button>
      <span className="text-white font-bold text-sm min-w-[28px] text-center tabular-nums select-none">
        {quantity}
      </span>
      <button
        onClick={() => handlePress(onAdd)}
        aria-label="Increase quantity"
        className={`${sizeClasses[size]} flex items-center justify-center text-white font-light
                   rounded-r-full active:bg-emerald-700 transition-all select-none
                   hover:bg-emerald-600/90`}
      >
        +
      </button>
    </div>
  );
}

function EnhancedCartItemCard({ entry, onAdd, onRemove, onDelete, isSelected }) {
  const [removing, setRemoving] = useState(false);
  const [stepKey, setStepKey] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const itemRef = useRef(null);

  const handleRemove = () => {
    if (entry.quantity === 1) {
      setRemoving(true);
      setTimeout(() => onDelete(entry.cartId), 260);
    } else {
      setStepKey((k) => k + 1);
      onRemove(entry.cartId);
    }
  };

  const handleAdd = () => {
    setStepKey((k) => k + 1);
    onAdd(entry.item, entry.selectedModifiers);
  };

  const itemTotal = entry.unitPrice * entry.quantity;

  return (
    <div
      ref={itemRef}
      className="relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className="px-4 py-4 transition-all duration-300"
        style={{
          opacity: removing ? 0 : 1,
          transform: removing ? "translateX(24px)" : "translateX(0)",
          transition: "opacity 300ms ease, transform 300ms ease",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <FoodTypeDot isVeg={entry.item.isVeg} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[15px] text-stone-900 leading-snug tracking-tight">
                  {entry.item.name}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setRemoving(true);
                    setTimeout(() => onDelete(entry.cartId), 260);
                  }}
                  className="text-[11px] text-rose-500 font-medium hover:text-rose-600 
                     transition-colors flex items-center gap-1"
                >
                  <span className="text-base">
                    <Icon
                      icon="fluent:delete-24-regular"
                      width={22}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    />
                  </span>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="font-bold text-[16px] text-stone-900 tabular-nums tracking-tight">
                ₹{itemTotal}
              </p>
            </div>
            <EnhancedStepper
              quantity={entry.quantity}
              animKey={stepKey}
              onAdd={handleAdd}
              onRemove={handleRemove}
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EnhancedHeader({ totalItems, totalPrice, restaurantName, onBack }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg"
          : "bg-white"
      }`}
    >
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center
             text-stone-600 active:bg-stone-100 transition-all
             hover:bg-stone-100 border border-stone-200/50"
        >
          <Icon icon="fluent:arrow-left-24-filled" width={20} className="text-stone-600" />
        </button>

        <div className="flex-1">
          <h1 className="font-bold text-xl text-stone-900 tracking-tight leading-tight flex gap-2">
            <Icon icon="fluent:food-pizza-24-filled" width={22} className="text-emerald-600" />
            Your Cart
          </h1>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 
                       rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalPrice / 1000) * 100, 100)}%` }}
          />
        </div>
      </div>
    </header>
  );
}

function BatchActionsToolbar({ selectedCount, onClear, onDeleteSelected, totalPrice }) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-24 z-20 mx-4 mb-2">
      <div className="bg-stone-900 text-white rounded-2xl shadow-2xl p-3 
                    flex items-center justify-between animate-slideDown">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{selectedCount} selected</span>
          <span className="text-xs opacity-60">₹{totalPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-xs font-medium bg-white/10 rounded-xl
                     hover:bg-white/20 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onDeleteSelected}
            className="px-3 py-1.5 text-xs font-medium bg-rose-500 rounded-xl
                     hover:bg-rose-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl animate-fadeIn">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-stone-100 flex items-center 
                     justify-center text-stone-600"
          >
            ←
          </button>
          <input
            type="text"
            placeholder="Search in cart..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-lg bg-transparent border-none outline-none 
                     placeholder:text-stone-300 text-stone-900"
          />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Main CartPage
// ────────────────────────────────────────────────────────
export default function EnhancedCartPage() {
  const navigate = useNavigate();
  const { rest_id, table_id } = useParams();
  const { cart, addToCart, removeFromCart, deleteFromCart, clearCart, totalPrice, totalItems } =
    useCart();

  const [instructions, setInstructions] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showBatchActions, setShowBatchActions] = useState(false);

  const goBack = () => navigate(`/${rest_id}/${table_id}`);

  // Group cart entries by menu category
  const grouped = (() => {
    const g = {};
    cart.forEach((entry) => {
      const cat = menuData.categories.find((c) =>
        c.items.some((i) => i._id === entry.item._id)
      );
      const name = cat?.name || "Other";
      if (!g[name]) g[name] = [];
      g[name].push(entry);
    });
    return Object.fromEntries(
      Object.entries(g).sort(([, a], [, b]) => b.length - a.length)
    );
  })();

  const taxAmount = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + taxAmount;

  // Batch selection handlers
  const toggleItemSelection = (cartId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cartId)) newSet.delete(cartId);
      else newSet.add(cartId);
      setShowBatchActions(newSet.size > 0);
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
    setShowBatchActions(false);
  };

  const deleteSelected = () => {
    selectedItems.forEach((id) => deleteFromCart(id));
    clearSelection();
  };

  const selectedTotal = Array.from(selectedItems).reduce((sum, id) => {
    const item = cart.find((c) => c.cartId === id);
    return sum + (item ? item.unitPrice * item.quantity : 0);
  }, 0);

  // ── Place Order ────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setOrdering(true);
    setOrderError("");

    try {
      // Transform grouped cart → API `categories` shape
      const categories = Object.entries(grouped).map(([catName, entries]) => ({
        name: catName,
        items: entries.map((entry) => {
          // selectedModifiers: { "Group Name": modifier | modifier[] }
          const operationGroups = Object.entries(entry.selectedModifiers ?? {})
            .map(([groupName, val]) => {
              const modifiers = (Array.isArray(val) ? val : val ? [val] : []).map(
                ({ name, price, _id }) => ({ name, price, _id })
              );
              return modifiers.length ? { name: groupName, modifiers } : null;
            })
            .filter(Boolean);

          return {
            name:     entry.item.name,
            quantity: entry.quantity,
            price:    entry.item.price,
            tax:      entry.item.tax ?? 5,
            ...(operationGroups.length && { operationGroups }),
          };
        }),
      }));

      const payload = {
        rest_id,
        tableQrId: table_id,
        categories,
        ...(instructions.trim() && { specialInstructions: instructions.trim() }),
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.message ?? `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Handle both { _id } and { data: { _id } } response envelopes
      const orderId = data?._id ?? data?.data?._id;
      if (!orderId) throw new Error("Order ID missing in response");

      clearCart?.();

      navigate(`/${rest_id}/${table_id}/orders/${orderId}`);

    } catch (err) {
      console.error("Place order failed:", err);
      setOrderError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setOrdering(false);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  /* ── Empty State ── */
  if (cart.length === 0) {
    return (
      <>
        <style>{enhancedKeyframeStyles}</style>
        <Background />
        <div className="min-h-screen flex flex-col max-w-xl mx-auto relative">
          <EnhancedHeader
            totalItems={0}
            totalPrice={0}
            restaurantName={menuData?.rest_id?.name ?? "Our Menu"}
            onBack={goBack}
            onSearch={() => setIsSearchOpen(true)}
          />

          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-50 
                            to-stone-50 flex items-center justify-center text-6xl 
                            shadow-2xl shadow-emerald-100/50 animate-float">
                🛒
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 
                            rounded-full flex items-center justify-center text-white 
                            text-sm font-bold shadow-lg animate-pulse">
                !
              </div>
            </div>

            <h2 className="text-2xl font-bold text-stone-800 tracking-tight mb-2">
              Your cart feels light
            </h2>
            <p className="text-stone-400 text-center mb-8 max-w-[200px]">
              Add delicious items from our menu to get started
            </p>

            <button
              onClick={goBack}
              className="group relative bg-gradient-to-r from-emerald-600 to-emerald-500 
                       text-white font-semibold text-[16px] px-10 py-4 rounded-2xl 
                       transform transition-all duration-300 hover:scale-105 
                       hover:shadow-2xl hover:shadow-emerald-200/50 
                       active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Browse Menu</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 
                            to-emerald-600 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300" />
            </button>
          </div>

          {/* Add BottomNavBar for empty cart state */}
          <BottomNavBar activeTab="cart" />
        </div>

        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </>
    );
  }

  /* ── Filled Cart ── */
  return (
    <>
      <style>{enhancedKeyframeStyles}</style>
      <Background />

      <div className="min-h-screen flex flex-col max-w-xl mx-auto relative">
        <EnhancedHeader
          totalItems={totalItems}
          totalPrice={totalPrice}
          restaurantName={menuData.restaurant_name}
          onBack={goBack}
          onSearch={() => setIsSearchOpen(true)}
        />

        <BatchActionsToolbar
          selectedCount={selectedItems.size}
          onClear={clearSelection}
          onDeleteSelected={deleteSelected}
          totalPrice={selectedTotal}
        />

        <div className="flex-1 overflow-y-auto pb-36">
          <div className="p-4 space-y-4">
            {/* Cart items grouped by category */}
            {Object.entries(grouped).map(([catName, entries], gi) => (
              <section
                key={catName}
                className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden 
                         shadow-lg shadow-stone-200/40 border border-white/50"
                style={{ animation: `slideIn 400ms ${gi * 80}ms ease both` }}
              >
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[0.15em] 
                                 text-emerald-600 uppercase">
                    {catName}
                  </span>
                  <span className="text-[10px] font-medium text-stone-400 
                                 bg-stone-100 px-2 py-1 rounded-full">
                    {entries.length} items
                  </span>
                </div>

                {entries.map((entry, i) => (
                  <div key={entry.cartId}>
                    {i > 0 && <div className="mx-4 h-px bg-stone-100" />}
                    <EnhancedCartItemCard
                      entry={entry}
                      onAdd={addToCart}
                      onRemove={removeFromCart}
                      onDelete={deleteFromCart}
                      isSelected={selectedItems.has(entry.cartId)}
                    />
                  </div>
                ))}
              </section>
            ))}

            {/* Special Instructions */}
            <section
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 
                       shadow-lg shadow-stone-200/40 border border-white/50"
              style={{ animation: "slideIn 400ms 160ms ease both" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📝</span>
                <p className="text-xs font-bold tracking-[0.1em] text-stone-400 uppercase">
                  Special Instructions
                </p>
              </div>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any preferences? Extra napkins, less spicy, or special requests..."
                rows={2}
                className="w-full text-[14px] text-stone-700 placeholder:text-stone-300
                         bg-stone-50/80 border border-stone-200 rounded-2xl px-4 py-3
                         outline-none focus:ring-2 focus:ring-emerald-400/30 
                         focus:border-emerald-300 resize-none transition-all
                         hover:border-stone-300"
              />
            </section>

            {/* Bill Summary */}
            <section
              className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden 
                       shadow-lg shadow-stone-200/40 border border-white/50"
              style={{ animation: "slideIn 400ms 240ms ease both" }}
            >
              <div className="px-5 pt-5 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧾</span>
                  <p className="text-xs font-bold tracking-[0.1em] text-stone-400 uppercase">
                    Bill Summary
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                {cart.map((entry) => (
                  <div
                    key={entry.cartId}
                    className="flex items-baseline justify-between gap-2 group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] text-stone-600 truncate block">
                        {entry.item.name}
                      </span>
                      {entry.quantity > 1 && (
                        <span className="text-[11px] text-stone-400">
                          Quantity: {entry.quantity}
                        </span>
                      )}
                    </div>
                    <span className="text-[14px] text-stone-800 font-medium 
                                   tabular-nums flex-shrink-0">
                      ₹{entry.unitPrice * entry.quantity}
                    </span>
                  </div>
                ))}

                <div className="pt-4 mt-2 border-t border-dashed border-stone-200 space-y-2.5">
                  <BillRow label="Subtotal" value={`₹${totalPrice}`} />
                </div>

                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/30 
                              rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[13px] font-medium text-emerald-800">
                        Grand Total
                      </span>
                      <span className="text-[11px] text-emerald-600">
                        inclusive of all taxes
                      </span>
                    </div>
                    <span className="text-xl font-bold text-emerald-700 tabular-nums">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sticky Checkout Bar */}
        <div
          className="fixed bottom-0 inset-x-0 max-w-xl mx-auto
             bg-white/95 backdrop-blur-xl border-t border-stone-200/50 
             px-4 pt-3 pb-5 shadow-2xl rounded-t-3xl"
          style={{ animation: "slideUp 500ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Order Summary */}
          <div className="mb-4 space-y-2">
            <div className="h-px bg-stone-200/70 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-stone-800">Total Amount</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-700 tabular-nums">
                  ₹{grandTotal}
                </span>
              </div>
            </div>
          </div>

          {/* ── Error message ── */}
          {orderError && (
            <div className="mb-3 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-2xl
                            flex items-center gap-2 text-rose-600 text-sm font-medium">
              <span>⚠️</span>
              <span>{orderError}</span>
            </div>
          )}

          {/* Action button */}
          <div className="flex gap-3 mb-16">
            <button
              onClick={handlePlaceOrder}
              disabled={ordering}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 
               text-white font-bold text-[15px] tracking-wide
               py-4 rounded-2xl active:scale-[0.98] transition-all duration-200
               shadow-lg shadow-emerald-300/50 disabled:opacity-75
               flex items-center justify-center gap-3
               hover:shadow-xl hover:shadow-emerald-300/60 hover:from-emerald-500 hover:to-emerald-400
               focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
               disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

              {ordering ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">🛍️</span>
                  <span className="relative z-10">Place Order</span>
                  <span className="text-lg relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-500">
            <span>Your order is all set. Please click 'Place Order' to confirm it.</span>
          </div>
        </div>

        {/* Bottom Navigation Bar - Added here */}
        <BottomNavBar activeTab="cart" />
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

/* ─── Helpers ─── */
function BillRow({ label, value, muted, accent }) {
  return (
    <div className="flex justify-between items-center group">
      <span className={`text-[13px] flex items-center gap-2 ${muted ? "text-stone-400" : "text-stone-600"}`}>
        {label}
        {accent && (
          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            {accent}
          </span>
        )}
      </span>
      <span className={`text-[13px] tabular-nums font-medium ${muted ? "text-stone-400" : "text-stone-700"}`}>
        {value}
      </span>
    </div>
  );
}

/* ─── Keyframe animations ─── */
const enhancedKeyframeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(100%); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes stepperPop {
    0% { transform: scale(1); }
    40% { transform: scale(1.12); }
    70% { transform: scale(0.98); }
    100% { transform: scale(1); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .animate-fadeIn { animation: fadeIn 300ms ease forwards; }
  .animate-slideDown { animation: slideDown 300ms cubic-bezier(0.16,1,0.3,1) forwards; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-pulse { animation: pulse 2s ease-in-out infinite; }

  * { -webkit-tap-highlight-color: transparent; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 8px; }
  ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 8px; }
  ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
`;