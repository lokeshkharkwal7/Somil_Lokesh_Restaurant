// src/components/super-admin/CompanyProfit.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyProfit() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/a-secret-code/super-admin');
  };

  // Mock data
  const stats = {
    totalRevenue: '$1,234,567',
    totalProfit: '$345,678',
    profitMargin: '28%',
    monthlyGrowth: '+12.3%',
    activeSubscriptions: 18,
    averageOrderValue: '$42.50'
  };

  const monthlyData = [
    { month: 'Jan', revenue: 85000, profit: 23800 },
    { month: 'Feb', revenue: 92000, profit: 25760 },
    { month: 'Mar', revenue: 88000, profit: 24640 },
    { month: 'Apr', revenue: 95000, profit: 26600 },
    { month: 'May', revenue: 102000, profit: 28560 },
    { month: 'Jun', revenue: 108000, profit: 30240 },
    { month: 'Jul', revenue: 115000, profit: 32200 },
    { month: 'Aug', revenue: 112000, profit: 31360 },
    { month: 'Sep', revenue: 118000, profit: 33040 },
    { month: 'Oct', revenue: 125000, profit: 35000 },
    { month: 'Nov', revenue: 132000, profit: 36960 },
    { month: 'Dec', revenue: 145000, profit: 40600 },
  ];

  const recentTransactions = [
    { id: 1, restaurant: 'Burger Palace', amount: '$12,345', date: '2024-01-15', status: 'completed', type: 'subscription' },
    { id: 2, restaurant: 'Pizza Heaven', amount: '$8,765', date: '2024-01-14', status: 'completed', type: 'subscription' },
    { id: 3, restaurant: 'Sushi Master', amount: '$5,432', date: '2024-01-13', status: 'pending', type: 'onboarding' },
    { id: 4, restaurant: 'Taco Fiesta', amount: '$6,789', date: '2024-01-12', status: 'completed', type: 'subscription' },
    { id: 5, restaurant: 'Curry House', amount: '$4,321', date: '2024-01-11', status: 'completed', type: 'subscription' },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

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

          <h1 className="text-2xl font-semibold text-[#1d1d1f]">Company Profit</h1>
        </div>

        {/* Main content card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50"
          style={{
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02) inset, 0 0 0 1px rgba(255,255,255,0.8) inset'
          }}
        >
          {/* iOS-style profit cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-2xl p-5 text-white">
              <p className="text-sm opacity-90 mb-1">Total Revenue</p>
              <p className="text-2xl font-semibold">{stats.totalRevenue}</p>
              <p className="text-xs opacity-75 mt-2">Year to date</p>
            </div>

            <div className="bg-gradient-to-br from-[#34c759] to-[#30b0c0] rounded-2xl p-5 text-white">
              <p className="text-sm opacity-90 mb-1">Total Profit</p>
              <p className="text-2xl font-semibold">{stats.totalProfit}</p>
              <p className="text-xs opacity-75 mt-2">Net earnings</p>
            </div>

            <div className="bg-gradient-to-br from-[#ff9f0a] to-[#ff3b30] rounded-2xl p-5 text-white">
              <p className="text-sm opacity-90 mb-1">Profit Margin</p>
              <p className="text-2xl font-semibold">{stats.profitMargin}</p>
              <p className="text-xs opacity-75 mt-2">Industry avg: 22%</p>
            </div>

            <div className="bg-gradient-to-br from-[#5856d6] to-[#007aff] rounded-2xl p-5 text-white">
              <p className="text-sm opacity-90 mb-1">Monthly Growth</p>
              <p className="text-2xl font-semibold">{stats.monthlyGrowth}</p>
              <p className="text-xs opacity-75 mt-2">vs last month</p>
            </div>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#f5f5f7] rounded-2xl p-4">
              <p className="text-xs text-[#86868b]">Active Subscriptions</p>
              <p className="text-xl font-semibold text-[#1d1d1f]">{stats.activeSubscriptions}</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-4">
              <p className="text-xs text-[#86868b]">Average Order Value</p>
              <p className="text-xl font-semibold text-[#1d1d1f]">{stats.averageOrderValue}</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-4">
              <p className="text-xs text-[#86868b]">Projected Annual Revenue</p>
              <p className="text-xl font-semibold text-[#1d1d1f]">$1.5M</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#f5f5f7] rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#1d1d1f] font-medium">Revenue & Profit Trend</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-white rounded-xl text-xs font-medium text-[#007aff]">2024</button>
                <button className="px-3 py-1 rounded-xl text-xs font-medium text-[#86868b]">2023</button>
              </div>
            </div>
            
            <div className="h-64 flex items-end space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full space-y-1">
                    <div 
                      className="w-full bg-gradient-to-t from-[#007aff] to-[#5856d6] rounded-t-lg"
                      style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        ${(data.revenue/1000).toFixed(0)}k
                      </div>
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-[#34c759] to-[#30b0c0] rounded-t-lg"
                      style={{ height: `${(data.profit / maxRevenue) * 50}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#86868b] mt-2">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#007aff] rounded"></div>
                <span className="text-xs text-[#86868b]">Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#34c759] rounded"></div>
                <span className="text-xs text-[#86868b]">Profit</span>
              </div>
            </div>
          </div>

          {/* Recent transactions */}
          <div>
            <h3 className="text-[#1d1d1f] font-medium mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-[#f5f5f7] rounded-2xl p-4 flex items-center justify-between hover:bg-[#e5e5e7] transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{transaction.restaurant.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-[#1d1d1f] font-medium">{transaction.restaurant}</h4>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-[#86868b]">{transaction.date}</p>
                        <span className="text-xs text-[#86868b]">•</span>
                        <p className="text-xs text-[#86868b]">{transaction.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1d1d1f] font-medium">{transaction.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-[#34c759]/10 text-[#34c759]' 
                        : 'bg-[#ff9f0a]/10 text-[#ff9f0a]'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}