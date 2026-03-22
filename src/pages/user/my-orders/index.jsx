// pages/user/my-orders.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useInfiniteOrders } from "../../../hooks/bills-and-payment";
import LoadingSpinner from "../../../components/user/LoadingSpinner";
import ErrorMessage from "../../../components/user/ErrorMessage";
import BottomNavBar from "../../../components/user/BottomNavBar";

// Extracted Background component (same as from CartPage)
function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f8fafc]">
      {/* Gradient Background - slightly more blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4fa] via-[#ffffff] to-[#f5f7fc]"></div>

      {/* Blurred Circles - slightly increased opacity for more presence */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#007aff] opacity-[0.08] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#5856d6] opacity-[0.06] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#007aff] via-[#5856d6] to-[#ff2d55] opacity-[0.03] rounded-full blur-3xl"></div>
      </div>

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      ></div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 122, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 255, 0.04) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  );
}

const ORDER_STATUS_COLORS = {
  PLACED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PREPARING: "bg-blue-100 text-blue-800 border-blue-200",
  SERVED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const ORDER_STATUS_ICONS = {
  PLACED: "fluent:clock-20-filled",
  PREPARING: "fluent:chef-hat-20-filled",
  SERVED: "fluent:checkmark-circle-20-filled",
  COMPLETED: "fluent:checkmark-starburst-20-filled",
  CANCELLED: "fluent:dismiss-circle-20-filled",
};

const ORDER_STATUS_PRIORITY = {
  PLACED: 1,
  PREPARING: 2,
  SERVED: 3,
};

export default function MyOrders() {
  const { rest_id, table_id } = useParams();
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  // Prepare filters for the API call
  const filters = {
    rest_id: rest_id,
    tableQrId: table_id,
    orderStatus: ["PREPARING", "PLACED", "SERVED"],
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteOrders(filters);

  // Sort orders by status priority (PLACED → PREPARING → SERVED)
  const sortOrdersByStatus = (orders) => {
    return [...orders].sort((a, b) => {
      const priorityA = ORDER_STATUS_PRIORITY[a.orderStatus] || 999;
      const priorityB = ORDER_STATUS_PRIORITY[b.orderStatus] || 999;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // If same priority, sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleOrderClick = (orderId) => {
    navigate(`/${rest_id}/${table_id}/orders/${orderId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "PLACED":
        return "Order confirmed, waiting for preparation";
      case "PREPARING":
        return "Chef is preparing your order";
      case "SERVED":
        return "Order has been served";
      default:
        return "Processing your order";
    }
  };

  // Refresh orders when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <>
        <Background />
        <div className="max-w-xl mx-auto min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <BottomNavBar activeTab="orders" />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Background />
        <div className="max-w-xl mx-auto min-h-screen pb-24">
          <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
            <div className="px-4 py-4">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Icon icon="fluent:receipt-24-filled" width={24} className="text-emerald-600" />
                My Orders
              </h1>
            </div>
          </div>
          <div className="p-4">
            <ErrorMessage 
              message={error?.message || "Failed to load orders"} 
              onRetry={() => refetch()}
            />
          </div>
        </div>
        <BottomNavBar activeTab="orders" />
      </>
    );
  }

  // Get all orders from all pages
  const allOrders = data?.pages.flatMap((page) => page.data) || [];
  const sortedOrders = sortOrdersByStatus(allOrders);

  return (
    <>
      <Background />
      <div className="max-w-xl mx-auto min-h-screen pb-24 relative">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Icon icon="fluent:receipt-24-filled" width={24} className="text-emerald-600" />
                  My Orders
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Track your active orders
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Refresh orders"
              >
                <Icon icon="fluent:arrow-clockwise-20-filled" width={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Orders List - Flat list without section titles */}
        <div className="p-4 space-y-4">
          {sortedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-50 to-stone-50 flex items-center justify-center text-6xl shadow-2xl shadow-emerald-100/50 animate-float">
                  📋
                </div>
              </div>
              <h2 className="text-2xl font-bold text-stone-800 tracking-tight mb-2">
                No active orders
              </h2>
              <p className="text-stone-400 text-center max-w-[250px]">
                Your orders will appear here once you place them from the menu
              </p>
            </div>
          ) : (
            <>
              {/* Render all orders as a flat list */}
              {sortedOrders.map((order, index) => (
                <div
                  key={order._id}
                  onClick={() => handleOrderClick(order._id)}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg shadow-stone-200/40 border border-white/50 p-4 cursor-pointer hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                  style={{ 
                    animation: `slideIn 400ms ${index * 80}ms ease both`
                  }}
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </span>
                        {order.orderStatus === "SERVED" && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            Ready
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Icon icon="fluent:clock-12-regular" width={12} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${ORDER_STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-800"}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2 mb-3">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span className="font-medium text-gray-500">{item.quantity}x</span>
                          <span className="truncate max-w-[180px]">{item.name}</span>
                        </span>
                        <span className="text-gray-800 font-medium tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-xs text-gray-400">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Icon icon="fluent:money-12-filled" width={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">Total</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600 tabular-nums">
                      {formatPrice(order.billSummary?.grandTotal || order.totalAmount)}
                    </span>
                  </div>

                  {/* Status Message */}
                  <div className="mt-3 flex items-center gap-2 text-xs bg-gray-50/80 rounded-lg p-2">
                    <div className={`w-2 h-2 rounded-full ${
                      order.orderStatus === "PLACED" ? "bg-yellow-600 animate-pulse" :
                      order.orderStatus === "PREPARING" ? "bg-blue-600 animate-pulse" :
                      "bg-green-600"
                    }`}></div>
                    <span className="text-gray-600">
                      {getStatusMessage(order.orderStatus)}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Loading Indicator for infinite scroll */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                <span className="text-sm text-gray-500">Loading more orders...</span>
              </div>
            </div>
          )}

          {/* End of list message */}
          {!hasNextPage && sortedOrders.length > 0 && (
            <div className="text-center py-4">
              <p className="text-xs text-gray-400">You've reached the end</p>
            </div>
          )}

          {/* Intersection Observer Target */}
          <div ref={loaderRef} style={{ height: "20px" }} />
        </div>
      </div>

      <BottomNavBar activeTab="orders" />
    </>
  );
}

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;
document.head.appendChild(style);