// src/components/merchant/bill-and-payments/orderCard.jsx
import React, { useState, useEffect } from 'react';
import { Icons } from './icons';
import { PaymentMethodBadge } from './paymentMethodBadge';

export const OrderCard = ({ order, onGenerateBill, type }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Flatten all items across categories into a single array
  const allItems = order.categories.flatMap(cat =>
    cat.items.map(item => ({ ...item, categoryName: cat.name }))
  );

  const totalItemCount = allItems.reduce((acc, item) => acc + item.quantity, 0);

  // Show only first 2 items in the card preview
  const PREVIEW_LIMIT = 2;
  const previewItems = allItems.slice(0, PREVIEW_LIMIT);
  const hiddenCount = totalItemCount - previewItems.reduce((acc, i) => acc + i.quantity, 0);

  const tableNumber = order.tableQrId?.tableNumber || order.tableId || 'N/A';

  const getStatusBadge = () => {
    const statusColors = {
      PLACED:    'bg-blue-50 text-blue-600',
      PREPARING: 'bg-orange-50 text-orange-600',
      SERVED:    'bg-green-50 text-green-600',
      COMPLETED: 'bg-gray-50 text-gray-600',
    };
    return statusColors[order.orderStatus] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity .45s ease, transform .45s ease',
      }}
    >
      <div className="p-5">
        {/* Card header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              {Icons.receipt}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-gray-900">Table {tableNumber}</h3>
                <span className="text-[10px] text-gray-400 font-mono">#{order._id.slice(-6)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusBadge()}`}>
                  {order.orderStatus}
                </span>
                <p className="text-[11px] text-gray-400">{totalItemCount} items</p>
              </div>
            </div>
          </div>
          {type === 'paid' && order.paymentMethod && (
            <PaymentMethodBadge method={order.paymentMethod} />
          )}
        </div>

        {/* Items preview — max 2 items */}
        <div className="mb-3 space-y-1">
          {previewItems.map((item, idx) => (
            <div key={item._id || idx} className="flex justify-between items-center text-[12px]">
              <span className="text-gray-600 truncate max-w-[60%]">
                {item.quantity}× {item.name}
              </span>
              <span className="text-gray-400 tabular-nums">₹{item.price * item.quantity}</span>
            </div>
          ))}
          {hiddenCount > 0 && (
            <p className="text-[11px] text-gray-400 mt-0.5">+{hiddenCount} more item{hiddenCount !== 1 ? 's' : ''}</p>
          )}
        </div>

        {/* Total row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">Total Amount</span>
          <span className="text-[18px] font-bold text-gray-900 tabular-nums">
            ₹{order.billSummary.grandTotal.toLocaleString()}
          </span>
        </div>

        {/* Generate Bill button */}
        {type === 'unpaid' && (
          <button
            onClick={() => onGenerateBill(order)}
            className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {Icons.receipt}
            Generate Bill
          </button>
        )}
      </div>
    </div>
  );
};