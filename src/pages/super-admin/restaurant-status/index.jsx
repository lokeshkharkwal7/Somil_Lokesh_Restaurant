// src/components/super-admin/RestaurantStatus.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RestaurantStatus() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/a-secret-code/super-admin');
  };

  // Mock data
  const restaurants = [
    { id: 1, name: 'Burger Palace', status: 'active', revenue: '$45,234', orders: 1234, rating: 4.5, cuisine: 'American', location: 'New York' },
    { id: 2, name: 'Pizza Heaven', status: 'active', revenue: '$32,890', orders: 987, rating: 4.3, cuisine: 'Italian', location: 'Chicago' },
    { id: 3, name: 'Sushi Master', status: 'inactive', revenue: '$0', orders: 0, rating: 0, cuisine: 'Japanese', location: 'Los Angeles' },
    { id: 4, name: 'Taco Fiesta', status: 'active', revenue: '$28,456', orders: 756, rating: 4.7, cuisine: 'Mexican', location: 'Miami' },
    { id: 5, name: 'Curry House', status: 'active', revenue: '$19,234', orders: 543, rating: 4.4, cuisine: 'Indian', location: 'San Francisco' },
    { id: 6, name: 'Dragon Wok', status: 'inactive', revenue: '$0', orders: 0, rating: 0, cuisine: 'Chinese', location: 'Seattle' },
  ];

  const activeRestaurants = restaurants.filter(r => r.status === 'active');
  const totalRevenue = activeRestaurants.reduce((sum, r) => sum + parseInt(r.revenue.replace(/[$,]/g, '')), 0);
  const totalOrders = activeRestaurants.reduce((sum, r) => sum + r.orders, 0);
  const avgRating = (activeRestaurants.reduce((sum, r) => sum + r.rating, 0) / activeRestaurants.length).toFixed(1);

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-[#34c759]/10 text-[#34c759]' 
      : 'bg-[#ff3b30]/10 text-[#ff3b30]';
  };

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

          <h1 className="text-2xl font-semibold text-[#1d1d1f]">Restaurant Status</h1>
        </div>

        {/* Main content card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50"
          style={{
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02) inset, 0 0 0 1px rgba(255,255,255,0.8) inset'
          }}
        >
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#f5f5f7] rounded-2xl p-5">
              <p className="text-sm text-[#86868b]">Total Restaurants</p>
              <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">{restaurants.length}</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-5">
              <p className="text-sm text-[#86868b]">Active</p>
              <p className="text-2xl font-semibold text-[#34c759] mt-1">{activeRestaurants.length}</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-5">
              <p className="text-sm text-[#86868b]">Total Revenue</p>
              <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-5">
              <p className="text-sm text-[#86868b]">Avg Rating</p>
              <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">{avgRating} ★</p>
            </div>
          </div>

          {/* Restaurant list header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#1d1d1f]">All Restaurants</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-[#007aff] text-white rounded-xl text-xs font-medium">All</button>
              <button className="px-3 py-1 bg-[#f5f5f7] text-[#86868b] rounded-xl text-xs font-medium">Active</button>
              <button className="px-3 py-1 bg-[#f5f5f7] text-[#86868b] rounded-xl text-xs font-medium">Inactive</button>
            </div>
          </div>

          {/* Restaurant list */}
          <div className="space-y-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-[#f5f5f7] rounded-2xl p-4 hover:bg-[#e5e5e7] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{restaurant.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-[#1d1d1f] font-medium">{restaurant.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(restaurant.status)}`}>
                          {restaurant.status}
                        </span>
                        <span className="text-xs text-[#86868b]">{restaurant.cuisine}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-[#86868b]">{restaurant.location}</p>
                        <p className="text-sm text-[#86868b]">•</p>
                        <p className="text-sm text-[#86868b]">{restaurant.orders} orders</p>
                        <p className="text-sm text-[#86868b]">•</p>
                        <p className="text-sm text-[#86868b]">{restaurant.rating} ★</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-[#1d1d1f]">{restaurant.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}