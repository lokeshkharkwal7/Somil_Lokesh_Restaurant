// src/components/common/MenuLoader.jsx
export const MenuLoader = () => (
  <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-200 animate-pulse"></div>
      <p className="text-gray-400">Loading orders...</p>
    </div>
  </div>
);