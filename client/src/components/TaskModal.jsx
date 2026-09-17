import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, AlertTriangle, User, Tag, Sparkles, Plus, Trash2, ListTodo } from 'lucide-react';
import { api } from '../services/api';

const PRIORITIES = [
  { id: 'LOW', label: 'Low', color: 'border-slate-500 text-slate-300', dot: 'bg-slate-400' },
  { id: 'MEDIUM', label: 'Medium', color: 'border-blue-500 text-blue-300', dot: 'bg-blue-400' },
  { id: 'HIGH', label: 'High', color: 'border-amber-500 text-amber-300', dot: 'bg-amber-400' },
  { id: 'URGENT', label: 'Urgent', color: 'border-red-500 text-red-300', dot: 'bg-red-400' }
];

const STATUSES = [
  { id: 'TODO', label: 'To-Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'DONE', label: 'Done' }
];

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask = null,
  defaultStatus = 'TODO',
  members = [],
  projectId
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'MEDIUM');
      setStatus(initialTask.status || 'TODO');
      setDueDate(initialTask.due_date || '');
      setAssignedTo(initialTask.assigned_to || '');
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus(defaultStatus || 'TODO');
      setDueDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
      setAssignedTo(members[0]?.id || '');
      setSubtasks([]);
    }
    setError('');
  }, [initialTask, defaultStatus, members, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    const newSt = {
      id: 'sub-' + Math.random().toString(36).substr(2, 6),
      title: newSubtaskInput.trim(),
      completed: false
    };
    setSubtasks(prev => [...prev, newSt]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleAIGenerateSubtasks = async () => {
    if (!title.trim()) {
      setError('Please enter a task title first to generate AI subtasks');
      return;
    }
    try {
      setIsGeneratingSubtasks(true);
      setError('');
      const generated = await api.generateSubtasks(title.trim());
      setSubtasks(prev => [...prev, ...generated]);
    } catch (err) {
      setError(err.message || 'Failed to generate subtasks');
    } finally {
      setIsGeneratingSubtasks(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit({
        project_id: projectId,
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate || null,
        assigned_to: assignedTo || null,
        subtasks
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-400">
              {initialTask ? 'Update task metadata, subtasks, and assignees' : 'Fill in the details to add a task card to the Kanban board'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement acoustic feature extraction pipeline"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical specifications, context, or acceptance criteria..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 resize-none"
            />
          </div>

          {/* Subtasks Section with AI Generator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
                <span>Subtasks ({subtasks.length})</span>
              </label>

              {/* AI Generator Button */}
              <button
                type="button"
                onClick={handleAIGenerateSubtasks}
                disabled={isGeneratingSubtasks}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSubtasks ? 'animate-spin' : ''}`} />
                <span>{isGeneratingSubtasks ? 'Generating AI Subtasks...' : 'AI Generate Subtasks'}</span>
              </button>
            </div>

            {/* Subtask Input */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask and press Enter..."
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtask List */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 bg-slate-950/40 p-2 rounded-xl border border-slate-800">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center justify-between gap-2 p-1.5 rounded-md bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-300 truncate flex-1">{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-slate-500 hover:text-red-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Priority Tag
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPriority(p.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    priority === p.id
                      ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status & Assignee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Column Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {STATUSES.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Assignee
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="" className="bg-slate-900">Unassigned</option>
                {members.map(m => (
                  <option key={m.id} value={m.id} className="bg-slate-900">
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
