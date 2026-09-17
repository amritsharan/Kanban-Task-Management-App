import React, { useState } from 'react';
import { X, UserPlus, Trash2, Shield, User, AlertTriangle, Check } from 'lucide-react';

export default function ProjectMembersModal({
  isOpen,
  onClose,
  project,
  members = [],
  allUsers = [],
  onAddMember,
  onRemoveMember,
  onCreateUser
}) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [role, setRole] = useState('Member');
  const [isAddingNewUser, setIsAddingNewUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter users who are not yet in this project
  const memberIds = new Set(members.map(m => m.id));
  const availableUsers = allUsers.filter(u => !memberIds.has(u.id));

  const handleAddExisting = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user to add');
      return;
    }
    try {
      setIsSubmitting(true);
      setError('');
      await onAddMember(project.id, selectedUserId, role);
      setSelectedUserId('');
    } catch (err) {
      setError(err.message || 'Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setError('Please provide name and email');
      return;
    }
    try {
      setIsSubmitting(true);
      setError('');
      const newUser = await onCreateUser({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: 'Member'
      });
      await onAddMember(project.id, newUser.id, role);
      setNewUserName('');
      setNewUserEmail('');
      setIsAddingNewUser(false);
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Project Team & Permissions</span>
            </h3>
            <p className="text-xs text-slate-400">
              Manage members and relational permissions for <span className="text-indigo-300 font-semibold">{project?.name}</span>
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

        {/* Current Members List */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Current Members ({members.length})
          </h4>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{member.name}</h5>
                    <p className="text-[11px] text-slate-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    member.role === 'Admin'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : member.role === 'Viewer'
                      ? 'bg-slate-500/10 text-slate-400 border-slate-600'
                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {member.role}
                  </span>

                  {members.length > 1 && (
                    <button
                      onClick={() => onRemoveMember(project.id, member.id)}
                      title="Remove member from project"
                      className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Member Section */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Add User to Project
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNewUser(!isAddingNewUser)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
            >
              {isAddingNewUser ? 'Choose existing user' : '+ Register new user'}
            </button>
          </div>

          {!isAddingNewUser ? (
            <form onSubmit={handleAddExisting} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select team member...</option>
                {availableUsers.map(u => (
                  <option key={u.id} value={u.id} className="bg-slate-900">
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
                <option value="Viewer">Viewer</option>
              </select>

              <button
                type="submit"
                disabled={isSubmitting || !selectedUserId}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateAndAdd} className="space-y-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Corporate Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Member">Role: Member</option>
                  <option value="Admin">Role: Admin</option>
                  <option value="Viewer">Role: Viewer</option>
                </select>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Create & Add</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
