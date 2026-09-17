import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'N', desc: 'Create a new task' },
    { key: '/', desc: 'Focus live search input' },
    { key: 'A', desc: 'Open Sprint Analytics Dashboard' },
    { key: 'E', desc: 'Open Export & Report Generator' },
    { key: 'T', desc: 'Open Team & Roles Modal' },
    { key: 'R', desc: 'Trigger Smart Auto-Rebalance (when overloaded)' },
    { key: 'Esc', desc: 'Close any active modal or drawer' },
    { key: '?', desc: 'Open this keyboard shortcuts guide' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Power-user keybindings for lightning productivity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2 max-h-72 overflow-y-auto">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-300">{s.desc}</span>
              <kbd className="px-2 py-1 bg-slate-800 text-indigo-300 font-mono text-xs font-bold rounded-lg border border-slate-700 shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
