// src/pages/merchant/bills-and-payment/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useOrders, useUpdateOrderStatus } from "../../../hooks";
import { MenuLoader } from '../../../components/merchant/bill-and-payments/menuLoader';
import { DateFilter } from '../../../components/merchant/bill-and-payments/dateFilter';
import { StatCard } from '../../../components/merchant/bill-and-payments/statCard';
import { TabButton } from '../../../components/merchant/bill-and-payments/tabButton';
import { OrderCard } from '../../../components/merchant/bill-and-payments/orderCard';
import { BillModal } from '../../../components/merchant/bill-and-payments/billModal';
import { Icons } from '../../../components/merchant/bill-and-payments/icons';
import { PaymentMethodBadge } from '../../../components/merchant/bill-and-payments/paymentMethodBadge';

// Add the animation styles directly in the component
const styles = `
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`;

export default function BillsPayment() {
  const { rest_id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [time, setTime] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get page from URL or default to 1
  const [paidPage, setPaidPage] = useState(1);
  
  // Get active tab from URL (default to 'paid')
  const activeTab = searchParams.get('tab') || 'paid';
  
  // Get dates from URL - if not present, set defaults
  const today = new Date().toISOString().split('T')[0];
  const startDate = searchParams.get('startDate') || today;
  const endDate = searchParams.get('endDate') || today;
  
  const [hasMorePaid, setHasMorePaid] = useState(true);
  const [allPaidOrders, setAllPaidOrders] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const loaderRef = useRef(null);

  // Set default dates in URL on initial load
  useEffect(() => {
    if (!isInitialized) {
      const params = new URLSearchParams(searchParams);
      let needsUpdate = false;
      
      // Set default startDate if not present
      if (!params.has('startDate')) {
        params.set('startDate', today);
        needsUpdate = true;
      }
      
      // Set default endDate if not present
      if (!params.has('endDate')) {
        params.set('endDate', today);
        needsUpdate = true;
      }
      
      // Set default tab if not present
      if (!params.has('tab')) {
        params.set('tab', 'paid');
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        setSearchParams(params);
      }
      
      setIsInitialized(true);
    }
  }, [searchParams, setSearchParams, today, isInitialized]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    setSearchParams(params);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(`/merchant/${rest_id}`);
  };

  // Fetch completed orders with pagination and date filters from URL
  const { 
    data: completedOrdersData, 
    isLoading: completedLoading,
    isFetching: completedFetching,
    error: completedError,
  } = useOrders({ 
    rest_id,
    orderStatus: ['COMPLETED'],
    page: paidPage, 
    limit: 10,
    startDate,
    endDate,
    pagination: true
  }, {
    enabled: isInitialized // Only fetch after URL is initialized
  });

  const updateOrderStatus = useUpdateOrderStatus();

  // Update time
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Reset pagination when URL params change (dates only)
  useEffect(() => {
    if (isInitialized) {
      setPaidPage(1);
      setAllPaidOrders([]);
      setHasMorePaid(true);
    }
  }, [startDate, endDate, isInitialized]);

  // Append paid orders when new data arrives
  useEffect(() => {
    if (completedOrdersData?.data && isInitialized) {
      if (paidPage === 1) {
        setAllPaidOrders(completedOrdersData.data);
      } else {
        setAllPaidOrders(prev => [...prev, ...completedOrdersData.data]);
      }
      setHasMorePaid(paidPage < (completedOrdersData.meta?.totalPages || 1));
    }
  }, [completedOrdersData, paidPage, isInitialized]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMorePaid && !completedFetching) {
          setPaidPage(prev => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMorePaid, completedFetching]);

  // Filter orders based on search
  const filteredPaid = allPaidOrders.filter(order => {
    const tableNumber = order.tableQrId?.tableNumber || order.tableId || '';
    return tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableQrId?.qrNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate statistics
  const totalSales = allPaidOrders.reduce((acc, order) => acc + order.billSummary.grandTotal, 0);
  const totalBills = allPaidOrders.length;
  const paidCount = allPaidOrders.length;
  const averageBill = allPaidOrders.length > 0 ? Math.round(totalSales / allPaidOrders.length) : 0;

  const handleGenerateBill = (order) => {
    setSelectedOrder(order);
    setIsBillModalOpen(true);
  };

  const handleMarkPaid = async (orderId, paymentMethod) => {
    try {
      await updateOrderStatus.mutateAsync({
        _id: orderId,
        orderStatus: 'COMPLETED'
      });
      setIsBillModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to mark order as paid:', error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsBillModalOpen(true);
  };

  // Show loader while initializing URL params
  if (!isInitialized) {
    return <MenuLoader />;
  }

  // Loading state
  const isLoading = completedLoading && paidPage === 1 && !allPaidOrders.length;

  if (isLoading) {
    return <MenuLoader />;
  }

  // Error state
  const hasError = completedError && paidPage === 1 && !allPaidOrders.length;

  if (hasError) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            {Icons.close}
          </div>
          <p className="text-gray-400">Error loading orders</p>
          <p className="text-[12px] text-gray-300 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      {/* Inject the animation styles */}
      <style>{styles}</style>
      
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 hover:bg-gray-100 hover:shadow-md flex items-center justify-center text-black transition-all duration-200"
              title="Go to Dashboard"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-white">
              {Icons.dollar}
            </div>
            <p className="font-bold text-gray-900">Bills & Payments</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-400 tabular-nums">
              {time.toLocaleTimeString()}
            </span>
            <div className="animate-spin-slow">
              {Icons.clock}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {/* Header Row */}
          <div className="flex items-start gap-3 mb-3">
            <div>
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-[0.2em]">
                Financial Overview
              </p>
              <h2 className="text-[34px] font-bold text-gray-900 leading-tight">
                Bills & Payments
              </h2>
              <p className="text-gray-500 text-[14px] mt-1">
                Track and manage all completed payments
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Sales"
            value={`₹${completedOrdersData?.meta?.totalRevenue?.toLocaleString() ?? '0'}`}
            icon={Icons.trendingUp}
            accent="green"
          />
          {/* <StatCard
            label="Total Bills"
            value={completedOrdersData?.meta?.totalRecords ?? 0}
            icon={Icons.fileText}
            accent="blue"
          /> */}
          <StatCard
            label="Paid Orders"
            value={paidCount}
            icon={Icons.check}
            accent="green"
          />
          {/* <StatCard
            label="Average Bill"
            value={`₹${averageBill}`}
            icon={Icons.users}
            accent="purple"
          /> */}
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Paid Bills</h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
              {paidCount} orders
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by table or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                {Icons.search}
              </span>
            </div>

            <DateFilter />
          </div>
        </div>

        {filteredPaid.length > 0 ? (
          <>
            {/* List View for Paid Bills */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Table No.</div>
                  <div className="col-span-3">Order ID</div>
                  <div className="col-span-3">Date & Time</div>
                  <div className="col-span-2">Total Amount</div>
                  <div className="col-span-2">Payment Method</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredPaid.map((order, index) => {
                  const tableNumber = order.tableQrId?.tableNumber || order.tableId || 'N/A';
                  const orderDate = order.updatedAt ? new Date(order.updatedAt) : new Date(order.createdAt);
                  
                  return (
                    <div
                      key={order._id}
                      className="group hover:bg-gray-50/50 transition-all duration-200 cursor-pointer"
                      style={{ 
                        animation: `slideIn 300ms ${index * 50}ms ease both`
                      }}
                      onClick={() => handleViewDetails(order)}
                    >
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Table Number */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M6 14h6m-6 4h12M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                                </svg>
                              </div>
                              <span className="font-semibold text-gray-900">
                                Table {tableNumber}
                              </span>
                            </div>
                          </div>

                          {/* Order ID */}
                          <div className="col-span-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-mono text-gray-700">
                                #{order._id.slice(-8).toUpperCase()}
                              </span>
                              <span className="text-[10px] text-gray-400 mt-0.5">
                                {order.items?.length || 0} items
                              </span>
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="col-span-3">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div>
                                <p className="text-sm text-gray-700">
                                  {orderDate.toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {orderDate.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Total Amount */}
                          <div className="col-span-2">
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold text-emerald-600">
                                ₹{order.billSummary.grandTotal}
                              </span>
                            </div>
                          </div>

                          {/* Payment Method & Actions */}
                          <div className="col-span-2">
                            <div className="flex items-center justify-between gap-3">
                              {order.paymentMethod && (
                                <PaymentMethodBadge method={order.paymentMethod} />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(order);
                                }}
                                className="px-3 py-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg transition-all duration-200 flex items-center gap-1 group/btn"
                              >
                                <span>View</span>
                                <svg className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview (on hover) */}
                        <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">Items:</span>
                            <div className="flex flex-wrap gap-2">
                              {order.items?.slice(0, 3).map((item, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-50 rounded-md">
                                  {item.quantity}x {item.name}
                                </span>
                              ))}
                              {order.items?.length > 3 && (
                                <span className="text-gray-400">
                                  +{order.items.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div ref={loaderRef} className="py-8 text-center">
              {completedFetching && (
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="text-[13px] text-gray-500">Loading more orders...</p>
                </div>
              )}
              {!hasMorePaid && allPaidOrders.length > 0 && (
                <p className="text-[13px] text-gray-400">✨ You've reached the end ✨</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-[15px] font-medium">No paid bills yet</p>
            <p className="text-[12px] text-gray-400 mt-1">Completed orders will appear here</p>
          </div>
        )}
      </main>

      <BillModal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        isReadOnly={true}
      />
    </div>
  );
}