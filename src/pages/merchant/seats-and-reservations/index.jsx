import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useQrTablesWithOrderStatus, useUpdateQrTable } from "../../../hooks";

import { Header }            from "../../../components/merchant/seats-and-reservation/Header";
import { StatsCards }        from "../../../components/merchant/seats-and-reservation/Statscards";
import { FiltersBar }        from "../../../components/merchant/seats-and-reservation/FilterBar";
import { SeatGrid }          from "../../../components/merchant/seats-and-reservation/Seatgrid";
import { ConfirmationModal } from "../../../components/merchant/seats-and-reservation/Confirmationmodal";
import { SuccessToast }      from "../../../components/merchant/seats-and-reservation/SuccessToast";
import { Icons }             from "../../../components/merchant/seats-and-reservation/icons";

/* ─────────────────────────────────────────────────────────────────────────────
   ORDER STATUS HELPERS
   
   Rules agreed with backend:
     • orderStatus === null / undefined  → seat is effectively AVAILABLE
     • orderStatus === "COMPLETED"       → seat is effectively AVAILABLE
     • orderStatus === "PLACED"          → seat is OCCUPIED
     • orderStatus === "PREPARING"       → seat is OCCUPIED
     • orderStatus === "SERVED"          → seat is OCCUPIED
───────────────────────────────────────────────────────────────────────────── */

// Active order statuses that mean the table is genuinely occupied
const ACTIVE_ORDER_STATUSES = ["PLACED", "PREPARING", "SERVED"];

/**
 * Returns true when the table should be treated as available regardless of
 * what the qrTable.status field says. We trust orderStatus over status because
 * status can lag behind (e.g. staff forgot to mark it available after checkout).
 */
const isEffectivelyAvailable = (seat) => {
  const os = seat.orderStatus;
  return !os || os === "COMPLETED";
};

/**
 * Derives the display status for a seat so the rest of the UI has a single
 * source of truth.  Returns the original seat merged with:
 *   - effectiveStatus : "AVAILABLE" | "OCCUPIED"
 *   - orderStatus     : preserved as-is (may be undefined)
 */
const normalizeSeat = (seat) => ({
  ...seat,
  effectiveStatus: isEffectivelyAvailable(seat) ? "AVAILABLE" : "OCCUPIED",
});

/* ─────────────────────────────────────────────────────────────────────────────
   ORDER STATUS BADGE
   Shown inside occupied seat cards so staff can see the live order stage.
───────────────────────────────────────────────────────────────────────────── */

const ORDER_STATUS_CONFIG = {
  PLACED: {
    label: "Order Placed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  PREPARING: {
    label: "Preparing",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  SERVED: {
    label: "Served",
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
};

export const OrderStatusBadge = ({ orderStatus }) => {
  if (!orderStatus) return null;
  const cfg = ORDER_STATUS_CONFIG[orderStatus];
  if (!cfg) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function SeatingChart() {
  const { rest_id } = useParams();
  const navigate    = useNavigate();

  /* ── local state ── */
  const [searchQuery,    setSearchQuery]    = useState("");
  const [filterStatus,   setFilterStatus]   = useState("all");
  const [time,           setTime]           = useState(new Date());
  const [updatingSeatId, setUpdatingSeatId] = useState(null);
  const [selectedSeat,   setSelectedSeat]   = useState(null);
  const [modalState,     setModalState]     = useState({
    isOpen: false,
    seat: null,
    newStatus: null,
  });

  /* ── data ── */
  const {
    data: qrData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQrTablesWithOrderStatus({ rest_id, page: 1, limit: 100 });

  const updateMutation = useUpdateQrTable();

  /* ── normalize raw tables once so every consumer uses effectiveStatus ── */
  const tables = useMemo(
    () => (qrData?.data || []).map(normalizeSeat),
    [qrData],
  );

  /* ── derived: filter + search ── */
  const filteredSeats = useMemo(() => {
    return tables.filter((seat) => {
      const matchesSearch =
        searchQuery === "" ||
        seat.tableNumber.toString().includes(searchQuery) ||
        seat.qrNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      // filterStatus compares against effectiveStatus, not the raw DB status
      const matchesStatus =
        filterStatus === "all" || seat.effectiveStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [tables, searchQuery, filterStatus]);

  /* ── derived: stats based on effectiveStatus ── */
  const stats = useMemo(
    () => ({
      total:     tables.length,
      available: tables.filter((s) => s.effectiveStatus === "AVAILABLE").length,
      occupied:  tables.filter((s) => s.effectiveStatus === "OCCUPIED").length,
      // breakdown of active order stages (useful for kitchen / floor staff)
      placed:    tables.filter((s) => s.orderStatus === "PLACED").length,
      preparing: tables.filter((s) => s.orderStatus === "PREPARING").length,
      served:    tables.filter((s) => s.orderStatus === "SERVED").length,
    }),
    [tables],
  );

  /* ── handlers ── */
  const handleSeatClick = (seat) => {
    // Toggle is based on effectiveStatus, not the raw DB status
    const newStatus =
      seat.effectiveStatus === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE";
    setModalState({ isOpen: true, seat, newStatus });
  };

  const handleConfirmStatusChange = async (note) => {
    const { seat, newStatus } = modalState;
    setSelectedSeat(seat);
    setUpdatingSeatId(seat._id);

    try {
      await updateMutation.mutateAsync({ _id: seat._id, status: newStatus, note });
      if (window.navigator?.vibrate) window.navigator.vibrate([10, 10, 20]);
    } catch (err) {
      console.error("Failed to toggle seat status:", err);
    } finally {
      setUpdatingSeatId(null);
      setSelectedSeat(null);
    }
  };

  const closeModal = () => setModalState((s) => ({ ...s, isOpen: false }));

  /* ── clock ── */
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  /* ── error ── */
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-500">
            {Icons.error}
          </div>
          <h3 className="text-[20px] font-semibold text-gray-900 mb-2">
            Failed to load seating chart
          </h3>
          <p className="text-[14px] text-gray-500 mb-6">
            {error?.response?.data?.message || error?.message}
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-gray-900 text-white text-[14px] font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── render ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header time={time} navigate={navigate} rest_id={rest_id} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="flex items-start gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Interactive Seat Map
            </p>
            <h2 className="text-[40px] font-bold text-gray-900 leading-tight">
              Restaurant Layout
            </h2>
            <p className="text-gray-500 text-[14px] mt-1">
              Hover for details · Click to change status
            </p>
          </div>
        </div>

        {/*
          Pass the enriched stats down — StatsCards can choose to render
          the order-stage breakdown (placed / preparing / served) if desired.
        */}
        <StatsCards stats={stats} />

        <FiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/*
          SeatGrid receives seats that already have:
            seat.effectiveStatus  — use this for colour / icon logic
            seat.orderStatus      — use this to render <OrderStatusBadge />
        */}
        <SeatGrid
          seats={filteredSeats}
          onSeatClick={handleSeatClick}
          updatingSeatId={updatingSeatId}
          OrderStatusBadge={OrderStatusBadge}
        />

        {modalState.isOpen && (
          <ConfirmationModal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            onConfirm={handleConfirmStatusChange}
            seat={modalState.seat}
            newStatus={modalState.newStatus}
          />
        )}

        <SuccessToast seat={!updatingSeatId ? selectedSeat : null} />
      </main>
    </div>
  );
}