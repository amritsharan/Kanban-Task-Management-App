import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus, CheckCircle2, Clock, CircleDot, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const COLUMNS = [
  {
    id: 'TODO',
    title: 'To-Do',
    icon: CircleDot,
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    headerAccent: 'from-indigo-500/20 to-transparent',
    dotColor: 'bg-indigo-400'
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    icon: Clock,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    headerAccent: 'from-amber-500/20 to-transparent',
    dotColor: 'bg-amber-400'
  },
  {
    id: 'DONE',
    title: 'Done',
    icon: CheckCircle2,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    headerAccent: 'from-emerald-500/20 to-transparent',
    dotColor: 'bg-emerald-400'
  }
];

export default function KanbanBoard({
  tasks = [],
  columnStats = {},
  workload = [],
  onMoveTask,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
  onOpenDetails,
  onOpenNewTaskModal
}) {
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const burnoutUserIds = new Set(
    workload.filter(u => u.is_burnout_warning || u.in_progress_count > 5).map(u => u.id)
  );

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onMoveTask(taskId, targetStatus);
      if (targetStatus === 'DONE') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter(t => t.status === column.id);
        const taskCount = columnStats[column.id] !== undefined ? columnStats[column.id] : columnTasks.length;
        const Icon = column.icon;
        const isDragTarget = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex flex-col bg-slate-900/50 backdrop-blur-md rounded-2xl border transition-all duration-200 min-h-[550px] shadow-xl ${
              isDragTarget 
                ? 'drag-over-column border-indigo-500 scale-[1.01]' 
                : 'border-slate-800/80 hover:border-slate-700/80'
            }`}
          >
            {/* Column Header */}
            <div className={`p-4 border-b border-slate-800/80 bg-gradient-to-b ${column.headerAccent} rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                  <h3 className="font-bold text-sm text-slate-100 tracking-tight flex items-center gap-2">
                    {column.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-inner ${column.badgeColor}`}>
                    {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                  </span>
                  
                  <button
                    onClick={() => onOpenNewTaskModal(column.id)}
                    title={`Add task to ${column.title}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto max-h-[calc(100vh-320px)]">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onMoveStatus={onMoveTask}
                    onToggleSubtask={onToggleSubtask}
                    onOpenDetails={onOpenDetails}
                    isAssigneeOverloaded={task.assigned_to ? burnoutUserIds.has(task.assigned_to) : false}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-800/60 rounded-xl text-center">
                  <div className="p-3 rounded-full bg-slate-800/40 text-slate-500 mb-2">
                    <Icon className="w-5 h-5 opacity-40" />
                  </div>
                  <p className="text-xs font-medium text-slate-400">No tasks in {column.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Drag a card here or create a new one</p>
                  <button
                    onClick={() => onOpenNewTaskModal(column.id)}
                    className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create task</span>
                  </button>
                </div>
              )}
            </div>

            {/* Column Quick Add Footer */}
            <div className="p-3 border-t border-slate-800/60">
              <button
                onClick={() => onOpenNewTaskModal(column.id)}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-xs text-slate-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
