// ConfirmationModal.jsx
// No entry/exit animation on the modal itself.
// Adds: timestamp, status badge, action type pill, quick-note textarea, divider sections.

import { useState } from "react";
import { Icons } from "./icons";

/* ── tiny helper ── */
const StatusBadge = ({ status }) => {
  const isAvailable = status === "AVAILABLE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
        isAvailable
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-orange-50 text-orange-700 border-orange-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isAvailable ? "bg-green-500 animate-pulse" : "bg-orange-500"
        }`}
      />
      {isAvailable ? "Available" : "Occupied"}
    </span>
  );
};

/* ── arrow showing transition ── */
const TransitionArrow = ({ from, to }) => (
  <div className="flex items-center justify-center gap-3 py-3">
    <StatusBadge status={from} />
    <div className="flex flex-col items-center">
      <div className="w-8 h-[2px] bg-gray-300" />
      <svg
        className="w-4 h-4 text-gray-400 -mt-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
    <StatusBadge status={to} />
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN MODAL – no animation wrapper
   ═══════════════════════════════════════════════ */
export const ConfirmationModal = ({ isOpen, onClose, onConfirm, seat, newStatus }) => {
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const isMakingAvailable = newStatus === "AVAILABLE";
  const currentStatus = isMakingAvailable ? "OCCUPIED" : "AVAILABLE";

  const config = {
    title: isMakingAvailable ? "Mark seat as available?" : "Mark seat as occupied?",
    subtitle: isMakingAvailable
      ? "This table will be opened up for new customers."
      : "This table will be reserved and marked in-use.",
    confirmText: isMakingAvailable ? "Yes, Make Available" : "Yes, Mark Occupied",
    confirmCls: isMakingAvailable
      ? "bg-green-600 hover:bg-green-700 focus:ring-green-300"
      : "bg-orange-600 hover:bg-orange-700 focus:ring-orange-300",
    icon: isMakingAvailable ? Icons.sofa : Icons.person,
    iconBg: isMakingAvailable
      ? "bg-green-50 text-green-600 border-green-200"
      : "bg-orange-50 text-orange-600 border-orange-200",
    accentBar: isMakingAvailable ? "bg-green-500" : "bg-orange-500",
    noteHint: isMakingAvailable
      ? "e.g. Cleaned and reset for next guest"
      : "e.g. Party of 4, reserved until 9 PM",
  };

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateString = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm(note.trim() || null);
    onClose();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal card — NO motion wrapper, plain div */}
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">

        {/* ── Section 1: Header ── */}
        <div className="px-8 pt-7 pb-6">
          <div className="flex items-start justify-between">
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center ${config.iconBg}`}
            >
              {config.icon}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              {Icons.close}
            </button>
          </div>

          <h3 className="text-[20px] font-bold text-gray-900 mt-5 mb-1">{config.title}</h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">{config.subtitle}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mx-8" />


        {/* ── Section 3: Status Transition ── */}
        <div className="px-8 py-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            {Icons.swap}
            Status Change
          </p>
          <TransitionArrow from={currentStatus} to={newStatus} />
        </div>


        {/* ── Section 2: Seat Details ── */}
        <div className="px-8 py-5 space-y-3">
          {/* Row: table info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400 text-[12px]">
              {Icons.tag}
              <span>Table</span>
            </div>
            <span className="font-bold text-gray-900 text-[16px]">#{seat?.tableNumber}</span>
          </div>

          {/* Row: QR code */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-gray-400">QR Code</span>
            <span className="font-mono text-[13px] font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
              {seat?.qrNumber}
            </span>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mx-8" />

        {/* ── Section 3: Status Transition ── */}
        {/* <div className="px-8 py-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            {Icons.swap}
            Status Change
          </p>
          <TransitionArrow from={currentStatus} to={newStatus} />
        </div> */}

        {/* Divider */}
        <div className="border-t border-gray-100 mx-8" />

        {/* Divider */}
        <div className="border-t border-gray-100 mx-8" />

        {/* ── Section 5: Warning + CTA ── */}
        <div className="px-8 py-6 space-y-4">

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 text-[14px] font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 text-white text-[14px] font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmCls}`}
            >
              {config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};