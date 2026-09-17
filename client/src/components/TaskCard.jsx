import React from 'react';
import { 
  Calendar, 
  Clock, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Flame,
  CheckCircle2,
  ListTodo,
  CheckSquare,
  Square
} from 'lucide-react';

const PRIORITY_STYLES = {
  URGENT: {
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
    dot: 'bg-red-500 shadow-red-500/50',
    border: 'border-l-red-500'
  },
  HIGH: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dot: 'bg-amber-500 shadow-amber-500/50',
    border: 'border-l-amber-500'
  },
  MEDIUM: {
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    dot: 'bg-blue-500 shadow-blue-500/50',
    border: 'border-l-blue-500'
  },
  LOW: {
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    dot: 'bg-slate-400',
    border: 'border-l-slate-500'
  }
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onMoveStatus,
  onToggleSubtask,
  isAssigneeOverloaded
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showSubtasks, setShowSubtasks] = React.useState(false);
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isOverdue = date < now && task.status !== 'DONE';
    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { formatted, isOverdue };
  };

  const dueInfo = formatDate(task.due_date);

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className={`glass-card group relative rounded-xl p-4 border-l-4 ${priorityStyle.border} hover:border-slate-600 transition-all cursor-grab active:cursor-grabbing select-none shadow-md`}
    >
      {/* Card Header: Priority & Action Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${priorityStyle.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${priorityStyle.dot}`} />
          {task.priority}
        </span>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Quick Context Dropdown Menu */}
          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <div className="absolute right-0 top-6 z-50 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 text-xs text-slate-200 divide-y divide-slate-800">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit(task);
                  }}
                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-indigo-600/30 text-left"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Edit Task</span>
                </button>

                {task.status !== 'TODO' && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onMoveStatus(task.id, task.status === 'DONE' ? 'IN_PROGRESS' : 'TODO');
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left text-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                    <span>Move Back</span>
                  </button>
                )}

                {task.status !== 'DONE' && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onMoveStatus(task.id, task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE');
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left text-slate-300"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Advance Status</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete(task.id);
                  }}
                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-red-500/20 text-red-400 text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4 className={`text-sm font-semibold text-slate-100 mb-1.5 leading-snug group-hover:text-indigo-200 transition-colors ${task.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-400 mb-2.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtasks Progress & Expandable Checklist */}
      {subtasks.length > 0 && (
        <div className="mb-3 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
          <div 
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="flex items-center justify-between text-[11px] font-medium text-slate-300 cursor-pointer hover:text-white"
          >
            <div className="flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
              <span>Subtasks: {completedSubtasks}/{subtasks.length}</span>
            </div>
            <span className="text-[10px] text-indigo-300 font-bold">{subtaskProgress}%</span>
          </div>

          {/* Mini progress bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>

          {/* Expandable subtask items */}
          {showSubtasks && (
            <div className="mt-2 space-y-1.5 pt-1.5 border-t border-slate-800/60">
              {subtasks.map((st) => (
                <div 
                  key={st.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleSubtask) onToggleSubtask(task.id, st.id);
                  }}
                  className="flex items-start gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                >
                  {st.completed ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-[11px] leading-tight ${st.completed ? 'line-through text-slate-500' : ''}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Card Footer: Due Date & Assignee */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 mt-1">
        {/* Due Date Indicator */}
        {dueInfo ? (
          <div
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
              dueInfo.isOverdue
                ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                : 'text-slate-400 bg-slate-800/60'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{dueInfo.formatted}</span>
            {dueInfo.isOverdue && <span className="font-bold text-[9px] uppercase tracking-wide">Overdue</span>}
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">No due date</span>
        )}

        {/* Assignee Avatar with Workload Burnout Ring */}
        {task.assigned_to ? (
          <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignee_name || 'Member'}`}>
            <div className="relative">
              <img
                src={task.assignee_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigned_to}`}
                alt={task.assignee_name || 'Assignee'}
                className={`w-6 h-6 rounded-full object-cover border ${
                  isAssigneeOverloaded
                    ? 'border-red-500 animate-burnout-pulse ring-2 ring-red-500/40'
                    : 'border-slate-600'
                }`}
              />
              {isAssigneeOverloaded && (
                <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-300 max-w-[80px] truncate">
              {task.assignee_name?.split(' ')[0] || 'Member'}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-500 italic">Unassigned</span>
        )}
      </div>

    </div>
  );
}
