// SeatGrid.jsx — Renders the grid of PremiumSeatBox tiles + empty-state + key

import { motion } from "framer-motion";
import { PremiumSeatBox } from "./Premiumseatbox";
import { Icons } from "./icons";

const SEATS_PER_ROW = 11;

export const SeatGrid = ({ seats, onSeatClick, updatingSeatId }) => {
  // Build rows
  const sorted = [...seats].sort((a, b) => a.tableNumber - b.tableNumber);
  const rows = [];
  for (let i = 0; i < sorted.length; i += SEATS_PER_ROW) {
    rows.push(sorted.slice(i, i + SEATS_PER_ROW));
  }

  if (rows.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 bg-white rounded-3xl border border-gray-200"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400">
          {Icons.sofa}
        </div>
        <p className="text-gray-500 text-[16px]">No seats match your filters</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-3xl border border-gray-200 p-8"
    >
      <div className="flex gap-2">
        <div className="flex-1 overflow-x-auto pr-29">
          <div className="space-y-3 pt-14">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-6 pt-20">
                {row.map((seat) => (
                  <PremiumSeatBox
                    key={seat._id}
                    seat={seat}
                    onToggle={onSeatClick}
                    isUpdating={updatingSeatId === seat._id}
                  />
                ))}
                {/* Filler tiles to keep row width constant */}
                {Array.from({ length: SEATS_PER_ROW - row.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-20 h-20 opacity-0" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom key */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center gap-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-600">
            {Icons.sofa}
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-900">Available</p>
            {/* <p className="text-[10px] text-gray-500">Sofa icon</p> */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-orange-600">
            {Icons.person}
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-900">Occupied</p>
            {/* <p className="text-[10px] text-gray-500">Person icon</p> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};