// components/user/BottomNavBar.jsx
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function BottomNavBar({ activeTab = "menu" }) {
  const navigate = useNavigate();
  const { rest_id, table_id } = useParams();

  const handleCartClick = () => {
    navigate(`/${rest_id}/${table_id}/cart`);
  };

  const handleOrdersClick = () => {
    navigate(`/${rest_id}/${table_id}/my-orders`);
  };

  const handleMenuClick = () => {
    navigate(`/${rest_id}/${table_id}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {/* Menu Tab */}
        <button
          onClick={handleMenuClick}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "menu"
              ? "text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Icon
            icon={activeTab === "menu" ? "fluent:food-24-filled" : "fluent:food-24-regular"}
            width={24}
          />
          <span className="text-xs mt-1 font-medium">Menu</span>
        </button>

        {/* Cart Tab */}
        <button
          onClick={handleCartClick}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "cart"
              ? "text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Icon
            icon={activeTab === "cart" ? "fluent:cart-24-filled" : "fluent:cart-24-regular"}
            width={24}
          />
          <span className="text-xs mt-1 font-medium">Cart</span>
        </button>

        {/* Orders Tab */}
        <button
          onClick={handleOrdersClick}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "orders"
              ? "text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Icon
            icon={activeTab === "orders" ? "fluent:receipt-24-filled" : "fluent:receipt-24-regular"}
            width={24}
          />
          <span className="text-xs mt-1 font-medium">Orders</span>
        </button>
      </div>
    </div>
  );
}