// src/components/merchant/bill-and-payments/billModal.jsx
import React, { Fragment, useState, useEffect } from 'react';
import { Icons } from './icons';

export const BillModal = ({ isOpen, onClose, order, onMarkPaid, isReadOnly = false }) => {
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  // Reset payment method when order changes
  useEffect(() => {
    if (order?.paymentMethod) {
      setPaymentMethod(order.paymentMethod);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const calculateItemTotal = (item) => {
    let total = item.price * item.quantity;
    if (item.operationGroups && item.operationGroups.length > 0) {
      item.operationGroups.forEach(group => {
        if (group.modifiers && group.modifiers.length > 0) {
          group.modifiers.forEach(modifier => {
            total += modifier.price || 0;
          });
        }
      });
    }
    return total;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
  };

  const tableNumber = order.tableQrId?.tableNumber || order.tableId || 'N/A';
  const tableQrNumber = order.tableQrId?.qrNumber || '';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
              {Icons.receipt}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">Bill #{order._id.slice(-6)}</h3>
              <p className="text-[11px] text-gray-400">Table {tableNumber} {tableQrNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            {Icons.close}
          </button>
        </div>

        {/* Restaurant Info - Fixed */}
        <div className="px-6 pt-6 pb-2">
          <div className="text-center">
            <h2 className="text-[20px] font-bold text-gray-900">Your Restaurant Name</h2>
            <p className="text-[11px] text-gray-400">123 Main Street, City • GST: 1234567890</p>
            <p className="text-[11px] text-gray-400 mt-1">Bill Date: {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <div className="border-t border-gray-100 py-4">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0 bg-white">
                <tr className="text-[11px] text-gray-400 uppercase">
                  <th className="text-left pb-2">Item</th>
                  <th className="text-center pb-2">Qty</th>
                  <th className="text-right pb-2">Price</th>
                  <th className="text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.categories.map((category, catIdx) => (
                  <Fragment key={category._id || catIdx}>
                    <tr>
                      <td colSpan="4" className="pt-3 pb-1 text-[11px] font-semibold text-gray-500 bg-white">
                        {category.name}
                      </td>
                    </tr>
                    {category.items.map((item, itemIdx) => {
                      const itemTotal = calculateItemTotal(item);
                      return (
                        <tr key={item._id || itemIdx} className="border-t border-gray-50">
                          <td className="py-2">
                            <div className="text-gray-900">{item.name}</div>
                            {item.operationGroups?.map((group, gIdx) => (
                              group.modifiers?.map((mod, mIdx) => (
                                <div key={mod._id || `${gIdx}-${mIdx}`} className="text-[10px] text-gray-400">
                                  + {mod.name} {mod.price > 0 && `(₹${mod.price})`}
                                </div>
                              ))
                            ))}
                          </td>
                          <td className="text-center text-gray-600">{item.quantity}</td>
                          <td className="text-right text-gray-600">₹{item.price}</td>
                          <td className="text-right font-medium">₹{itemTotal}</td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fixed Bottom Section with Totals, Payment, and Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100">
          <div className="px-6 pt-4 pb-3">
            {/* Grand Total - Always Visible */}
            <div className="flex justify-between text-[18px] font-bold mb-4">
              <span className="text-gray-900">Grand Total</span>
              <span className="text-gray-900">₹{order.billSummary.grandTotal}</span>
            </div>

            {/* Payment Section - Always Visible */}
            {!isReadOnly && order.paymentStatus === 'PENDING' && (
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Payment Method
                </p>
                <div className="flex gap-2 mb-4">
                  {['CASH', 'CARD', 'UPI'].map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-[12px] font-medium transition-all ${
                        paymentMethod === method
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    onMarkPaid(order._id, paymentMethod);
                    onClose();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-[13px] font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {Icons.check}
                  Mark as Paid
                </button>
              </div>
            )}

            {/* Paid Status - Always Visible */}
            {(isReadOnly || order.paymentStatus === 'PAID') && (
              <div className="bg-green-50 rounded-xl p-4 text-center mb-3">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  {Icons.check}
                </div>
                <p className="text-[14px] font-medium text-green-700">Paid Successfully</p>
                <p className="text-[11px] text-green-600 mt-1">
                  via {order.paymentMethod || paymentMethod} • {order.updatedAt ? formatDate(order.updatedAt) : 'N/A'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons - Always Visible */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
            >
              {Icons.printer}
              Print Bill
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};