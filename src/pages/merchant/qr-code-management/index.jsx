/**
 * QrManagement.jsx
 *
 * CREATE FLOW (2 steps):
 *   Step 1 → POST { tableNumber, qrNumber, rest_id }
 *              ↳ backend saves record, returns { data: { _id: "abc123", ... } }
 *
 *   Step 2 → PUT { _id: "abc123", url: "http://localhost:3000/{rest_id}/{_id}" }
 *              ↳ url is now built from the real MongoDB _id, not tableNumber
 *
 * Final URL shape:  http://localhost:3000/{rest_id}/{mongoDb_id}
 * Example:          http://localhost:3000/69a973fb7fda258dd239a00e/abc123def456
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  useQrTables,
  useCreateQrTable,
  useUpdateQrTable,
  useDeleteQrTable,
} from "../../../hooks";

// Frontend base — change via .env: REACT_APP_FRONTEND_URL=https://yourdomain.com
const FRONTEND_BASE_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';

/**
 * Builds the final QR URL using the MongoDB _id returned after saving.
 * Shape: http://localhost:3000/{rest_id}/{mongoDb_id}
 */
const buildTableUrl = (rest_id, mongoId) =>
  `${FRONTEND_BASE_URL}/${rest_id}/${mongoId}`;

/* ─────────────────────────────────────────────
   ICONS
   ───────────────────────────────────────────── */
const Icons = {
  add:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  print:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="6 18 6 11 18 11 18 18"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><line x1="6" y1="7" x2="6" y2="3"/><line x1="18" y1="7" x2="18" y2="3"/><line x1="10" y1="15" x2="14" y2="15"/></svg>,
  copy:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  delete:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0h10"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  qr:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>,
  table:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500"><polyline points="20 6 9 17 4 12"/></svg>,
  close:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevron:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  link:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
};

/* ─────────────────────────────────────────────
   STATUS BADGE
   ───────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const isAvailable = status === 'AVAILABLE';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
      isAvailable ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
    }`}>
      {isAvailable ? 'Available' : 'Occupied'}
    </span>
  );
};

/* ─────────────────────────────────────────────
   TOGGLE
   ───────────────────────────────────────────── */
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-gray-900' : 'bg-gray-200'
    }`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      enabled ? 'translate-x-6' : 'translate-x-1'
    }`} />
  </button>
);

/* ─────────────────────────────────────────────
   TableModal
   Only 2 fields: tableNumber + qrNumber (independent)
   url is never shown — it's built after the POST returns _id
   ───────────────────────────────────────────── */
