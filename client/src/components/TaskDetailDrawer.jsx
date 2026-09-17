import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Clock, 
  MessageSquare, 
  History, 
  Send, 
  Tag, 
  CheckCircle2, 
  Flame,
  ListTodo,
  CheckSquare,
  Square,
  Edit3
} from 'lucide-react';
import { api } from '../services/api';

export default function TaskDetailDrawer({
  isOpen,
  onClose,
  taskId,
  onEditTask,
  onToggleSubtask,
  currentUser = { name: 'Alex Rivera', email: 'alex.rivera@quantiphi.com' }
}) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const data = await api.getTaskDetails(taskId);
      setTask(data);
    } catch (err) {
      console.error('Error fetching task details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  if (!isOpen) return null;

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      const res = await api.addComment(taskId, {
        user_name: currentUser.name,
        user_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`,
        text: commentText.trim()
      });
      setCommentText('');
      setTask(res.task);
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const subtasks = task?.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div 
        className="w-full max-w-xl bg-slate-900 border-l border-slate-700/80 h-full flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
              {task?.id || 'TASK'}
            </span>
            <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${
              task?.priority === 'URGENT' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
              task?.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
              task?.priority === 'MEDIUM' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
              'bg-slate-500/20 text-slate-300 border-slate-500/40'
            }`}>
              {task?.priority || 'MEDIUM'}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              • {task?.status?.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {task && (
              <button
                onClick={() => {
                  onClose();
                  onEditTask(task);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Edit full task"
              >
                <Edit3 className="w-4 h-4 text-indigo-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
            Loading task details...
          </div>
        ) : task ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Title & Description */}
            <div>
              <h2 className="text-xl font-bold text-white leading-snug">
                {task.title}
              </h2>
              {task.description && (
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  {task.description}
                </p>
              )}
            </div>

            {/* Meta Grid (Assignee, Due Date) */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assignee</span>
                {task.assigned_to ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={task.assignee_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigned_to}`}
                      alt={task.assignee_name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-200">{task.assignee_name}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">Unassigned</span>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Due Date</span>
                <div className="flex items-center gap-1.5 text-xs text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}</span>
                </div>
              </div>
            </div>

            {/* Subtasks Checklist */}
            {subtasks.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Subtasks ({completedSubtasks}/{subtasks.length})</span>
                  </h4>
                  <span className="text-xs font-bold text-indigo-300">
                    {Math.round((completedSubtasks / subtasks.length) * 100)}%
                  </span>
                </div>

                <div className="space-y-1.5">
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => {
                        onToggleSubtask(task.id, st.id);
                        setTask(prev => ({
                          ...prev,
                          subtasks: prev.subtasks.map(s => s.id === st.id ? { ...s, completed: !s.completed } : s)
                        }));
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 cursor-pointer transition-colors border border-slate-800/80"
                    >
                      {st.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity History Audit Trail */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>Activity Audit Trail</span>
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {(task.activities || []).length > 0 ? (
                  task.activities.map((act) => (
                    <div key={act.id} className="text-[11px] text-slate-400 flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-200">{act.user_name} </span>
                        <span>{act.action}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No activity recorded yet</p>
                )}
              </div>
            </div>

            {/* Comments Feed */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Team Comments ({task.comments?.length || 0})</span>
              </h4>

              <div className="space-y-2.5 mb-4">
                {(task.comments || []).map((comm) => (
                  <div key={comm.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={comm.user_avatar}
                          alt={comm.user_name}
                          className="w-5 h-5 rounded-full object-cover border border-slate-700"
                        />
                        <span className="text-xs font-bold text-slate-200">{comm.user_name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 pl-7 leading-relaxed">{comm.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSendComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type a team update or comment..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
