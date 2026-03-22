// PremiumSeatBox.jsx — Individual seat tile with hover tooltip
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "./icons";

/* ── order-status colour config ─────────────────────────────────────────── */
const ORDER_STATUS_CONFIG = {
  PLACED: {
    label: "Order Placed",
    tileBg:     "bg-blue-50",
    tileBorder: "border-blue-200",
    tileHoverBg:     "hover:bg-blue-100",
    tileHoverBorder: "hover:border-blue-400",
    tileText:   "text-blue-700",
    dot:        "bg-blue-500",
    badgeBg:    "bg-blue-500",
    tooltipDot: "bg-blue-400",
  },
  PREPARING: {
    label: "Preparing",
    tileBg:     "bg-amber-50",
    tileBorder: "border-amber-200",
    tileHoverBg:     "hover:bg-amber-100",
    tileHoverBorder: "hover:border-amber-400",
    tileText:   "text-amber-700",
    dot:        "bg-amber-500 animate-pulse",
    badgeBg:    "bg-amber-500",
    tooltipDot: "bg-amber-400 animate-pulse",
  },
  SERVED: {
    label: "Served",
    tileBg:     "bg-purple-50",
    tileBorder: "border-purple-200",
    tileHoverBg:     "hover:bg-purple-100",
    tileHoverBorder: "hover:border-purple-400",
    tileText:   "text-purple-700",
    dot:        "bg-purple-500",
    badgeBg:    "bg-purple-500",
    tooltipDot: "bg-purple-400",
  },
};

/* ── derive tile colours from effectiveStatus + orderStatus ─────────────── */
const getTileStyle = (seat) => {
  // Available (no active order)
  if (seat.effectiveStatus === "AVAILABLE") {
    return {
      tileCls: "bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-400",
      textCls: "text-green-700",
      iconCls: "text-green-600",
      dotCls:  "bg-green-500 animate-pulse",
      tooltipDotCls: "bg-green-400",
      orderCfg: null,
    };
  }

  // Occupied — use order-status specific colours when available
  const orderCfg = ORDER_STATUS_CONFIG[seat.orderStatus] || null;

  if (orderCfg) {
    return {
      tileCls: `${orderCfg.tileBg} ${orderCfg.tileBorder} ${orderCfg.tileHoverBg} ${orderCfg.tileHoverBorder}`,
      textCls: orderCfg.tileText,
      iconCls: orderCfg.tileText,
      dotCls:  orderCfg.dot,
      tooltipDotCls: orderCfg.tooltipDot,
      orderCfg,
    };
  }

  // Occupied but no active orderStatus (e.g. staff manually marked occupied)
  return {
    tileCls: "bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-400",
    textCls: "text-orange-700",
    iconCls: "text-orange-600",
    dotCls:  "bg-red-500",
    tooltipDotCls: "bg-red-400",
    orderCfg: null,
  };
};

/* ── component ──────────────────────────────────────────────────────────── */
export const PremiumSeatBox = ({ seat, onToggle, isUpdating }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const seatRef = useRef(null);

  const isAvailable = seat.effectiveStatus === "AVAILABLE"; // ✅ use effectiveStatus
  const { tileCls, textCls, iconCls, dotCls, tooltipDotCls, orderCfg } = getTileStyle(seat);

  const handleClick = () => {
    if (!isUpdating) onToggle(seat);
  };

  return (
    <div className="relative" ref={seatRef}>
      <motion.button
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.96 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={handleClick}
        disabled={isUpdating}
        className={`
          relative w-20 h-20 rounded-2xl border-2 transition-all duration-300
          flex flex-col items-center justify-center
          ${tileCls}
          ${isPressed ? "scale-95" : ""}
          ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {/* Glass sheen */}
        <div className="absolute inset-0 rounded-2xl bg-white/40 pointer-events-none" />

        {/* Table number */}
        <span className={`relative text-[18px] font-bold z-10 ${textCls}`}>
          {seat.tableNumber}
        </span>

        {/* Icon */}
        <div className={`relative mt-0.5 z-10 ${iconCls}`}>
          {isAvailable ? Icons.sofa : Icons.person}
        </div>

        {/* Live status dot */}
        <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${dotCls}`} />

        {/* ✅ Order status badge — pinned to bottom of tile */}
        {orderCfg && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20">
            <span
              className={`
                inline-block px-2 py-0.5 rounded-full text-white text-[8px] font-bold
                whitespace-nowrap shadow-sm ${orderCfg.badgeBg}
              `}
            >
              {orderCfg.label}
            </span>
          </div>
        )}
      </motion.button>

      {/* ✅ Hover Tooltip — now shows order status row */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-900 text-white rounded-xl py-3 px-4 whitespace-nowrap z-50 pointer-events-none"
          >
            <div className="flex items-start gap-3">
              <div className="text-left space-y-1.5">

                {/* Table number */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Table</span>
                  <span className="text-white font-bold text-[14px]">{seat.tableNumber}</span>
                </div>

                {/* QR number */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">QR</span>
                  <span className="text-white font-mono text-[12px]">{seat.qrNumber}</span>
                </div>

                {/* ✅ Seat status */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Status</span>
                  <span className={`text-[11px] font-semibold ${isAvailable ? "text-green-400" : "text-orange-400"}`}>
                    {isAvailable ? "Available" : "Occupied"}
                  </span>
                </div>

                {/* ✅ Order status — only shown when an active order exists */}
                {seat.orderStatus && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider">Order</span>
                    {orderCfg ? (
                      <span className={`
                        inline-flex items-center gap-1 text-[11px] font-semibold
                        ${orderCfg.tileText.replace("text-", "text-").replace("-700", "-400")}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${orderCfg.tooltipDotCls}`} />
                        {orderCfg.label}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-[11px]">{seat.orderStatus}</span>
                    )}
                  </div>
                )}

              </div>

              {/* Animated status dot */}
              <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${tooltipDotCls}`} />
            </div>

            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-3 h-3 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};