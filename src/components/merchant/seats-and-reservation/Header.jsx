// Header.jsx — Sticky top bar with logo, clock, avatar

import { Icons } from "./icons";

export const Header = ({ time, navigate, rest_id }) => (
  <header className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-white/20 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">
      <div className="flex items-center gap-5">
                  <button
            onClick={() => navigate(`/merchant/${rest_id}`)}
            className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 hover:bg-gray-100 hover:shadow-md flex items-center justify-center text-black transition-all duration-200"
            title="Go to Dashboard"
          >
            {Icons.back}
          </button>
        <div className="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center text-white">
          {Icons.sofa}
        </div>
        <div>
          <p className="font-bold text-gray-900">Seats and Reservation</p>
          <p className="text-[10px] text-gray-500">Click any seat to manage</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[13px] text-gray-500 tabular-nums bg-white/50 px-3 py-1 rounded-full flex items-center gap-1">
          {Icons.clock}
          {time.toLocaleTimeString()}
        </span>
      </div>
    </div>
  </header>
);