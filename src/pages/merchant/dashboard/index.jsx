import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- ICONS ---------------- */

const Icons = {
  bolt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  menuIcon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="17" width="18" height="4" rx="1"/></svg>,
  receipt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg>,
  qr: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>,
  seat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="3"/>
    <rect x="3" y="10" width="3" height="4" rx="1"/>
    <rect x="18" y="10" width="3" height="4" rx="1"/>
    <rect x="10" y="3" width="4" height="3" rx="1"/>
    <rect x="10" y="18" width="4" height="3" rx="1"/>
  </svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  
  // User Icons
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>,
  
  userFilled: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>,
  
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
};

/* ---------------- DATA ---------------- */

const STATS = [
  {label: "Active Orders", value: "12", icon: Icons.bolt, accent: "blue"},
  {label: "Pending Orders", value: "5", icon: Icons.clock, accent: "orange"},
  {label: "Total Sales", value: "₹24,890", icon: Icons.dollar, accent: "green"},
  {label: "Total Orders", value: "148", icon: Icons.layers, accent: "purple"}
];

const ACCENT_MAP = {
  blue: {light: "bg-blue-50", iconBg: "bg-blue-500"},
  orange: {light: "bg-orange-50", iconBg: "bg-orange-500"},
  green: {light: "bg-green-50", iconBg: "bg-emerald-500"},
  purple: {light: "bg-violet-50", iconBg: "bg-violet-500"}
};

const getGreeting = (h) => h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";

/* ---------------- STAT CARD ---------------- */

const StatCard = ({label, value, icon, accent, delay}) => {
  const [visible, setVisible] = useState(false);
  const {light, iconBg} = ACCENT_MAP[accent];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity .45s ease ${delay}ms, transform .45s ease ${delay}ms`
      }}
    >
      <div className={`absolute inset-0 ${light} opacity-30 rounded-2xl`}/>
      <div className="relative flex flex-col gap-5">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-[30px] font-bold text-gray-900">{value}</p>
          <p className="text-[13px] text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
};

/* ---------------- QUICK ROW ---------------- */

const QuickAccessRow = ({label, icon, description, route, onNavigate, delay, isLast}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={() => onNavigate(route)}
      className={`w-full flex items-center gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 ${!isLast ? "border-b border-gray-100" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms`
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 text-gray-500">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-[14px] font-semibold text-gray-800">{label}</p>
        <p className="text-[12px] text-gray-400">{description}</p>
      </div>

      <span className="text-gray-300">{Icons.chevron}</span>
    </button>
  );
};

/* ---------------- DASHBOARD ---------------- */

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const { rest_id } = useParams();

  const NAV_ITEMS = [
    {label: "Live Orders", icon: Icons.activity, description: "Track orders in real-time", route: `/merchant/${rest_id}/live-orders`},
    {label: "Seats & Reservations", icon: Icons.seat, description: "Manage table seating", route: `/merchant/${rest_id}/seating-chart`},
    {label: "Menu Management", icon: Icons.menuIcon, description: "Edit items & prices", route: `/merchant/${rest_id}/menu-management`},
    {label: "Bills & Payment", icon: Icons.receipt, description: "Invoices & transactions", route: `/merchant/${rest_id}/bills-payment`},
    {label: "QR Codes", icon: Icons.qr, description: "Table QR links", route: `/merchant/${rest_id}/qr-codes`}
  ];

  const [time, setTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleUserIconClick = () => {
    // Navigate to update restaurant page
    navigate(`/merchant/${rest_id}/update-restaurant`);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7]">

      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-10">
        <div className="max-w-5xl mx-auto px-8 h-[60px] flex items-center justify-between">
          
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-gray-900 flex items-center justify-center text-white">🍜</div>
            <p className="font-bold text-gray-900">Merchant Portal</p>
          </div>

          {/* Right side - Time and User Icon */}
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-400 tabular-nums">
              {time.toLocaleTimeString()}
            </span>
            
            {/* User Icon - Direct Navigation */}
            <button
              onClick={handleUserIconClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-300 relative group
                ${isHovered 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title="Update Restaurant"
            >
              {isHovered ? Icons.userFilled : Icons.user}

              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                bg-gray-900 text-white text-xs py-1 px-2 rounded-lg
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                whitespace-nowrap pointer-events-none">
                Update Restaurant
              </span>
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">

        {/* Greeting Section */}
        <div className="mb-9">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {time.toLocaleDateString()}
          </p>
          <h2 className="text-[34px] font-bold text-gray-900">
            Good {getGreeting(time.getHours())} 👋
          </h2>
          <p className="text-gray-400 text-[14px] mt-1">
            Here's what's happening at your restaurant today.
          </p>
        </div>

        {/* Stats Section */}
        <section className="mb-10">
          <div className="grid grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 70} />
            ))}
          </div>
        </section>

        {/* Quick Access Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Quick Access
            </h3>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {NAV_ITEMS.map((n, i) => (
              <QuickAccessRow
                key={n.route}
                {...n}
                onNavigate={navigate}
                delay={280 + i * 60}
                isLast={i === NAV_ITEMS.length - 1}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}