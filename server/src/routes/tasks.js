const express = require('express');
const router = express.Router();
const db = require('../db');

// GET tasks with filtering (projectId, priority, status, assignedTo, search)
router.get('/', (req, res) => {
  try {
    const { projectId, priority, status, assignedTo, search } = req.query;
    const tasks = db.getTasks({ projectId, priority, status, assignedTo, search });
    const columnStats = db.getColumnCounters(projectId);

    res.json({
      success: true,
      data: tasks,
      columnStats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single task
router.get('/:id', (req, res) => {
  try {
    const task = db.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE task
router.post('/', (req, res) => {
  try {
    const { project_id, title, description, priority, due_date, assigned_to, status, subtasks } = req.body;

    if (!project_id) {
      return res.status(400).json({ success: false, error: 'project_id is required' });
    }
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Task title is required' });
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const taskPriority = (priority && validPriorities.includes(priority.toUpperCase())) ? priority.toUpperCase() : 'MEDIUM';

    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    const taskStatus = (status && validStatuses.includes(status.toUpperCase())) ? status.toUpperCase() : 'TODO';

    const id = 'task-' + Math.random().toString(36).substr(2, 9);
    const newTask = {
      id,
      project_id,
      title: title.trim(),
      description: description || '',
      status: taskStatus,
      priority: taskPriority,
      due_date: due_date || null,
      assigned_to: assigned_to || null,
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      order_index: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const created = db.createTask(newTask);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE entire task
router.put('/:id', (req, res) => {
  try {
    const { title, description, priority, due_date, assigned_to, status, subtasks } = req.body;
    const task = db.getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const taskPriority = (priority && validPriorities.includes(priority.toUpperCase())) ? priority.toUpperCase() : task.priority;

    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    const taskStatus = (status && validStatuses.includes(status.toUpperCase())) ? status.toUpperCase() : task.status;

    const updated = db.updateTask(req.params.id, {
      title: title !== undefined ? title.trim() : task.title,
      description: description !== undefined ? description : task.description,
      priority: taskPriority,
      due_date: due_date !== undefined ? due_date : task.due_date,
      assigned_to: assigned_to !== undefined ? (assigned_to === '' ? null : assigned_to) : task.assigned_to,
      status: taskStatus,
      subtasks: subtasks !== undefined ? subtasks : task.subtasks
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// TOGGLE SUBTASK COMPLETED STATUS
router.patch('/:id/subtasks/:subtaskId/toggle', (req, res) => {
  try {
    const task = db.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    const subtasks = (task.subtasks || []).map(s => {
      if (s.id === req.params.subtaskId) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });

    const updated = db.updateTask(req.params.id, { subtasks });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SMART AI SUBTASK GENERATOR
router.post('/generate-subtasks', (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const t = title.toLowerCase();
    let generated = [];

    if (t.includes('auth') || t.includes('jwt') || t.includes('login') || t.includes('user')) {
      generated = [
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Design token payload & signature schema', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Implement password hashing & validation middleware', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Set up refresh token rotation & cookie storage', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Write integration test for expired token edge cases', completed: false }
      ];
    } else if (t.includes('sql') || t.includes('database') || t.includes('postgres') || t.includes('schema')) {
      generated = [
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Draft ERD and foreign key constraints', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Define composite indexes for status & priority filtering', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Create automated migration script with rollback support', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Benchmark query performance with explain analyze', completed: false }
      ];
    } else if (t.includes('audio') || t.includes('sound') || t.includes('sonar') || t.includes('feature')) {
      generated = [
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Configure 16kHz sampling and STFT window buffer', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Implement Mel-spectrogram filterbank extraction', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Quantize neural embedding output to float16 vectors', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Profile inference throughput on streaming telemetry', completed: false }
      ];
    } else if (t.includes('drag') || t.includes('ui') || t.includes('component') || t.includes('front')) {
      generated = [
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Construct glassmorphic card container with Tailwind tokens', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Attach drag-over drop target listeners with visual pulse', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Implement optimistic local UI update on card release', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Test responsive touch behavior across mobile & desktop', completed: false }
      ];
    } else {
      generated = [
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: `Analyze technical requirements for "${title}"`, completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Implement core functionality and exception boundaries', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Add unit tests and performance benchmarks', completed: false },
        { id: 'sub-' + Math.random().toString(36).substr(2, 6), title: 'Conduct peer review and deploy to staging', completed: false }
      ];
    }

    res.json({ success: true, subtasks: generated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH status and/or order (Drag-and-Drop)
router.patch('/:id/status', (req, res) => {
  try {
    const { status, order_index } = req.body;
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];

    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be TODO, IN_PROGRESS, or DONE' });
    }

    const task = db.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const updated = db.updateTask(req.params.id, {
      status: status.toUpperCase(),
      order_index: typeof order_index === 'number' ? order_index : task.order_index
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE task
router.delete('/:id', (req, res) => {
  try {
    const success = db.deleteTask(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SIMULATE / DEMO BURNOUT: Add 6 In-Progress tasks to a user to showcase the >5 red pulse burnout warning
router.post('/simulate-burnout', (req, res) => {
  try {
    const { projectId, userId } = req.body;
    if (!projectId || !userId) {
      return res.status(400).json({ success: false, error: 'projectId and userId are required' });
    }

    const sampleTasks = [
      'Refactor high-throughput message streaming buffer',
      'Resolve race condition in worker event queue',
      'Optimize web socket telemetry compression',
      'Implement real-time spectrogram latency benchmarking',
      'Fix thread deadlock during audio packet deserialization',
      'Deploy mission-critical security patch to Edge node cluster'
    ];

    sampleTasks.forEach((title, idx) => {
      const id = 'task-sim-' + Math.random().toString(36).substr(2, 7);
      db.createTask({
        id,
        project_id: projectId,
        title,
        description: 'Auto-generated workload spike task demonstrating the Workload Balancing & Red Burnout Pulse alert system.',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        due_date: new Date(Date.now() + 86400000 * (idx + 1)).toISOString().split('T')[0],
        assigned_to: userId,
        subtasks: [
          { id: 'sub-sim-' + idx + '-1', title: 'Isolate bottlenecks and benchmark thread pool', completed: false },
          { id: 'sub-sim-' + idx + '-2', title: 'Verify zero packet loss on high packet rates', completed: false }
        ],
        order_index: idx,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });

    res.json({ success: true, message: `Successfully simulated burnout condition! 6 in-progress tasks assigned to user ${userId}.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
