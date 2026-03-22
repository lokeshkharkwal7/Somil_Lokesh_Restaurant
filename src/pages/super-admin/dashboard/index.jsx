// src/components/super-admin/SuperAdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      path: '/a-secret-code/super-admin/onboarding-restaurant',
      title: 'Onboarding Restaurant',
      description: 'Review and approve new restaurant registrations',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: 'from-[#007aff] to-[#5856d6]',
      count: 12,
    },
    {
      path: '/a-secret-code/super-admin/restaurants',
      title: 'Restaurant Status',
      description: 'Monitor active restaurants and their performance',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
        </svg>
      ),
      color: 'from-[#34c759] to-[#30b0c0]',
      count: 24,
    },
    {
      path: '/a-secret-code/super-admin/profit',
      title: 'Company Profit',
      description: 'View revenue and analytics',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-2 0-3 1-3 2s1 2 3 2 3 1 3 2-1 2-3 2" />
        </svg>
      ),
      color: 'from-[#ff9f0a] to-[#ff3b30]',
      value: '$345K',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/merchant/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] relative overflow-hidden">
      
      {/* SAME BACKGROUND AS LOGIN */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7] via-[#ffffff] to-[#f0f0f3]"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#007aff] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#5856d6] opacity-5 rounded-full blur-3xl"></div>

        {/* Added center glow like login */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#007aff] via-[#5856d6] to-[#ff2d55] opacity-[0.02] rounded-full blur-3xl"></div>
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,122,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,122,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* MAIN CARD CONTAINER (same style as login card) */}
      <div
        className="relative w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50"
        style={{
          boxShadow:
            '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02) inset, 0 0 0 1px rgba(255,255,255,0.8) inset',
        }}
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
                      <div>
            <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              Hi Admin 👋
            </h1>
            <p className="text-[#86868b] mt-1">
              Welcome back, manage everything from here
            </p>
          </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[#ff3b30] hover:bg-[#ff3b30]/10 transition"
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <div className="relative rounded-3xl p-6 bg-white border border-[#e5e5e7] hover:shadow-xl transition">

                {/* Gradient glow */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition`} />

                {/* Icon */}
                <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  {item.icon}
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[#86868b] mb-4">
                  {item.description}
                </p>

                {/* Footer */}
                {item.count !== undefined && (
                  <p className="text-sm text-[#86868b]">
                    <span className="text-[#1d1d1f] font-semibold">
                      {item.count}
                    </span>{' '}
                    pending
                  </p>
                )}

                {item.value && (
                  <p className="text-sm text-[#86868b]">
                    <span className="text-[#1d1d1f] font-semibold">
                      {item.value}
                    </span>{' '}
                    this month
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}