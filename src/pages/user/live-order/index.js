// OrderTracker.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import useOrderSocket from '../../../hooks/user-order-socket';
import BottomNavBar from '../../../components/user/BottomNavBar';
import { Icon } from "@iconify/react";

// Refined SVG Icons with iOS-style thin lines
const Icons = {
  Placed: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Preparing: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Served: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 10h18M5 6h14M6 14h12M8 18h8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Cancelled: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6v6l3 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Location: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bike: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5.5" cy="17.5" r="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18.5" cy="17.5" r="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 5l3 5h-5l-2-3-4 3 2 4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Info: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8v5M12 16h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Restaurant: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 11h18M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8M7 7V4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5V7M12 7V4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5V7M17 7V4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5V7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bill: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16v16H4V4z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Status configuration
const STATUS_CONFIG = {
  PLACED: {
    label: 'Order Placed',
    shortLabel: 'Placed',
    icon: Icons.Placed,
    message: "We've received your order",
    progress: 0,
    timeText: 'Preparing soon'
  },
  PREPARING: {
    label: 'Preparing',
    shortLabel: 'Preparing',
    icon: Icons.Preparing,
    message: 'Your food is being prepared',
    progress: 50,
    timeText: 'In progress'
  },
  SERVED: {
    label: 'Served',
    shortLabel: 'Served',
    icon: Icons.Served,
    message: 'Your order has been served. Enjoy!',
    progress: 100,
    timeText: 'Enjoy your meal!'
  },
  CANCELLED: {
    label: 'Cancelled',
    shortLabel: 'Cancelled',
    icon: Icons.Cancelled,
    message: 'Order has been cancelled',
    progress: 0,
    timeText: 'Cancelled'
  }
};

// Timeline only covers the three active stages
const STATUS_ORDER = ['PLACED', 'PREPARING', 'SERVED'];

const OrderTracker = () => {
  const { orderId } = useParams();
  const { rest_id, table_id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('10-15 min');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleOrderUpdate = useCallback((data) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      orderStatus: data.status
    }));

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Order Updated', {
        body: STATUS_CONFIG[data.status]?.message || 'Your order status has changed',
        icon: '/logo192.png',
        silent: true
      });
    }
  }, []);

  const { isConnected } = useOrderSocket(
    orderId,
    order?.rest_id,
    order?.tableQrId,
    handleOrderUpdate
  );

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        params: { _id: orderId }
      });

      if (response.data.success) {
        setOrder(response.data.data);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, [orderId, API_BASE_URL]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Polling fallback when socket is disconnected and order is still active
  useEffect(() => {
    const isTerminal = order?.orderStatus === 'SERVED' || order?.orderStatus === 'CANCELLED';
    if (!isConnected && !isTerminal) {
      const interval = setInterval(fetchOrder, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, fetchOrder, order?.orderStatus]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (order?.orderStatus === 'PREPARING') {
      const timer = setTimeout(() => setEstimatedTime('5-10 min'), 5000);
      return () => clearTimeout(timer);
    }
  }, [order?.orderStatus]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const calculateItemTotal = (item) => {
    let total = item.price * item.quantity;
    item.operationGroups?.forEach(group => {
      group.modifiers?.forEach(mod => {
        total += mod.price * item.quantity;
      });
    });
    return total;
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-5 py-6 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          
          {/* Loading cards */}
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="ml-4 flex-1">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-white rounded-2xl p-6 shadow-sm h-48" />
          <div className="mt-4 bg-white rounded-2xl p-6 shadow-sm h-64" />
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-xs text-center">
          <div className="mb-4 text-gray-400 flex justify-center">
            <Icons.Cancelled />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load order</h2>
          <p className="text-gray-500 text-sm mb-6">{error || 'Order not found'}</p>
          <button
            onClick={fetchOrder}
            className="w-full py-3.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PLACED;
  const StatusIcon    = currentStatus.icon;
  const isServed      = order.orderStatus === 'SERVED';
  const isCancelled   = order.orderStatus === 'CANCELLED';
  const isTerminal    = isServed || isCancelled;
  const currentIndex  = STATUS_ORDER.indexOf(order.orderStatus);

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 mb-16">
{/* Sticky Header */}
<div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
  <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/${rest_id}/${table_id}/my-orders`)}
                  aria-label="Go back"
                  className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center
                     text-stone-600 active:bg-stone-100 transition-all
                     hover:bg-stone-100 border border-stone-200/50"
                >
                  <Icon icon="fluent:arrow-left-24-filled" width={20} className="text-stone-600" />
                </button>
      {/* Custom SVG for tracking orders */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-gray-900"
      >
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <h1 className="text-lg font-semibold text-gray-900">Track Order</h1>
    </div>
    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
      #{order._id.slice(-6).toUpperCase()}
    </span>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-5 py-6 space-y-4">
        
        {/* Card 1: Live Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start">
            <div className={`p-3 bg-gray-50 rounded-xl ${!isTerminal ? 'animate-pulse' : ''}`}>
              <StatusIcon />
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {currentStatus.label}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                {currentStatus.message}
              </p>
              {!isTerminal && (
                <div className="flex items-center text-xs text-gray-500">
                  <Icons.Clock />
                  <span className="ml-1">Est. {estimatedTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar — hidden for cancelled orders */}
          {!isCancelled && (
            <div className="mt-5">
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${currentStatus.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Served Banner (only when served) */}
        {isServed && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <Icons.Check />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Order Served</h3>
                <p className="text-sm text-gray-600">Your food has arrived at your table</p>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <Icons.Clock />
            <h3 className="text-sm font-semibold text-gray-900 ml-2">Order Timeline</h3>
          </div>
          
          <div className="space-y-3">
            {STATUS_ORDER.map((status, index) => {
              const config = STATUS_CONFIG[status];
              const TimelineIcon = config.icon;
              const isActive = index <= currentIndex && !isCancelled;
              const isCurrent = order.orderStatus === status;
              const isPast = index < currentIndex && !isCancelled;

              return (
                <div key={status} className="flex items-start">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-gray-900 text-white ring-4 ring-gray-100' // Current - black bg with ring
                        : isPast
                          ? 'bg-gray-900 text-white' // Past completed - black bg
                          : 'bg-gray-50 text-gray-300' // Future - light gray
                    }`}>
                      {isPast ? <Icons.Check /> : <TimelineIcon />}
                    </div>
                    {index < STATUS_ORDER.length - 1 && (
                      <div className={`absolute left-5 top-10 w-0.5 h-8 ${
                        isPast ? 'bg-gray-900' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="ml-4 flex-1 pb-6">
                    <div className={`transition-all ${
                      isCurrent 
                        ? 'bg-gray-900 text-white px-4 py-3 rounded-xl -mt-2 -ml-2 shadow-md' 
                        : ''
                    }`}>
                      <div className="flex items-center">
                        <span className={`text-sm font-semibold ${
                          isCurrent 
                            ? 'text-white' 
                            : isActive 
                              ? 'text-gray-900' 
                              : 'text-gray-300'
                        }`}>
                          {config.label}
                        </span>
                      </div>
                      {isCurrent && (
                        <p className="text-xs text-gray-200 mt-1">
                          {config.timeText}
                        </p>
                      )}
                    </div>
                    {!isCurrent && isActive && (
                      <p className="text-xs text-gray-500 mt-1">
                        {index < currentIndex ? 'Completed' : config.timeText}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 4: Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Icons.Bill />
              <h3 className="text-sm font-semibold text-gray-900 ml-2">Order Summary</h3>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {order.categories?.length || 0} items
            </span>
          </div>

          <div className="space-y-4 mb-4">
            {order.categories?.map((category, catIdx) => (
              <div key={catIdx} className="space-y-2">
                {category.items?.map((item, itemIdx) => {
                  const itemTotal = calculateItemTotal(item);
                  return (
                    <div key={itemIdx} className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-400 w-6">
                            {item.quantity}x
                          </span>
                          <span className="text-sm text-gray-900">{item.name}</span>
                        </div>
                        {item.operationGroups?.map((group, groupIdx) => (
                          <div key={groupIdx} className="mt-1">
                            {group.modifiers?.map((mod, modIdx) => (
                              <div key={modIdx} className="flex items-center text-xs pl-6">
                                <span className="text-gray-400">{mod.name}</span>
                                <span className="text-gray-400 ml-1">
                                  (+{formatCurrency(mod.price)})
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900 tabular-nums">
                        {formatCurrency(itemTotal)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bill Details */}
          {order.billSummary && (
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 tabular-nums">
                  {formatCurrency(order.billSummary.subTotal || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900 tabular-nums">
                  {formatCurrency(order.billSummary.totalTax || 0)}
                </span>
              </div>
              {order.billSummary.serviceCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service charge</span>
                  <span className="text-gray-900 tabular-nums">
                    {formatCurrency(order.billSummary.serviceCharge || 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 mt-2 border-t border-gray-100">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-base font-semibold text-gray-900 tabular-nums">
                  {formatCurrency(order.billSummary.grandTotal || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <Icons.Info />
              <span className="text-xs text-gray-500 ml-2">Payment</span>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-full ${
              order.paymentStatus === 'PAID'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {order.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Card 6: Action Buttons — only for CANCELLED now */}
        {isCancelled && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-4">Need help with this order?</p>
            <button className="w-full py-3.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors">
              Contact Support
            </button>
          </div>
        )}

        <BottomNavBar activeTab="orders" />
        

      </div>
    </div>
  );
};

export default OrderTracker;