// SuccessToast.jsx — Bottom toast shown after a status update

import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "./icons";

export const SuccessToast = ({ seat }) => (
  <AnimatePresence>
    {seat && (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-2xl px-6 py-4 z-30 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
          {Icons.check}
        </div>
        <div>
          <p className="font-medium">Status Updated</p>
          <p className="text-[12px] text-gray-400">
            Table {seat.tableNumber} is now{" "}
            {seat.status === "AVAILABLE" ? "occupied" : "available"}
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);