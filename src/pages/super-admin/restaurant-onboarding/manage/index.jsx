// src/components/super-admin/OnboardingDetailsModal.jsx
import React from 'react';

export default function OnboardingDetailsModal({ 
  isOpen, 
  onClose, 
  onboarding, 
  onOnboard,
  // isOnboarding 
}) {
  if (!isOpen || !onboarding) return null;

  const handleOnboard = () => {
    const restaurantData = {
      name: onboarding.name,
      ownerName: onboarding.ownerName,
      contactNumber: onboarding.contactNumber,
      email: onboarding.email,
      address: onboarding.address
    };
    onOnboard(restaurantData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
          style={{
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.02) inset, 0 0 0 1px rgba(255,255,255,0.8) inset'
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#e5e5e7] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-medium">
                  {onboarding.name?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1d1d1f]">{onboarding.name}</h3>
                <p className="text-xs text-[#86868b]">Requested on {formatDate(onboarding.createdAt)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Restaurant Details */}
            <div>
              <h4 className="text-sm font-medium text-[#1d1d1f] mb-3">Restaurant Information</h4>
              <div className="bg-[#f5f5f7] rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#86868b]">Owner Name</p>
                    <p className="text-sm text-[#1d1d1f] font-medium">{onboarding.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#86868b]">Contact Number</p>
                    <p className="text-sm text-[#1d1d1f] font-medium">{onboarding.contactNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-[#86868b]">Email</p>
                    <p className="text-sm text-[#1d1d1f] font-medium">{onboarding.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div>
              <h4 className="text-sm font-medium text-[#1d1d1f] mb-3">Address</h4>
              <div className="bg-[#f5f5f7] rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs text-[#86868b]">Street</p>
                    <p className="text-sm text-[#1d1d1f]">{onboarding.address?.street || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#86868b]">City</p>
                    <p className="text-sm text-[#1d1d1f]">{onboarding.address?.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#86868b]">State</p>
                    <p className="text-sm text-[#1d1d1f]">{onboarding.address?.state || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#86868b]">Country</p>
                    <p className="text-sm text-[#1d1d1f]">{onboarding.address?.country || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#86868b]">Pincode</p>
                    <p className="text-sm text-[#1d1d1f]">{onboarding.address?.pincode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            {onboarding.transactionId && (
              <div>
                <h4 className="text-sm font-medium text-[#1d1d1f] mb-3">Transaction Information</h4>
                <div className="bg-[#f5f5f7] rounded-2xl p-4">
                  <div>
                    <p className="text-xs text-[#86868b]">Transaction ID</p>
                    <p className="text-sm text-[#1d1d1f] font-mono">{onboarding.transactionId}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with actions */}
          <div className="px-6 py-4 bg-[#f5f5f7] border-t border-[#e5e5e7] flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            >
              Cancel
            </button>
            {onboarding.status?.toLowerCase() === 'pending' && (
              <button
                onClick={handleOnboard}
                // disabled={isOnboarding}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-[#007aff] hover:bg-[#0051a8] disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                style={{ boxShadow: '0 2px 8px rgba(0,122,255,0.3)' }}
              >
                {
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Onboard Restaurant</span>
                  </>
                }
              </button>
            )}
            {onboarding.status?.toLowerCase() === 'approved' && (
              <div className="px-4 py-2 bg-[#34c759]/10 text-[#34c759] rounded-xl text-sm font-medium">
                Already Onboarded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}