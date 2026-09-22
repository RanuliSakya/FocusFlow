/* ============================================================
   FocusFlow — Task Management
   All task CRUD operations and localStorage management.
   Depends on auth.js being loaded first (uses FF.getCurrentUser).
   ============================================================ */

const FFTasks = {

  // ── Storage key ───────────────────────────────────────────

  _key() {
    const user = FF.getCurrentUser();
    return user ? `ff_tasks_${user.id}` : null;
  },

  // ── Read ───────────────────────────────────────────────────

  getAll() {
    const key = this._key();
    if (!key) return [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
      return this._seedSampleTasks();
    } catch { return []; }
  },

  getById(id) {
    return this.getAll().find(t => t.id === id) || null;
  },

  getByFocusType(focusType) {
    return this.getAll().filter(t => t.focusType === focusType && !t.completed);
  },

  getIncomplete() {
    return this.getAll().filter(t => !t.completed);
  },

  getCompleted() {
    return this.getAll().filter(t => t.completed);
  },

  // ── Write ──────────────────────────────────────────────────

  _save(tasks) {
    const key = this._key();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(tasks));
  },

  add(data) {
    const tasks = this.getAll();
    const task = {
      id:          Date.now().toString(),
      title:       (data.title || '').trim(),
      description: (data.description || '').trim(),
      focusType:   data.focusType   || 'Quick Win',
      energyLevel: data.energyLevel || 'Medium',
      dueDate:     data.dueDate     || null,
      subtasks:    (data.subtasks   || []).map((s, i) => ({
        id: `s_${Date.now()}_${i}`,
        text: typeof s === 'string' ? s : s.text,
        done: false,
      })),
      completed:   false,
      createdAt:   new Date().toISOString(),
    };
    tasks.push(task);
    this._save(tasks);
    return task;
  },

  update(id, changes) {
    const tasks = this.getAll();
    const idx   = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...changes, updatedAt: new Date().toISOString() };
    this._save(tasks);
    return tasks[idx];
  },

  remove(id) {
    const tasks = this.getAll().filter(t => t.id !== id);
    this._save(tasks);
  },

  markComplete(id) {
    return this.update(id, { completed: true, completedAt: new Date().toISOString() });
  },

  markIncomplete(id) {
    return this.update(id, { completed: false, completedAt: null });
  },

  toggleSubtask(taskId, subtaskId) {
    const task = this.getById(taskId);
    if (!task) return null;
    const subtasks = task.subtasks.map(s =>
      s.id === subtaskId ? { ...s, done: !s.done } : s
    );
    return this.update(taskId, { subtasks });
  },

  addSubtask(taskId, text) {
    const task = this.getById(taskId);
    if (!task) return null;
    const subtask = { id: `s_${Date.now()}`, text: text.trim(), done: false };
    return this.update(taskId, { subtasks: [...task.subtasks, subtask] });
  },

  // ── Stats ──────────────────────────────────────────────────

  getStats() {
    const all        = this.getAll();
    const today      = new Date(); today.setHours(0,0,0,0);
    const tomorrow   = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const dueToday   = all.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate); d.setHours(0,0,0,0);
      return d.getTime() === today.getTime();
    });

    const completedToday = all.filter(t => {
      if (!t.completed || !t.completedAt) return false;
      const d = new Date(t.completedAt); d.setHours(0,0,0,0);
      return d.getTime() === today.getTime();
    });

    const thisWeek = all.filter(t => {
      const d = new Date(t.createdAt); d.setHours(0,0,0,0);
      return (today - d) <= 7 * 86400000;
    });
    const completedWeek = thisWeek.filter(t => t.completed);
    const weekPct = thisWeek.length > 0
      ? Math.round((completedWeek.length / thisWeek.length) * 100)
      : 0;

    return {
      total:           all.length,
      incomplete:      all.filter(t => !t.completed).length,
      completed:       all.filter(t => t.completed).length,
      dueToday:        dueToday.length,
      completedToday:  completedToday.length,
      weekCompletion:  weekPct,
      deepWork:        all.filter(t => t.focusType === 'Deep Work'     && !t.completed).length,
      quickWin:        all.filter(t => t.focusType === 'Quick Win'     && !t.completed).length,
      collab:          all.filter(t => t.focusType === 'Collaborative' && !t.completed).length,
      admin:           all.filter(t => t.focusType === 'Admin'         && !t.completed).length,
    };
  },

  // ── Sample data for new users ──────────────────────────────

  _seedSampleTasks() {
    const today    = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 5);
    const fmt = d => d.toISOString().split('T')[0];

    const tasks = [
      {
        id: 't1', title: 'Write Q3 progress report',
        description: 'Compile all Q3 metrics and write a comprehensive progress report for the leadership team. Include KPIs, blockers, and next quarter planning.',
        focusType: 'Deep Work', energyLevel: 'High', dueDate: fmt(tomorrow),
        subtasks: [
          { id: 's1', text: 'Gather Q3 metrics from analytics', done: false },
          { id: 's2', text: 'Write executive summary',          done: false },
          { id: 's3', text: 'Add KPI comparison charts',        done: false },
          { id: 's4', text: 'Send draft to manager for review', done: false },
        ],
        completed: false, createdAt: new Date().toISOString(),
      },
      {
        id: 't2', title: 'Reply to client emails',
        description: 'Respond to all outstanding client queries in the inbox.',
        focusType: 'Quick Win', energyLevel: 'Low', dueDate: fmt(today),
        subtasks: [], completed: false, createdAt: new Date().toISOString(),
      },
      {
        id: 't3', title: 'Team standup preparation',
        description: 'Prepare notes, blockers, and discussion points for the team standup.',
        focusType: 'Collaborative', energyLevel: 'Medium', dueDate: fmt(tomorrow),
        subtasks: [], completed: false, createdAt: new Date().toISOString(),
      },
      {
        id: 't4', title: 'Update project task tracker',
        description: 'Keep the project tracker up to date with latest statuses.',
        focusType: 'Admin', energyLevel: 'Low', dueDate: null,
        subtasks: [], completed: false, createdAt: new Date().toISOString(),
      },
      {
        id: 't5', title: 'Research competitor features',
        description: 'Analyse key competitors and document feature gaps and opportunities.',
        focusType: 'Deep Work', energyLevel: 'High', dueDate: fmt(nextWeek),
        subtasks: [], completed: false, createdAt: new Date().toISOString(),
      },
      {
        id: 't6', title: 'Book meeting room for Friday',
        description: 'Reserve the large conference room for the team retrospective.',
        focusType: 'Quick Win', energyLevel: 'Low', dueDate: fmt(today),
        subtasks: [], completed: false, createdAt: new Date().toISOString(),
      },
      {
        id: 't7', title: 'File expense report',
        description: 'Submit last month\'s expenses through the finance portal.',
        focusType: 'Admin', energyLevel: 'Low', dueDate: fmt(nextWeek),
        subtasks: [], completed: false, createdAt: new Date().toISOString(),
      },
    ];

    this._save(tasks);
    return tasks;
  },
};
