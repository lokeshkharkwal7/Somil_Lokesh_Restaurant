// src/components/merchant/bill-and-payments/dateFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icons } from './icons';

export const DateFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  
  // Get today's date for default
  const today = new Date().toISOString().split('T')[0];
  
  // Get dates from URL or use today as default
  const startDate = searchParams.get('startDate') || today;
  const endDate = searchParams.get('endDate') || today;
  
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const dropdownRef = useRef(null);

  // Update temp dates when URL changes
  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  // Check which preset is currently active
  useEffect(() => {
    const checkActivePreset = () => {
      const today = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Check Today
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));
      if (startDate === endDate && start.toDateString() === new Date().toDateString()) {
        setActivePreset('Today');
        return;
      }
      
      // Check Yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (startDate === endDate && start.toDateString() === yesterday.toDateString()) {
        setActivePreset('Yesterday');
        return;
      }
      
      // Check Last 7 days
      const last7DaysStart = new Date();
      last7DaysStart.setDate(last7DaysStart.getDate() - 6);
      last7DaysStart.setHours(0, 0, 0, 0);
      if (start.toDateString() === last7DaysStart.toDateString() && end.toDateString() === new Date().toDateString()) {
        setActivePreset('Last 7 days');
        return;
      }
      
      // Check Last 30 days
      const last30DaysStart = new Date();
      last30DaysStart.setDate(last30DaysStart.getDate() - 29);
      last30DaysStart.setHours(0, 0, 0, 0);
      if (start.toDateString() === last30DaysStart.toDateString() && end.toDateString() === new Date().toDateString()) {
        setActivePreset('Last 30 days');
        return;
      }
      
      // Check This month
      const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      if (start.toDateString() === thisMonthStart.toDateString() && end.toDateString() === new Date().toDateString()) {
        setActivePreset('This month');
        return;
      }
      
      setActivePreset(null);
    };
    
    checkActivePreset();
  }, [startDate, endDate]);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      if (startDate === endDate) {
        return formatDisplayDate(startDate);
      }
      return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
    }
    return 'Select date range';
  };

  const presetRanges = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'This month', custom: 'month' },
  ];

  const handlePresetClick = (range) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (range.days === 0) {
      start = today;
      end = today;
    } else if (range.days === 1) {
      start.setDate(today.getDate() - 1);
      end.setDate(today.getDate() - 1);
    } else if (range.days) {
      start.setDate(today.getDate() - range.days);
      end = today;
    } else if (range.custom === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = today;
    }

    const formatForInput = (date) => {
      return date.toISOString().split('T')[0];
    };

    setTempStartDate(formatForInput(start));
    setTempEndDate(formatForInput(end));
    setActivePreset(range.label);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    
    params.set('startDate', tempStartDate);
    params.set('endDate', tempEndDate);
    
    // Reset page when dates change
    params.delete('page');
    
    setSearchParams(params);
    setIsOpen(false);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('startDate');
    params.delete('endDate');
    params.delete('page');
    
    setSearchParams(params);
    setIsOpen(false);
    setActivePreset(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setTempStartDate(startDate);
        setTempEndDate(endDate);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startDate, endDate]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200
          ${startDate ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-sm'}
        `}
      >
        <span className={startDate ? 'text-white/90' : 'text-gray-400'}>
          {Icons.calendarRange}
        </span>
        <span className="text-[13px] font-medium whitespace-nowrap">
          {getDisplayText()}
        </span>
        <span className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          {Icons.chevronDown}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-[680px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out;
              }
            `}</style>
            <div className="flex divide-x divide-gray-100">
              <div className="w-48 p-4 bg-gray-50/50">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Quick Select
                </p>
                <div className="space-y-1">
                  {presetRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handlePresetClick(range)}
                      className={`
                        w-full text-left px-3 py-2 text-[13px] rounded-xl transition-all duration-200
                        ${activePreset === range.label 
                          ? 'bg-gray-900 text-white shadow-sm' 
                          : 'text-gray-600 hover:bg-white hover:text-gray-900'
                        }
                      `}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 p-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      From
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={tempStartDate}
                        onChange={(e) => {
                          setTempStartDate(e.target.value);
                          setActivePreset(null);
                        }}
                        className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:border-gray-400 transition-colors appearance-none"
                      />
                      <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                        {Icons.calendar}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-300 font-light mt-6">—</div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      To
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={tempEndDate}
                        onChange={(e) => {
                          setTempEndDate(e.target.value);
                          setActivePreset(null);
                        }}
                        min={tempStartDate}
                        className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:border-gray-400 transition-colors appearance-none"
                      />
                      <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                        {Icons.calendar}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 text-[13px] text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-medium rounded-xl transition-all shadow-sm hover:shadow"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};