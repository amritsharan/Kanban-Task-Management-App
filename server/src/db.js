const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '../kanban_data.json');

class RelationalDatabase {
  constructor() {
    this.data = {
      users: [],
      projects: [],
      project_members: [],
      tasks: [],
      task_subtasks: []
    };
    this.load();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || [],
          projects: parsed.projects || [],
          project_members: parsed.project_members || [],
          tasks: parsed.tasks || [],
          task_subtasks: parsed.task_subtasks || []
        };
        console.log('✅ Loaded existing relational database file.');
        return;
      } catch (e) {
        console.error('Error reading DB file, resetting to initial seed.', e);
      }
    }
    this.seed();
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to persist database:', e);
    }
  }

  seed() {
    console.log('🌱 Seeding initial relational dataset with projects, team, and tasks...');
    
    this.data.users = [
      { id: 'usr-1', name: 'Alex Rivera', email: 'alex.rivera@quantiphi.com', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Lead Architect', created_at: new Date().toISOString() },
      { id: 'usr-2', name: 'Priya Sharma', email: 'priya.sharma@quantiphi.com', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'Senior ML Engineer', created_at: new Date().toISOString() },
      { id: 'usr-3', name: 'Marcus Chen', email: 'marcus.chen@quantiphi.com', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Frontend Specialist', created_at: new Date().toISOString() },
      { id: 'usr-4', name: 'Elena Rostova', email: 'elena.rostova@quantiphi.com', avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', role: 'DevOps & SRE', created_at: new Date().toISOString() },
      { id: 'usr-5', name: 'David Kim', email: 'david.kim@quantiphi.com', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'QA & Compliance Lead', created_at: new Date().toISOString() }
    ];

    this.data.projects = [
      { id: 'proj-1', name: 'Neural Core v2.0', description: 'Next-gen enterprise deep learning inference pipeline & telemetry', color: '#6366f1', created_at: new Date().toISOString() },
      { id: 'proj-2', name: 'Underwater Sound Analyser', description: 'Real-time acoustic telemetry and bio-sonar classifier', color: '#06b6d4', created_at: new Date().toISOString() }
    ];

    this.data.project_members = [
      { id: 'pm-1', project_id: 'proj-1', user_id: 'usr-1', role: 'Admin', joined_at: new Date().toISOString() },
      { id: 'pm-2', project_id: 'proj-1', user_id: 'usr-2', role: 'Member', joined_at: new Date().toISOString() },
      { id: 'pm-3', project_id: 'proj-1', user_id: 'usr-3', role: 'Member', joined_at: new Date().toISOString() },
      { id: 'pm-4', project_id: 'proj-1', user_id: 'usr-4', role: 'Member', joined_at: new Date().toISOString() },
      { id: 'pm-5', project_id: 'proj-1', user_id: 'usr-5', role: 'Viewer', joined_at: new Date().toISOString() },
      { id: 'pm-6', project_id: 'proj-2', user_id: 'usr-1', role: 'Admin', joined_at: new Date().toISOString() },
      { id: 'pm-7', project_id: 'proj-2', user_id: 'usr-2', role: 'Member', joined_at: new Date().toISOString() }
    ];

    const today = new Date();
    const getOffsetDate = (days) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    this.data.tasks = [
      {
        id: 'task-101',
        project_id: 'proj-1',
        title: 'Design PostgreSQL Relational Schema & Indexes',
        description: 'Implement foreign key constraints, project_members junction, and task ordering indexes for sub-millisecond query latency.',
        status: 'DONE',
        priority: 'HIGH',
        due_date: getOffsetDate(-2),
        assigned_to: 'usr-1',
        subtasks: [
          { id: 'sub-1', title: 'Define tables with foreign keys', completed: true },
          { id: 'sub-2', title: 'Add B-tree indexes for status and priority', completed: true }
        ],
        order_index: 0,
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-102',
        project_id: 'proj-1',
        title: 'Implement JWT Auth & Role-based Access Control',
        description: 'Enforce Admin vs Member vs Viewer permissions across all project CRUD endpoints.',
        status: 'DONE',
        priority: 'MEDIUM',
        due_date: getOffsetDate(-1),
        assigned_to: 'usr-4',
        subtasks: [
          { id: 'sub-3', title: 'Create JWT signing middleware', completed: true },
          { id: 'sub-4', title: 'Attach role guard interceptors', completed: true }
        ],
        order_index: 1,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-103',
        project_id: 'proj-1',
        title: 'Build Drag-and-Drop Column Reordering Engine',
        description: 'Ensure smooth multi-column drag movements with visual drop placeholders and optimistic state updates.',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        due_date: getOffsetDate(1),
        assigned_to: 'usr-3',
        subtasks: [
          { id: 'sub-5', title: 'Set up HTML5 drag event handlers', completed: true },
          { id: 'sub-6', title: 'Add CSS drop zone highlight animations', completed: true },
          { id: 'sub-7', title: 'Optimistic state sync with backend API', completed: false }
        ],
        order_index: 0,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-104',
        project_id: 'proj-1',
        title: 'Workload Balancing & Red Pulse Burnout Alert',
        description: 'Server calculates In-Progress task count per user. Highlight user avatar with pulsating red glow when count > 5.',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        due_date: getOffsetDate(2),
        assigned_to: 'usr-2',
        subtasks: [
          { id: 'sub-8', title: 'Implement workload stats query', completed: true },
          { id: 'sub-9', title: 'Pulsing red CSS animation keyframes', completed: true },
          { id: 'sub-10', title: 'Smart auto-rebalance algorithm', completed: false }
        ],
        order_index: 1,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-105',
        project_id: 'proj-1',
        title: 'API Rate Limiting & Centralized Resilience Middleware',
        description: 'Add token-bucket rate limiter and centralized error handling middleware for REST endpoints.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        due_date: getOffsetDate(3),
        assigned_to: 'usr-2',
        subtasks: [
          { id: 'sub-11', title: 'Token bucket rate-limit filter', completed: false },
          { id: 'sub-12', title: 'Global error interceptor', completed: true }
        ],
        order_index: 2,
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-106',
        project_id: 'proj-1',
        title: 'Audio Feature Extraction Pipeline Benchmark',
        description: 'Benchmark Mel-Spectrogram transforms and streaming FFT latency on Edge nodes.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        due_date: getOffsetDate(3),
        assigned_to: 'usr-2',
        subtasks: [
          { id: 'sub-13', title: 'Benchmark FFT latency on 16kHz audio', completed: false },
          { id: 'sub-14', title: 'Optimize buffer chunking sizes', completed: false }
        ],
        order_index: 3,
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-107',
        project_id: 'proj-1',
        title: 'Real-time Telemetry Sync for Concurrent Sessions',
        description: 'Broadcast task updates across all connected team sessions with optimistic resolution.',
        status: 'TODO',
        priority: 'MEDIUM',
        due_date: getOffsetDate(5),
        assigned_to: 'usr-1',
        subtasks: [],
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-108',
        project_id: 'proj-1',
        title: 'End-to-End Integration Test Suite',
        description: 'Automate verification of task creation, status transitions, and burnout triggers.',
        status: 'TODO',
        priority: 'LOW',
        due_date: getOffsetDate(7),
        assigned_to: 'usr-5',
        subtasks: [],
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task-109',
        project_id: 'proj-1',
        title: 'Multi-Project Export to CSV & JSON format',
        description: 'Allow team leads to export sprint velocity reports with full timestamp audit logs.',
        status: 'TODO',
        priority: 'LOW',
        due_date: getOffsetDate(10),
        assigned_to: 'usr-3',
        subtasks: [],
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    console.log('Seeded database with initial records.');
  }

  // Helper query methods
  getUsers() {
    return [...this.data.users];
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  getProjects() {
    return this.data.projects.map(p => {
      const memberCount = this.data.project_members.filter(pm => pm.project_id === p.id).length;
      const taskCount = this.data.tasks.filter(t => t.project_id === p.id).length;
      return { ...p, member_count: memberCount, task_count: taskCount };
    });
  }

  getProjectById(id) {
    return this.data.projects.find(p => p.id === id);
  }

  createProject(project) {
    this.data.projects.push(project);
    this.save();
    return project;
  }

  deleteProject(id) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.data.project_members = this.data.project_members.filter(pm => pm.project_id !== id);
    this.data.tasks = this.data.tasks.filter(t => t.project_id !== id);
    this.save();
    return true;
  }

  getProjectMembers(projectId) {
    const pms = this.data.project_members.filter(pm => pm.project_id === projectId);
    return pms.map(pm => {
      const user = this.getUserById(pm.user_id) || {};
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        role: pm.role,
        joined_at: pm.joined_at
      };
    });
  }

  addProjectMember(projectId, userId, role = 'Member') {
    const existing = this.data.project_members.find(pm => pm.project_id === projectId && pm.user_id === userId);
    if (existing) {
      throw new Error('User is already a member of this project');
    }
    const pm = {
      id: 'pm-' + Math.random().toString(36).substr(2, 9),
      project_id: projectId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString()
    };
    this.data.project_members.push(pm);
    this.save();
    const user = this.getUserById(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      role: pm.role,
      joined_at: pm.joined_at
    };
  }

  removeProjectMember(projectId, userId) {
    const initialLen = this.data.project_members.length;
    this.data.project_members = this.data.project_members.filter(pm => !(pm.project_id === projectId && pm.user_id === userId));
    if (this.data.project_members.length === initialLen) {
      return false;
    }
    this.save();
    return true;
  }

  getTasks({ projectId, priority, status, assignedTo, search }) {
    let result = this.data.tasks.map(t => {
      const user = t.assigned_to ? this.getUserById(t.assigned_to) : null;
      const project = this.getProjectById(t.project_id);
      return {
        ...t,
        subtasks: t.subtasks || [],
        assignee_name: user ? user.name : null,
        assignee_avatar: user ? user.avatar_url : null,
        assignee_email: user ? user.email : null,
        project_name: project ? project.name : ''
      };
    });

    if (projectId) {
      result = result.filter(t => t.project_id === projectId);
    }
    if (priority && priority !== 'ALL') {
      result = result.filter(t => t.priority.toUpperCase() === priority.toUpperCase());
    }
    if (status && status !== 'ALL') {
      result = result.filter(t => t.status.toUpperCase() === status.toUpperCase());
    }
    if (assignedTo && assignedTo !== 'ALL') {
      result = result.filter(t => t.assigned_to === assignedTo);
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      result = result.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (a.order_index !== b.order_index) return a.order_index - b.order_index;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return result;
  }

  getTaskById(id) {
    const task = this.data.tasks.find(t => t.id === id);
    if (!task) return null;
    const user = task.assigned_to ? this.getUserById(task.assigned_to) : null;
    return {
      ...task,
      subtasks: task.subtasks || [],
      assignee_name: user ? user.name : null,
      assignee_avatar: user ? user.avatar_url : null,
      assignee_email: user ? user.email : null
    };
  }

  createTask(task) {
    if (!task.subtasks) task.subtasks = [];
    this.data.tasks.push(task);
    this.save();
    return this.getTaskById(task.id);
  }

  updateTask(id, updates) {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.tasks[idx] = {
      ...this.data.tasks[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.getTaskById(id);
  }

  deleteTask(id) {
    const initialLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    if (this.data.tasks.length === initialLen) return false;
    this.save();
    return true;
  }

  getColumnCounters(projectId) {
    const tasks = projectId ? this.data.tasks.filter(t => t.project_id === projectId) : this.data.tasks;
    const counts = { TODO: 0, IN_PROGRESS: 0, DONE: 0, TOTAL: tasks.length };
    tasks.forEach(t => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    return counts;
  }

  getWorkload(projectId) {
    const members = this.getProjectMembers(projectId);
    const tasks = this.data.tasks.filter(t => t.project_id === projectId);

    return members.map(m => {
      const userTasks = tasks.filter(t => t.assigned_to === m.id);
      const todo_count = userTasks.filter(t => t.status === 'TODO').length;
      const in_progress_count = userTasks.filter(t => t.status === 'IN_PROGRESS').length;
      const done_count = userTasks.filter(t => t.status === 'DONE').length;
      const is_burnout_warning = in_progress_count > 5;

      return {
        id: m.id,
        name: m.name,
        email: m.email,
        avatar_url: m.avatar_url,
        role: m.role,
        todo_count,
        in_progress_count,
        done_count,
        total_tasks: userTasks.length,
        is_burnout_warning
      };
    }).sort((a, b) => b.in_progress_count - a.in_progress_count);
  }

  // SMART AUTO-REBALANCE ALGORITHM:
  // Redistributes In-Progress tasks from overloaded users (>5 tasks) to underutilized members (<=4 tasks)
  autoRebalanceWorkload(projectId) {
    const workload = this.getWorkload(projectId);
    const overloaded = workload.filter(u => u.in_progress_count > 5);
    if (overloaded.length === 0) {
      return { rebalancedCount: 0, message: 'Workload is already balanced across all team members!' };
    }

    const reassignments = [];
    let availableMembers = workload
      .filter(u => u.in_progress_count < 5 && u.role !== 'Viewer')
      .sort((a, b) => a.in_progress_count - b.in_progress_count);

    if (availableMembers.length === 0) {
      // If all members are busy, include any non-viewer member
      availableMembers = workload.filter(u => u.role !== 'Viewer');
    }

    let memberIndex = 0;
    for (const overloadedUser of overloaded) {
      let excessCount = overloadedUser.in_progress_count - 5; // keep max 5 to clear burnout
      const userInProgressTasks = this.data.tasks.filter(
        t => t.project_id === projectId && t.assigned_to === overloadedUser.id && t.status === 'IN_PROGRESS'
      );

      for (let i = 0; i < excessCount && i < userInProgressTasks.length; i++) {
        const taskToReassign = userInProgressTasks[i];
        const targetMember = availableMembers[memberIndex % availableMembers.length];
        memberIndex++;

        // Update task assignment
        taskToReassign.assigned_to = targetMember.id;
        taskToReassign.updated_at = new Date().toISOString();

        reassignments.push({
          taskId: taskToReassign.id,
          taskTitle: taskToReassign.title,
          fromUserId: overloadedUser.id,
          fromUserName: overloadedUser.name,
          toUserId: targetMember.id,
          toUserName: targetMember.name
        });
      }
    }

    this.save();
    return {
      rebalancedCount: reassignments.length,
      reassignments,
      message: `Successfully rebalanced ${reassignments.length} tasks to restore healthy workload!`
    };
  }
}

const db = new RelationalDatabase();
module.exports = db;
