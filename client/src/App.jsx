import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import TeamWorkloadBar from './components/TeamWorkloadBar';
import FilterBar from './components/FilterBar';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import ProjectMembersModal from './components/ProjectMembersModal';
import ProjectModal from './components/ProjectModal';
import Toast from './components/Toast';
import { api } from './services/api';
import { Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [columnStats, setColumnStats] = useState({ TODO: 0, IN_PROGRESS: 0, DONE: 0, TOTAL: 0 });
  const [loading, setLoading] = useState(true);
  const [isRebalancing, setIsRebalancing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumnStatus, setDefaultColumnStatus] = useState('TODO');
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [fetchedProjects, fetchedUsers] = await Promise.all([
        api.getProjects(),
        api.getUsers()
      ]);

      setProjects(fetchedProjects);
      setAllUsers(fetchedUsers);

      if (fetchedProjects.length > 0) {
        const activeProj = currentProject ? fetchedProjects.find(p => p.id === currentProject.id) || fetchedProjects[0] : fetchedProjects[0];
        setCurrentProject(activeProj);
      }
    } catch (err) {
      showToast(err.message || 'Failed to initialize app', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch tasks, members, and workload when currentProject or filters change
  const refreshProjectData = useCallback(async () => {
    if (!currentProject?.id) return;

    try {
      const [tasksRes, membersRes, workloadRes] = await Promise.all([
        api.getTasks({
          projectId: currentProject.id,
          priority: priorityFilter,
          assignedTo: assigneeFilter,
          search: searchQuery
        }),
        api.getMembers(currentProject.id),
        api.getWorkload(currentProject.id)
      ]);

      setTasks(tasksRes.tasks);
      setColumnStats(tasksRes.columnStats);
      setMembers(membersRes);
      setWorkload(workloadRes);
    } catch (err) {
      console.error('Error refreshing project data:', err);
    }
  }, [currentProject?.id, priorityFilter, assigneeFilter, searchQuery]);

  useEffect(() => {
    refreshProjectData();
  }, [refreshProjectData]);

  // Handle Task Drag & Drop / Move
  const handleMoveTask = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      await api.updateTaskStatus(taskId, newStatus);
      refreshProjectData();
      showToast(`Task moved to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      showToast(err.message || 'Failed to move task', 'error');
      refreshProjectData();
    }
  };

  // Handle Toggle Subtask
  const handleToggleSubtask = async (taskId, subtaskId) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          const subtasks = (t.subtasks || []).map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st);
          return { ...t, subtasks };
        }
        return t;
      }));

      await api.toggleSubtask(taskId, subtaskId);
      refreshProjectData();
    } catch (err) {
      showToast(err.message || 'Failed to toggle subtask', 'error');
    }
  };

  // Handle Task Create/Update
  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await api.updateTask(editingTask.id, taskData);
      showToast('Task updated successfully!');
    } else {
      await api.createTask(taskData);
      showToast('New task added to Kanban!');
    }
    refreshProjectData();
  };

  // Handle Task Delete
  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      showToast('Task deleted');
      refreshProjectData();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Handle Smart Auto-Rebalance
  const handleAutoRebalance = async () => {
    if (!currentProject?.id) return;
    try {
      setIsRebalancing(true);
      const res = await api.autoRebalance(currentProject.id);
      
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });

      showToast(`✨ ${res.message || 'Workload successfully rebalanced!'}`, 'success');
      refreshProjectData();
    } catch (err) {
      showToast(err.message || 'Failed to auto-rebalance', 'error');
    } finally {
      setIsRebalancing(false);
    }
  };

  // Open Task Modal for Create
  const handleOpenNewTask = (status = 'TODO') => {
    setEditingTask(null);
    setDefaultColumnStatus(status);
    setIsTaskModalOpen(true);
  };

  // Open Task Modal for Edit
  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Handle Add Project Member
  const handleAddMember = async (projectId, userId, role) => {
    const member = await api.addMember(projectId, userId, role);
    showToast(`Added ${member.name} as ${role}!`);
    refreshProjectData();
  };

  // Handle Remove Project Member
  const handleRemoveMember = async (projectId, userId) => {
    await api.removeMember(projectId, userId);
    showToast('Member removed from project');
    refreshProjectData();
  };

  // Handle Create New User
  const handleCreateUser = async (userData) => {
    const user = await api.createUser(userData);
    const updatedUsers = await api.getUsers();
    setAllUsers(updatedUsers);
    return user;
  };

  // Handle Create Project
  const handleCreateProject = async (projectData) => {
    const created = await api.createProject(projectData);
    const updatedProjects = await api.getProjects();
    setProjects(updatedProjects);
    setCurrentProject(created);
    showToast(`Project "${created.name}" created!`);
  };

  // Simulate Burnout Feature Demo
  const handleSimulateBurnout = async () => {
    if (!currentProject?.id || members.length === 0) return;
    const targetUser = members[0];
    try {
      await api.simulateBurnout(currentProject.id, targetUser.id);
      showToast(`🔥 Overload simulated: 6 in-progress tasks assigned to ${targetUser.name}!`, 'warning');
      refreshProjectData();
    } catch (err) {
      showToast(err.message || 'Failed to simulate burnout', 'error');
    }
  };

  const burnoutMembers = workload.filter(u => u.is_burnout_warning || u.in_progress_count > 5);
  const isBurnoutPresent = burnoutMembers.length > 0;

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        currentProject={currentProject}
        onSelectProject={(proj) => {
          setCurrentProject(proj);
          setPriorityFilter('ALL');
          setAssigneeFilter('ALL');
          setSearchQuery('');
        }}
        onOpenNewProjectModal={() => setIsProjectModalOpen(true)}
        onOpenMembersModal={() => setIsMembersModalOpen(true)}
        onOpenNewTaskModal={() => handleOpenNewTask('TODO')}
        onSimulateBurnout={handleSimulateBurnout}
        isBurnoutPresent={isBurnoutPresent}
        overloadedUserName={burnoutMembers[0]?.name}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        
        {/* Project Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3.5 h-3.5 rounded-full" 
                style={{ backgroundColor: currentProject?.color || '#6366f1' }}
              />
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {currentProject?.name || 'Loading Workspace...'}
              </h1>
            </div>
            {currentProject?.description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {currentProject.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshProjectData()}
              title="Refresh board state"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Vibe Check: Team Workload Balancing Radar */}
        <TeamWorkloadBar
          workload={workload}
          selectedAssignee={assigneeFilter}
          onSelectAssigneeFilter={(userId) => setAssigneeFilter(userId)}
          onAutoRebalance={handleAutoRebalance}
          isRebalancing={isRebalancing}
        />

        {/* Filter Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          members={members}
          onClearFilters={() => {
            setSearchQuery('');
            setPriorityFilter('ALL');
            setAssigneeFilter('ALL');
          }}
        />

        {/* Kanban Board with 3 Columns */}
        <KanbanBoard
          tasks={tasks}
          columnStats={columnStats}
          workload={workload}
          onMoveTask={handleMoveTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleSubtask={handleToggleSubtask}
          onOpenNewTaskModal={handleOpenNewTask}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-8 text-center text-xs text-slate-500">
        <p>Quantiphi TaskFlow • Vibe Coding Assessment • Real-time Kanban & Workload Balancing</p>
      </footer>

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        defaultStatus={defaultColumnStatus}
        members={members}
        projectId={currentProject?.id}
      />

      {/* Project Team & Permissions Modal */}
      <ProjectMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        project={currentProject}
        members={members}
        allUsers={allUsers}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onCreateUser={handleCreateUser}
      />

      {/* New Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Notification Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
