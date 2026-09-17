const API_BASE = '/api';

export const api = {
  // Projects
  getProjects: async () => {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    return data.data || [];
  },

  getProject: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    const data = await res.json();
    return data.data;
  },

  createProject: async (payload) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create project');
    return data.data;
  },

  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete project');
    return data;
  },

  // Members
  getMembers: async (projectId) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/members`);
    const data = await res.json();
    return data.data || [];
  },

  addMember: async (projectId, userId, role) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add member');
    return data.data;
  },

  removeMember: async (projectId, userId) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/members/${userId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove member');
    return data;
  },

  // Workload & Auto-Rebalance
  getWorkload: async (projectId) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/workload`);
    const data = await res.json();
    return data.data || [];
  },

  autoRebalance: async (projectId) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/auto-rebalance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to auto-rebalance workload');
    return data;
  },

  // Users
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();
    return data.data || [];
  },

  createUser: async (payload) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create user');
    return data.data;
  },

  // Tasks
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.projectId) params.append('projectId', filters.projectId);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.status) params.append('status', filters.status);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/tasks?${params.toString()}`);
    const data = await res.json();
    return {
      tasks: data.data || [],
      columnStats: data.columnStats || { TODO: 0, IN_PROGRESS: 0, DONE: 0, TOTAL: 0 }
    };
  },

  createTask: async (payload) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create task');
    return data.data;
  },

  updateTask: async (id, payload) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update task');
    return data.data;
  },

  updateTaskStatus: async (id, status, order_index) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, order_index })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update task status');
    return data.data;
  },

  toggleSubtask: async (taskId, subtaskId) => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
      method: 'PATCH'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle subtask');
    return data.data;
  },

  generateSubtasks: async (title) => {
    const res = await fetch(`${API_BASE}/tasks/generate-subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate subtasks');
    return data.subtasks || [];
  },

  deleteTask: async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete task');
    return data;
  },

  simulateBurnout: async (projectId, userId) => {
    const res = await fetch(`${API_BASE}/tasks/simulate-burnout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, userId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to simulate burnout');
    return data;
  }
};
