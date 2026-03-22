// src/components/bills-payment/StatCard.jsx
export const StatCard = ({ label, value, icon, accent, trend }) => {
  const accentColors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600"
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${accentColors[accent]} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[11px] font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-[28px] font-bold text-gray-900">{value}</p>
      <p className="text-[12px] text-gray-400">{label}</p>
    </div>
  );
};