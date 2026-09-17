import React from 'react';
import { Search, Filter, X, ArrowUpDown, UserCheck } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  assigneeFilter,
  onAssigneeChange,
  members = [],
  onClearFilters
}) {
  const isFiltering = searchQuery !== '' || priorityFilter !== 'ALL' || assigneeFilter !== 'ALL';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
      
      {/* Search Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter tasks by title or description..."
          className="w-full bg-slate-950/80 text-xs sm:text-sm text-slate-200 pl-9 pr-8 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 placeholder:text-slate-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs text-slate-400 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">All Priorities</option>
            <option value="URGENT" className="bg-slate-900 text-red-400">🔴 Urgent</option>
            <option value="HIGH" className="bg-slate-900 text-amber-400">🟠 High</option>
            <option value="MEDIUM" className="bg-slate-900 text-blue-400">🔵 Medium</option>
            <option value="LOW" className="bg-slate-900 text-slate-400">⚪ Low</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs text-slate-400 font-medium">Assignee:</span>
          <select
            value={assigneeFilter}
            onChange={(e) => onAssigneeChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer max-w-[130px] truncate"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">All Assignees</option>
            {members.map(m => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset / Clear Filters */}
        {isFiltering && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

    </div>
  );
}
