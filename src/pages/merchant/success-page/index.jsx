import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "Your response has been noted. Our team will contact you soon.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0  bg-gradient-to-br from-[#f5f5f7] via-[#ffffff] to-[#f0f0f3]"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#34c759] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#007aff] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px'
      }}></div>

      {/* Success Card */}
      <div
        className="relative max-w-4xl w-full space-y-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 text-center"
        style={{
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02) inset, 0 0 0 1px rgba(255,255,255,0.8) inset'
        }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#34c759] to-[#007aff] rounded-3xl flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Thank You!</h2>
        
        <p className="text-lg text-[#1d1d1f] mt-4">
          {message}
        </p>
        
        <p className="text-sm text-[#86868b] mt-2">
          We'll review your application and get back to you within 24-48 hours.
        </p>

        <div className="pt-6">
          <button
            onClick={() => navigate('/merchant/login')}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-[#007aff] hover:bg-[#0051a8] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2"
            style={{ boxShadow: '0 2px 8px rgba(0,122,255,0.3)' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}