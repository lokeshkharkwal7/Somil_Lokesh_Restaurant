// LiveOrders.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrders, useUpdateOrderStatus } from "../../../hooks/bills-and-payment";
import { useSocket } from "../../../context/socketContext";
import { BillModal } from "../../../components/merchant/bill-and-payments/billModal";

/* ---------------- ICONS ---------------- */
const Icons = {
  placed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  preparing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.29 7 12 12 20.71 7"/>
      <line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
  served: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  completed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  all: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  spinner: (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  notification: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  printer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  ),
  receipt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="14" y2="14" />
    </svg>
  )
};

/* ---------------- DATA ---------------- */
const STATUS_TABS = [
  { key: "PLACED", label: "Placed", icon: Icons.placed, accent: "yellow" },
  { key: "PREPARING", label: "Preparing", icon: Icons.preparing, accent: "orange" },
  { key: "SERVED", label: "Served", icon: Icons.served, accent: "blue" },
  { key: "COMPLETED", label: "Completed", icon: Icons.completed, accent: "green" },
  { key: "ALL", label: "All Orders", icon: Icons.all, accent: "purple" }
];

const ACCENT_MAP = {
  yellow: { 
    light: "bg-yellow-50", 
    iconBg: "bg-yellow-500", 
    text: "text-yellow-600", 
    border: "border-yellow-100", 
    badge: "bg-yellow-100 text-yellow-700",
    button: "bg-yellow-600 hover:bg-yellow-700"
  },
  orange: { 
    light: "bg-orange-50", 
    iconBg: "bg-orange-500", 
    text: "text-orange-600", 
    border: "border-orange-100", 
    badge: "bg-orange-100 text-orange-700",
    button: "bg-orange-600 hover:bg-orange-700"
  },
  blue: { 
    light: "bg-blue-50", 
    iconBg: "bg-blue-500", 
    text: "text-blue-600", 
    border: "border-blue-100", 
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700"
  },
  green: { 
    light: "bg-green-50", 
    iconBg: "bg-green-500", 
    text: "text-green-600", 
    border: "border-green-100", 
    badge: "bg-green-100 text-green-700",
    button: "bg-green-600 hover:bg-green-700"
  },
  purple: { 
    light: "bg-purple-50", 
    iconBg: "bg-purple-500", 
    text: "text-purple-600", 
    border: "border-purple-100", 
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700"
  }
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

/* ---------------- STATUS TAB ---------------- */
const StatusTab = ({ tab, active, onClick, count, delay }) => {
  const [visible, setVisible] = useState(false);
  const { light, text } = ACCENT_MAP[tab.accent];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ${
        active 
          ? `${light} ${text}` 
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms`
      }}
    >
      <div className={`w-8 h-8 rounded-lg ${active ? text : 'text-gray-400'} flex items-center justify-center`}>
        {tab.icon}
      </div>
      <span className="text-[13px] font-medium">{tab.label}</span>
      {count > 0 && (
        <span className={`ml-auto px-2 py-0.5 text-[11px] rounded-full ${
          active ? 'bg-white/50' : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

/* ---------------- ORDER CARD ---------------- */
const OrderCard = ({ order, onStatusUpdate, onViewBill, isUpdating }) => {
  const [showAllItems, setShowAllItems] = useState(false);
  const items = order.categories?.flatMap(cat => cat.items) || [];
  const statusTab = STATUS_TABS.find(t => t.key === order.orderStatus);
  const { light, text, border, badge } = ACCENT_MAP[statusTab?.accent || 'purple'];
  
  // Show only first 2 items if not expanded
  const displayedItems = showAllItems ? items : items.slice(0, 2);
  const hasMoreItems = items.length > 2;

  const getActionButton = () => {
    const actions = {
      PLACED: { 
        next: "PREPARING", 
        label: "Accept & Prepare", 
        color: "bg-green-600 hover:bg-green-700" 
      },
      PREPARING: { 
        next: "SERVED", 
        label: "Mark as Served", 
        color: "bg-blue-600 hover:bg-blue-700" 
      },
      SERVED: { 
        next: null,
        label: "View Bill & Complete", 
        color: "bg-gray-900 hover:bg-gray-800",
        onClick: () => onViewBill(order)
      }
    };

    const action = actions[order.orderStatus];
    if (!action) return null;
    
    return (
      <button
        onClick={() => action.onClick ? action.onClick() : onStatusUpdate(order._id, action.next)}
        disabled={isUpdating}
        className={`w-full ${action.color} text-white text-[13px] font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      >
        {isUpdating && Icons.spinner}
        {action.label}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300">
      {/* Card Header */}
      <div className={`px-5 pt-5 pb-3 border-b ${border}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-[15px] font-semibold text-gray-900">
              Table {order.tableQrId?.tableNumber || order.tableId || 'N/A'}
            </h3>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${badge}`}>
              <span className="text-[11px] font-medium">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          {Icons.clock}
          <span>{timeAgo(order.createdAt)}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-5 py-4">
        <div className="space-y-3">
          {displayedItems.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-600">
                  <span className="font-medium text-gray-900">{item.quantity}×</span> {item.name}
                </span>
                <span className="text-gray-700 font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
              
              {/* Modifiers */}
              {item.operationGroups?.map((group, gi) => (
                group.modifiers?.map((mod, mi) => (
                  <div key={`${gi}-${mi}`} className="flex items-center justify-between text-[12px] ml-4 mt-1 text-gray-400">
                    <span>+ {mod.name}</span>
                    <span>{formatCurrency(mod.price)}</span>
                  </div>
                ))
              ))}
            </div>
          ))}
          
          {/* Show More/Less Button */}
          {hasMoreItems && (
            <button
              onClick={() => setShowAllItems(!showAllItems)}
              className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 mt-2 font-medium"
            >
              {showAllItems ? (
                <>
                  {Icons.eyeOff}
                  <span>Show less</span>
                </>
              ) : (
                <>
                  {Icons.eye}
                  <span>+{items.length - 2} more items</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Total Amount Only */}
      <div className="px-5 py-3 bg-[#F2F2F7] border-y border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-medium text-gray-700">Total Amount</span>
          <span className="text-[15px] font-bold text-gray-900">
            {formatCurrency(order.billSummary?.grandTotal)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 py-4">
        {getActionButton()}
        {order.orderStatus === "COMPLETED" && (
          <div className="text-center text-[12px] text-gray-400 py-2">
            Order completed
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function LiveOrders() {
  const [status, setStatus] = useState("PLACED");
  const [time, setTime] = useState(new Date());
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const { rest_id } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  // React Query hooks
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useOrders({
    rest_id,
    orderStatus: status === "ALL" ? undefined : status,
    pagination: "true",
    limit: 50,
    sort: "-createdAt" // Show newest orders first
  }, {
    enabled: !!rest_id,
    refetchInterval: isConnected ? false : 30000, // Only poll if socket disconnected
    onSuccess: (data) => {
      console.log('Orders fetched:', data);
    }
  });

  const updateStatusMutation = useUpdateOrderStatus();

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      console.log('🔔 New order placed:', data);
      
      // Show alert
      setNewOrderId(data.orderId);
      setShowNewOrderAlert(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowNewOrderAlert(false);
        setNewOrderId(null);
      }, 5000);

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🆕 New Order!', {
          body: `Order #${data.orderId.slice(-8)} has been placed`,
          icon: '/logo192.png',
          badge: '/badge.png',
          vibrate: [200, 100, 200]
        });
      }

      // Play sound (optional)
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (e) {
        console.log('Audio not supported');
      }

      // Refetch orders to get the new data
      refetch();
    };

    const handleOrderUpdate = (data) => {
      console.log('📝 Order updated:', data);
      refetch();
    };

    socket.on('order:placed', handleNewOrder);
    socket.on('order:updated', handleOrderUpdate);

    return () => {
      socket.off('order:placed', handleNewOrder);
      socket.off('order:updated', handleOrderUpdate);
    };
  }, [socket, refetch]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    updateStatusMutation.mutate({
      _id: orderId,
      orderStatus: newStatus
    });
  };

  const handleMarkAsPaid = (orderId, paymentMethod) => {
    // First update payment method
    // Then update status to COMPLETED
    updateStatusMutation.mutate({
      _id: orderId,
      orderStatus: "COMPLETED",
      paymentMethod: paymentMethod
    });
    setIsBillModalOpen(false);
    setSelectedOrder(null);
  };

  const handleViewBill = (order) => {
    setSelectedOrder(order);
    setIsBillModalOpen(true);
  };

  const handleBack = () => {
    navigate(`/merchant/${rest_id}`);
  };

  const getCountByStatus = (statusKey) => {
    if (!data?.data) return 0;
    if (statusKey === "ALL") return data.data.length;
    return data.data.filter(o => o.orderStatus === statusKey).length;
  };

  const orders = data?.data || [];
  const totalOrders = data?.data?.length || 0;

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* Bill Modal */}
      <BillModal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onMarkPaid={handleMarkAsPaid}
        isReadOnly={selectedOrder?.orderStatus === "COMPLETED"}
      />

      {/* New Order Alert */}
      {showNewOrderAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              🆕
            </div>
            <div>
              <p className="font-medium">New Order Received!</p>
              <p className="text-sm text-white/80">Order #{newOrderId?.slice(-8)}</p>
            </div>
            <button 
              onClick={() => setShowNewOrderAlert(false)}
              className="ml-4 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 hover:bg-gray-100 hover:shadow-md flex items-center justify-center text-black transition-all duration-200"
              title="Go Back"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-[10px] bg-gray-900 flex items-center justify-center text-white">
              📋
            </div>
            <p className="font-bold text-gray-900">Live Orders</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            
            {/* Refetch indicator */}
            {isFetching && (
              <div className="w-6 h-6 flex items-center justify-center">
                {Icons.spinner}
              </div>
            )}
            
            <span className="text-[13px] text-gray-400 tabular-nums">
              {time.toLocaleTimeString()}
            </span>
            
            {/* Order count badge */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
                {orders.length}
              </div>
              {totalOrders > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">
                  {totalOrders > 9 ? '9+' : totalOrders}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Page Header */}
        <div className="flex items-start gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {time.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <h2 className="text-[34px] font-bold text-gray-900">
              Order Management
            </h2>

            <p className="text-gray-400 text-[14px] mt-1">
              {isConnected ? '🔴 Live updates enabled' : '📡 Offline mode - Updates every 30s'}
            </p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Filter by Status
            </h3>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab, i) => (
              <StatusTab
                key={tab.key}
                tab={tab}
                active={status === tab.key}
                onClick={() => setStatus(tab.key)}
                count={getCountByStatus(tab.key)}
                delay={i * 70}
              />
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12">
                {Icons.spinner}
              </div>
              <p className="text-gray-400 text-[14px]">Loading orders...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-50 flex items-center justify-center text-red-400 text-2xl">
              ⚠️
            </div>
            <p className="text-red-400 text-[14px] mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order, i) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                onViewBill={handleViewBill}
                isUpdating={updateStatusMutation.isPending && updateStatusMutation.variables?._id === order._id}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              {Icons.all}
            </div>
            <p className="text-gray-400 text-[14px] mb-2">No orders to display</p>
            <p className="text-gray-300 text-[12px]">
              {status === "ALL" 
                ? "There are no orders in your restaurant yet" 
                : `No ${status.toLowerCase()} orders found`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}