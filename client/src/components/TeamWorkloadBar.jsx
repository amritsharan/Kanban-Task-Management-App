import React from 'react';
import { Flame, AlertTriangle, ShieldCheck, UserCheck, Activity, Wand2, ArrowRight } from 'lucide-react';

export default function TeamWorkloadBar({
  workload = [],
  onSelectAssigneeFilter,
  selectedAssignee,
  onAutoRebalance,
  isRebalancing = false
}) {
  const burnoutUsers = workload.filter(u => u.is_burnout_warning);

  return (
    <div className="mb-6 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-white uppercase tracking-wider">
                Workload Balancing Radar
              </h2>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full border border-slate-700">
                The Vibe Check
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live capacity radar • Red alert threshold: &gt;5 tasks in progress
            </p>
          </div>
        </div>

        {/* Status Indicator & Smart Auto-Rebalance CTA */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {burnoutUsers.length > 0 ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 burnout-banner-pulse text-xs">
                <Flame className="w-4 h-4 text-red-400 animate-bounce" />
                <span className="font-semibold">
                  Burnout Alert: {burnoutUsers.length} member{burnoutUsers.length > 1 ? 's' : ''} overloaded
                </span>
              </div>

              {/* Smart Auto-Rebalance Button */}
              <button
                onClick={onAutoRebalance}
                disabled={isRebalancing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isRebalancing ? 'animate-spin' : ''}`} />
                <span>{isRebalancing ? 'Rebalancing...' : 'Smart Auto-Rebalance'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-medium">All team workloads balanced (&le;5 active tasks)</span>
            </div>
          )}
        </div>
      </div>

      {/* Team Avatars & Workload Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {workload.map((user) => {
          const isOverloaded = user.is_burnout_warning || user.in_progress_count > 5;
          const isSelected = selectedAssignee === user.id;
          const progressPercent = Math.min(100, Math.round((user.in_progress_count / 5) * 100));

          return (
            <div
              key={user.id}
              onClick={() => onSelectAssigneeFilter(isSelected ? 'ALL' : user.id)}
              className={`relative group p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                isOverloaded
                  ? 'bg-red-950/30 border-red-500/60 shadow-lg shadow-red-950/40 hover:border-red-400'
                  : isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar with dynamic pulsing red background when overloaded */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full p-0.5 border-2 transition-all flex items-center justify-center overflow-hidden ${
                      isOverloaded
                        ? 'animate-burnout-pulse border-red-500 ring-4 ring-red-500/30'
                        : 'border-slate-700 group-hover:border-indigo-500/50'
                    }`}
                  >
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Overload Flame Tag */}
                  {isOverloaded && (
                    <div 
                      title="BURNOUT WARNING: > 5 tasks in progress!" 
                      className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-1 shadow-md shadow-red-900 border border-red-300 animate-bounce"
                    >
                      <Flame className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Progress & In-Progress counter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`font-bold ${isOverloaded ? 'text-red-400' : 'text-slate-300'}`}>
                    {user.in_progress_count} in-progress
                  </span>
                  <span className="text-slate-500">
                    Max: 5
                  </span>
                </div>

                {/* Capacity Bar */}
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverloaded
                        ? 'bg-red-500 animate-pulse'
                        : progressPercent > 60
                        ? 'bg-amber-400'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
