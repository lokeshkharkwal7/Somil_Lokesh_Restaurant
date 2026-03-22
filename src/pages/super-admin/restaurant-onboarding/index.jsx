// src/components/super-admin/OnboardingRestaurant.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingList, useCreateRestaurant } from '../../../hooks/restaurant-onboarding';

import OnboardingDetailsModal from './manage';

export default function OnboardingRestaurant() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useOnboardingList({ 
    page, 
    limit: 10, 
    search: searchTerm 
  });

  const createRestaurantMutation = useCreateRestaurant();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRowClick = (onboarding) => {
    setSelectedOnboarding(onboarding);
    setIsModalOpen(true);
  };

  const handleOnboard = async (data) => {
    await createRestaurantMutation.mutateAsync({
      ...data,
      _id: selectedOnboarding._id
    });
    setIsModalOpen(false);
    setSelectedOnboarding(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOnboarding(null);
  };

  const handleBack = () => {
    navigate('/a-secret-code/super-admin');
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-[#ff9f0a]/10 text-[#ff9f0a]';
      case 'approved': return 'bg-[#34c759]/10 text-[#34c759]';
      case 'rejected': return 'bg-[#ff3b30]/10 text-[#ff3b30]';
      default: return 'bg-[#86868b]/10 text-[#86868b]';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] p-8">
        <div className="bg-[#ffe5e5] text-[#ff3b30] px-4 py-3 rounded-xl text-sm">
          Error loading onboarding requests: {error?.message}
        </div>
      </div>
    );
  }

  const onboardingList = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, totalRecords: 0 };

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7] via-[#ffffff] to-[#f0f0f3]"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#007aff] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#5856d6] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px'
      }}></div>

      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(0, 122, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 255, 0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-[#007aff] hover:text-[#0051a8] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          <h1 className="text-2xl font-semibold text-[#1d1d1f]">Onboarding Restaurant</h1>
        </div>

        {/* Rest of your onboarding component content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50"
          style={{
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02) inset, 0 0 0 1px rgba(255,255,255,0.8) inset'
          }}
        >
          {/* Header with search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">Onboarding Requests</h2>
            
            {/* iOS-style search bar */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-4 py-2 bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder-[#86868b] focus:ring-2 focus:ring-[#007aff] text-sm"
                style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(255,255,255,0.8)' }}
              />
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#f5f5f7] rounded-2xl p-4">
              <p className="text-xs text-[#86868b]">Total Requests</p>
              <p className="text-xl font-semibold text-[#1d1d1f]">{meta.totalRecords}</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-4">
              <p className="text-xs text-[#86868b]">Pending</p>
              <p className="text-xl font-semibold text-[#ff9f0a]">
                {onboardingList.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-4">
              <p className="text-xs text-[#86868b]">Approved</p>
              <p className="text-xl font-semibold text-[#34c759]">
                {onboardingList.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-[#f5f5f7] rounded-2xl p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {onboardingList.length === 0 ? (
                  <div className="bg-[#f5f5f7] rounded-2xl p-8 text-center">
                    <p className="text-[#86868b]">No onboarding requests found</p>
                  </div>
                ) : (
                  onboardingList.map((request) => (
                    <div
                      key={request._id}
                      onClick={() => handleRowClick(request)}
                      className="bg-[#f5f5f7] rounded-2xl p-4 hover:bg-[#e5e5e7] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {request.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-[#1d1d1f] font-medium">{request.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-sm text-[#86868b]">{request.ownerName}</p>
                              <p className="text-sm text-[#86868b]">•</p>
                              <p className="text-sm text-[#86868b]">{request.email}</p>
                              <p className="text-sm text-[#86868b]">•</p>
                              <p className="text-sm text-[#86868b]">{formatDate(request.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[#007aff] disabled:text-[#86868b] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[#86868b]">
                    Page {page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[#007aff] disabled:text-[#86868b] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Details Modal */}
        <OnboardingDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onboarding={selectedOnboarding}
          onOnboard={handleOnboard}
          isOnboarding={createRestaurantMutation.isPending}
        />
      </div>
    </div>
  );
}