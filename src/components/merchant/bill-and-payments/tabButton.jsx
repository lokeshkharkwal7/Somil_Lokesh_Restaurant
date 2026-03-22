// src/components/bills-payment/TabButton.jsx

export const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 text-[13px] font-medium transition-colors ${
      active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    {children}
    {count !== undefined && (
      <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full ${
        active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {count}
      </span>
    )}
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
    )}
  </button>
);