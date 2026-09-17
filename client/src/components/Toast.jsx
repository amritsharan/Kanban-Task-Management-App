import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isError = type === 'error';
  const isWarning = type === 'warning';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-subtle-bounce">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-xs sm:text-sm font-medium ${
        isError
          ? 'bg-red-950/90 border-red-500/50 text-red-200'
          : isWarning
          ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
          : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-100 shadow-indigo-500/20'
      }`}>
        {isError ? (
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        ) : isWarning ? (
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        )}

        <span>{message}</span>

        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
