// StatsCards.jsx — Three summary cards (total / available / occupied)

import { motion } from "framer-motion";
import { Icons } from "./icons";

export const StatsCards = ({ stats }) => {
  const cards = [
    { label: "Total Seats",  value: stats.total,     icon: Icons.total        },
    { label: "Available",    value: stats.available,  icon: Icons.availableStat },
    { label: "Occupied",     value: stats.occupied,   icon: Icons.occupiedStat  },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-6 mb-8"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          whileHover={{ y: -2 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {card.label}
              </p>
              <p className="text-[36px] font-bold text-gray-900">{card.value}</p>
            </div>
            <div className="text-gray-400">{card.icon}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};