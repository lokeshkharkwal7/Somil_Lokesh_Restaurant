import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function CartBar() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const { rest_id, table_id } = useParams();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center h-20 mb-16">
      <button
        onClick={() => navigate(`/${rest_id}/${table_id}/cart`)}
        className="w-full max-w-xl bg-green-600 text-white px-5 py-4 flex justify-between items-center shadow-xl shadow-green-900/20 active:scale-[0.98] transition-transform"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center">
              {totalItems}
            </span>
            <span className="font-semibold text-sm">
              items
            </span>
          </div>
          
          <span className="font-bold text-base">₹{totalPrice}</span>
        </div>

        <span className="font-bold text-base tracking-wide">View Cart →</span>

      </button>
    </div>
  );
}