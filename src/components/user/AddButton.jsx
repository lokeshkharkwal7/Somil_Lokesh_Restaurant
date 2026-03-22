import { useCart } from "../../context/CartContext";

export default function AddButton({ item, onCustomize }) {
  const { getItemTotalQuantity, cart, addToCart, removeFromCart } = useCart();
  const hasCustomization = item.operationGroups?.length > 0;
  const totalQty = getItemTotalQuantity(item._id);

  // All cart entries for this item (may have different modifier combos)
  const cartEntries = cart.filter((e) => e.item._id === item._id);

  const handleAdd = () => {
    if (hasCustomization) {
      // Open modifier modal — it will call addToCart with chosen modifiers
      onCustomize(item);
    } else {
      addToCart(item, {});
    }
  };

  const handleDecrement = () => {
    if (cartEntries.length === 1) {
      // Only one variant in cart — decrement it directly
      removeFromCart(cartEntries[0].cartId);
    } else {
      // Multiple variants — open modal to let user pick which to remove
      onCustomize(item);
    }
  };

  if (totalQty === 0) {
    return (
      <button
        onClick={handleAdd}
        className="bg-white border-2 border-green-600 text-green-700 font-bold text-sm px-5 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform"
      >
        ADD
      </button>
    );
  }

  return (
    <div className="flex items-center bg-green-600 rounded-full shadow-sm overflow-hidden">
      <button
        onClick={handleDecrement}
        className="text-white font-bold text-lg w-8 h-8 flex items-center justify-center active:bg-green-700 transition-colors"
      >
        −
      </button>
      <span className="text-white font-bold text-sm w-5 text-center">
        {totalQty}
      </span>
      <button
        onClick={handleAdd}
        className="text-white font-bold text-lg w-8 h-8 flex items-center justify-center active:bg-green-700 transition-colors"
      >
        +
      </button>
    </div>
  );
}