const TableModal = ({ isOpen, onClose, table, onSave }) => {
  const defaultForm = { tableNumber: '', qrNumber: '' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    setFormData(
      table
        ? { tableNumber: table.tableNumber, qrNumber: table.qrNumber || '' }
        : defaultForm
    );
  }, [table, isOpen]);

  if (!isOpen) return null;

  const isValid = formData.tableNumber && formData.qrNumber;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-gray-900">
            {table ? 'Edit' : 'Add'} Table
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            {Icons.close}
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* tableNumber – independent Number */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Table Number <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.tableNumber}
              onChange={(e) =>
                setFormData({ ...formData, tableNumber: parseInt(e.target.value) || '' })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-gray-400"
              placeholder="e.g. 7"
            />
          </div>

          {/* qrNumber – independent String, no auto-fill */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              QR Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.qrNumber}
              onChange={(e) => setFormData({ ...formData, qrNumber: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-gray-400"
              placeholder="e.g. QR-TABLE-709"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (isValid) { onSave(formData); onClose(); } }}
            disabled={!isValid}
            className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            Save Table
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   QRCard
   ───────────────────────────────────────────── */
const QRCard = ({ table, onToggle, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [copied,  setCopied]  = useState(false);

  const qrUrl = table.url || '';

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = document.getElementById(`qr-${table._id}`);
    if (canvas) {
      const link    = document.createElement('a');
      link.download = `${table.qrNumber || `Table-${table.tableNumber}`}-QR.png`;
      link.href     = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300"
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity .45s ease, transform .45s ease',
      }}
    >
      <div className="p-6">

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
              {Icons.table}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">
                Table {table.tableNumber}
              </h3>
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                {table.qrNumber && <span>#{table.qrNumber}</span>}
                {table.qrNumber && <span>·</span>}
                <StatusBadge status={table.status} />
              </p>
            </div>
          </div>
          <Toggle
            enabled={table.status === 'AVAILABLE'}
            onChange={() => onToggle(table)}
          />
        </div>

        {/* QR Code – encodes the url stored in DB */}
        <div className="flex flex-col items-center py-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            {qrUrl ? (
              <QRCodeCanvas
                id={`qr-${table._id}`}
                value={qrUrl}
                size={160}
                level="H"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            ) : (
              // Brief "Generating…" state shown while the PUT to save url is in-flight
              <div className="w-[160px] h-[160px] flex items-center justify-center">
                <p className="text-[11px] text-gray-300">Generating…</p>
              </div>
            )}
          </div>

          {/* Collapsible URL */}
          <div className="w-full mt-4">
            <button
              onClick={() => setShowUrl(!showUrl)}
              className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 mb-2"
            >
              {Icons.link}
              <span>Show QR URL</span>
              <span style={{ transform: `rotate(${showUrl ? 90 : 0}deg)`, display: 'inline-block', transition: 'transform .3s' }}>
                {Icons.chevron}
              </span>
            </button>
            {showUrl && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                <code className="flex-1 text-[10px] text-gray-600 truncate">{qrUrl || '—'}</code>
                <button
                  onClick={handleCopyUrl}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
                  title="Copy URL"
                >
                  {copied ? Icons.check : Icons.copy}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDownload}
            disabled={!qrUrl}
            className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[12px] rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {Icons.download} Download
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[12px] rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {Icons.print} Print
          </button>
          <button
            onClick={() => onDelete(table._id)}
            className="px-3 py-2 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-500 text-[12px] rounded-xl transition-colors"
            title="Delete table"
          >
            {Icons.delete}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   BulkGenerateModal
   ───────────────────────────────────────────── */
const BulkGenerateModal = ({ isOpen, onClose, onGenerate }) => {
  const [formData, setFormData] = useState({
    startTable: 1,
    endTable:   12,
    qrPrefix:   'QR-TABLE-',
  });

  if (!isOpen) return null;

  const count = Math.max(0, formData.endTable - formData.startTable + 1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">

        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-gray-900">Bulk Generate QR Codes</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">{Icons.close}</button>
        </div>

        <div className="p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Start Table #
              </label>
              <input
                type="number"
                min="1"
                value={formData.startTable}
                onChange={(e) => setFormData({ ...formData, startTable: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                End Table #
              </label>
              <input
                type="number"
                min={formData.startTable}
                value={formData.endTable}
                onChange={(e) => setFormData({ ...formData, endTable: parseInt(e.target.value) || formData.startTable })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              QR Number Prefix
            </label>
            <input
              type="text"
              value={formData.qrPrefix}
              onChange={(e) => setFormData({ ...formData, qrPrefix: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-gray-400"
              placeholder="QR-TABLE-"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              e.g. <code>{formData.qrPrefix || 'QR-TABLE-'}{formData.startTable}</code>,{' '}
              <code>{formData.qrPrefix || 'QR-TABLE-'}{formData.startTable + 1}</code>…
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-[12px] text-gray-600">
              Will create <strong>{count}</strong> table{count !== 1 ? 's' : ''} (Table{' '}
              {formData.startTable}–{formData.endTable}). URL generated from MongoDB ID after each save.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onGenerate(formData); onClose(); }}
            disabled={count <= 0}
            className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {Icons.add} Generate {count} QR Code{count !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function QRManagement() {
  const { rest_id } = useParams();
  const navigate = useNavigate();

  const [time,             setTime]             = useState(new Date());
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isBulkModalOpen,  setIsBulkModalOpen]  = useState(false);
  const [editingTable,     setEditingTable]      = useState(null);
  const [statusFilter,     setStatusFilter]      = useState('all');
  const [searchQuery,      setSearchQuery]       = useState('');
  const [page,             setPage]              = useState(1);
  const LIMIT = 12;

  // ── React Query ───────────────────────────────────────────
  const { data: qrData, isLoading, isError, error } = useQrTables({
    rest_id,
    page,
    limit:  LIMIT,
    search: searchQuery,
    status: statusFilter !== 'all' ? statusFilter : '',
  });

  const createMutation = useCreateQrTable();
  const updateMutation = useUpdateQrTable();
  const deleteMutation = useDeleteQrTable();

  const tables = qrData?.data || [];
  const meta   = qrData?.meta || {};

  // Handle back navigation
  const handleBack = () => {
    navigate(`/merchant/${rest_id}`);
  };

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;
  const occupiedCount  = tables.filter((t) => t.status === 'OCCUPIED').length;

  /* ─────────────────────────────────────────────
     handleSaveTable — 2-step CREATE flow

     Step 1: POST { tableNumber, qrNumber, rest_id }
               ↳ backend returns saved record with _id

     Step 2: PUT { _id, url }
               ↳ url = `${FRONTEND_BASE_URL}/${rest_id}/${_id}`
               ↳ Example: http://localhost:3000/69a973fb.../abc123...

     EDIT: single PUT with updated tableNumber / qrNumber
   ───────────────────────────────────────────── */
  const handleSaveTable = async (formData) => {
    if (editingTable) {
      // UPDATE – only tableNumber and qrNumber can be edited
      updateMutation.mutate({
        _id:         editingTable._id,
        tableNumber: formData.tableNumber,
        qrNumber:    formData.qrNumber,
      });
      return;
    }

    try {
      // STEP 1 – save to DB, receive MongoDB _id
      const createRes = await createMutation.mutateAsync({
        tableNumber: formData.tableNumber,
        qrNumber:    formData.qrNumber,
        rest_id,
      });

      // Extract _id from response — adjust path if your API wraps differently
      const mongoId = createRes?.data?._id;

      if (!mongoId) {
        console.error('No _id returned from create response:', createRes);
        return;
      }

      // STEP 2 – patch the url using the real MongoDB _id
      // Final shape: http://localhost:3000/{rest_id}/{mongoDb_id}
      const url = buildTableUrl(rest_id, mongoId);
      updateMutation.mutate({ _id: mongoId, url });

    } catch (err) {
      console.error('Failed to create QR table:', err?.response?.data?.message || err.message);
    }
  };

  /** Toggle AVAILABLE ↔ OCCUPIED via the card toggle */
  const handleToggleTable = (table) => {
    updateMutation.mutate({
      _id:    table._id,
      status: table.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE',
    });
  };

  const handleDeleteTable = (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      deleteMutation.mutate(tableId);
    }
  };

  /**
   * Bulk create — same 2-step flow, run sequentially per table.
   * Tables that already exist are skipped (backend returns 400).
   */
  const handleBulkGenerate = async ({ startTable, endTable, qrPrefix }) => {
    const prefix = qrPrefix || 'QR-TABLE-';

    for (let i = startTable; i <= endTable; i++) {
      try {
        // STEP 1 – create and get _id
        const createRes = await createMutation.mutateAsync({
          tableNumber: i,
          qrNumber:    `${prefix}${i}`,
          rest_id,
        });

        const mongoId = createRes?.data?._id;

        if (mongoId) {
          // STEP 2 – patch url with real MongoDB _id
          const url = buildTableUrl(rest_id, mongoId);
          await updateMutation.mutateAsync({ _id: mongoId, url });
        }
      } catch (err) {
        console.warn(`Skipped Table ${i}:`, err?.response?.data?.message);
      }
    }
  };

  const handleDownloadAll = () => alert('Download all feature coming soon!');

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F2F2F7]">

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-5">
                        <button
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 hover:bg-gray-100 hover:shadow-md flex items-center justify-center text-black transition-all duration-200"
              title="Go to Dashboard"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-[10px] bg-gray-900 flex items-center justify-center text-white">
              {Icons.qr}
            </div>
            <p className="font-bold text-gray-900">QR Management</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-400 tabular-nums">{time.toLocaleTimeString()}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
              QR
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Title */}
        <div className="mb-8">

          <div className="flex items-start gap-4 mb-3">

            {/* Back Button */}
            {/* <button
              onClick={handleBack}
              className="w-12 h-12 mt-[15px] rounded-full bg-gray-200 border border-gray-200 hover:bg-gray-100 hover:shadow-md flex items-center justify-center text-black transition-all duration-200"
              title="Go to Dashboard"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button> */}

            {/* Header Text */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                QR Code Generator
              </p>

              <h2 className="text-[34px] font-bold text-gray-900">
                Table QR Codes
              </h2>

              <p className="text-gray-400 text-[14px] mt-1">
                Generate and manage QR codes for your tables. Customers can scan to view the menu.
              </p>
            </div>

          </div>

        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setEditingTable(null); setIsTableModalOpen(true); }}
              className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {Icons.add} Add Table
            </button>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {Icons.add} Bulk Generate
            </button>
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {Icons.download} Download All
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-64 px-4 py-2 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:border-gray-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:border-gray-400"
            >
              <option value="all">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[11px] text-gray-400 mb-1">Total Tables</p>
            <p className="text-[24px] font-bold text-gray-900">{meta.totalRecords ?? tables.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[11px] text-gray-400 mb-1">Available</p>
            <p className="text-[24px] font-bold text-green-600">{availableCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[11px] text-gray-400 mb-1">Occupied</p>
            <p className="text-[24px] font-bold text-orange-500">{occupiedCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[11px] text-gray-400 mb-1">Total Pages</p>
            <p className="text-[24px] font-bold text-gray-900">{meta.totalPages ?? 1}</p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-[14px]">Loading QR tables…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
            <p className="text-red-500 text-[14px]">
              Failed to load tables: {error?.response?.data?.message || error?.message}
            </p>
          </div>
        )}

        {/* QR Grid */}
        {!isLoading && !isError && tables.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tables.map((table) => (
              <QRCard
                key={table._id}
                table={table}
                onToggle={handleToggleTable}
                onDelete={handleDeleteTable}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && tables.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              {Icons.qr}
            </div>
            <p className="text-gray-400 text-[14px] mb-4">No tables found</p>
            <button
              onClick={() => { setEditingTable(null); setIsTableModalOpen(true); }}
              className="px-4 py-2 bg-gray-900 text-white text-[13px] rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              {Icons.add} Add your first table
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 text-[13px] rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-[13px] text-gray-500">Page {meta.page} of {meta.totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="px-4 py-2 bg-white border border-gray-200 text-[13px] rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Modals */}
        <TableModal
          isOpen={isTableModalOpen}
          onClose={() => { setIsTableModalOpen(false); setEditingTable(null); }}
          table={editingTable}
          onSave={handleSaveTable}
        />

        <BulkGenerateModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          onGenerate={handleBulkGenerate}
        />

      </main>
    </div>
  );
}