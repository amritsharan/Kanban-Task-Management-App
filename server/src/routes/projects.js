const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all projects
router.get('/', (req, res) => {
  try {
    const projects = db.getProjects();
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single project
router.get('/:id', (req, res) => {
  try {
    const project = db.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    const members = db.getProjectMembers(req.params.id);
    res.json({ success: true, data: { ...project, members } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE project
router.post('/', (req, res) => {
  try {
    const { name, description, color, creator_id } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Project name is required' });
    }

    const id = 'proj-' + Math.random().toString(36).substr(2, 8);
    const newProject = {
      id,
      name: name.trim(),
      description: description || '',
      color: color || '#6366f1',
      created_at: new Date().toISOString()
    };

    db.createProject(newProject);

    if (creator_id) {
      db.addProjectMember(id, creator_id, 'Admin');
    } else {
      const users = db.getUsers();
      if (users.length > 0) {
        db.addProjectMember(id, users[0].id, 'Admin');
      }
    }

    const result = db.getProjectById(id);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE project
router.delete('/:id', (req, res) => {
  try {
    const success = db.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET members of a project
router.get('/:id/members', (req, res) => {
  try {
    const members = db.getProjectMembers(req.params.id);
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADD user to project
router.post('/:id/members', (req, res) => {
  try {
    const { user_id, role } = req.body;
    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }
    const member = db.addProjectMember(req.params.id, user_id, role || 'Member');
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// REMOVE user from project
router.delete('/:id/members/:userId', (req, res) => {
  try {
    const success = db.removeProjectMember(req.params.id, req.params.userId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Member not found in project' });
    }
    res.json({ success: true, message: 'Member removed from project' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// WORKLOAD BALANCING
router.get('/:id/workload', (req, res) => {
  try {
    const workload = db.getWorkload(req.params.id);
    res.json({ success: true, data: workload });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SMART AUTO-REBALANCE
router.post('/:id/auto-rebalance', (req, res) => {
  try {
    const result = db.autoRebalanceWorkload(req.params.id);
    const updatedWorkload = db.getWorkload(req.params.id);
    res.json({
      success: true,
      ...result,
      workload: updatedWorkload
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ANALYTICS & VELOCITY METRICS
router.get('/:id/analytics', (req, res) => {
  try {
    const analytics = db.getProjectAnalytics(req.params.id);
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// EXPORT TO CSV OR JSON
router.get('/:id/export', (req, res) => {
  try {
    const format = (req.query.format || 'json').toLowerCase();
    const tasks = db.getTasks({ projectId: req.params.id });
    const project = db.getProjectById(req.params.id);

    if (format === 'csv') {
      const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Assignee', 'Subtasks Total', 'Subtasks Done', 'Created At'];
      const rows = tasks.map(t => [
        `"${t.id}"`,
        `"${(t.title || '').replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        `"${t.status}"`,
        `"${t.priority}"`,
        `"${t.due_date || ''}"`,
        `"${t.assignee_name || 'Unassigned'}"`,
        (t.subtasks || []).length,
        (t.subtasks || []).filter(s => s.completed).length,
        `"${t.created_at}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${project?.name || 'kanban'}-export.csv"`);
      return res.send(csvContent);
    }

    // Default JSON export
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${project?.name || 'kanban'}-export.json"`);
    res.json({
      project,
      exportedAt: new Date().toISOString(),
      taskCount: tasks.length,
      tasks
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
