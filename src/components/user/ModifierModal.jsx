import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function ModifierModal({ item, close }) {
  const { addToCart } = useCart();

  // Build initial selections: required single-select gets the default pre-selected
  const buildInitial = () => {
    const sel = {};
    item.operationGroups.forEach((group) => {
      if (group.maxSelect === 1) {
        const def = group.modifiers.find((m) => m.isDefault && m.isAvailable);
        sel[group._id] = def || null;
      } else {
        sel[group._id] = [];
      }
    });
    return sel;
  };

  const [selections, setSelections] = useState(buildInitial);

  const toggleSingle = (groupId, modifier) => {
    setSelections((prev) => ({ ...prev, [groupId]: modifier }));
  };

  const toggleMulti = (group, modifier) => {
    setSelections((prev) => {
      const current = prev[group._id] || [];
      const isSelected = current.some((m) => m._id === modifier._id);
      if (isSelected) {
        return { ...prev, [group._id]: current.filter((m) => m._id !== modifier._id) };
      }
      if (current.length >= group.maxSelect) return prev; // cap reached
      return { ...prev, [group._id]: [...current, modifier] };
    });
  };

  const isValid = () => {
    return item.operationGroups.every((group) => {
      if (!group.isRequired) return true;
      const sel = selections[group._id];
      if (group.maxSelect === 1) return sel !== null && sel !== undefined;
      return Array.isArray(sel) && sel.length >= group.minSelect;
    });
  };

  const handleConfirm = () => {
    if (!isValid()) return;
    addToCart(item, selections);
    close();
  };

  // Compute live price preview
  const extraPrice = Object.values(selections)
    .flat()
    .filter(Boolean)
    .reduce((sum, m) => sum + (m.price || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={close}
    >
      <div
        className="bg-white w-full max-w-xl rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto mb-14"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Item header */}
        <div className="flex items-start gap-3 mb-5 pb-4 border-b">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
          )}
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h2>
            <p className="text-green-700 font-semibold mt-0.5">
              ₹{item.price + extraPrice}
              {extraPrice > 0 && (
                <span className="text-gray-400 text-sm font-normal ml-1">
                  (₹{item.price} + ₹{extraPrice} extras)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Modifier Groups */}
        {item.operationGroups.map((group) => (
          <div key={group._id} className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{group.name}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  group.isRequired
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {group.isRequired ? "Required" : "Optional"}
                {group.maxSelect > 1 && ` · up to ${group.maxSelect}`}
              </span>
            </div>

            <div className="space-y-2">
              {group.modifiers
                .filter((m) => m.isAvailable)
                .map((modifier) => {
                  const isSingle = group.maxSelect === 1;
                  const isSelected = isSingle
                    ? selections[group._id]?._id === modifier._id
                    : (selections[group._id] || []).some((m) => m._id === modifier._id);

                  return (
                    <button
                      key={modifier._id}
                      onClick={() =>
                        isSingle
                          ? toggleSingle(group._id, modifier)
                          : toggleMulti(group, modifier)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Radio / Checkbox indicator */}
                        <div
                          className={`flex-shrink-0 ${
                            isSingle
                              ? "w-5 h-5 rounded-full border-2 flex items-center justify-center"
                              : "w-5 h-5 rounded-md border-2 flex items-center justify-center"
                          } ${
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                          {modifier.name}
                        </span>
                      </div>
                      {modifier.price > 0 && (
                        <span className={`text-sm font-semibold ${isSelected ? "text-green-600" : "text-gray-500"}`}>
                          +₹{modifier.price}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!isValid()}
          className={`w-full py-4 rounded-2xl font-bold text-base mt-2 transition-all ${
            isValid()
              ? "bg-green-600 text-white active:scale-[0.98] shadow-lg shadow-green-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Add to Cart · ₹{item.price + extraPrice}
        </button>
      </div>
    </div>
  );
}