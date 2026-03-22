// FiltersBar.jsx — Search input + status dropdown + legend

import { Icons } from "./icons";

export const FiltersBar = ({ searchQuery, onSearchChange, filterStatus, onFilterChange }) => (
  <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
    {/* Search + dropdown */}
    <div className="flex items-center gap-3 flex-1 max-w-md">
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {Icons.search}
        </div>
        <input
          type="text"
          placeholder="Search by table number or QR code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-gray-400 transition-all bg-white"
        />
      </div>

      <div className="relative">
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="pl-5 pr-12 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-gray-400 appearance-none bg-white"
        >
          <option value="all">All Seats</option>
          <option value="AVAILABLE">Available</option>
          <option value="OCCUPIED">Occupied</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {Icons.chevron}
        </div>
      </div>
    </div>

    {/* Legend */}
    <div className="flex items-center gap-6 bg-white px-6 py-2 rounded-full border border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 text-gray-700">{Icons.sofa}</div>
        <span className="text-[13px] text-gray-600">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 text-gray-700">{Icons.person}</div>
        <span className="text-[13px] text-gray-600">Occupied</span>
      </div>
    </div>
  </div>
);