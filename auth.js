/* ============================================================
   FocusFlow — Auth & Storage Utilities
   Handles user auth and localStorage data management.
   ============================================================ */

const FF = {

  // ── Auth ───────────────────────────────────────────────────

  getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('ff_user')) || null; }
    catch { return null; }
  },

  setCurrentUser(user) {
    localStorage.setItem('ff_user', JSON.stringify(user));
  },

  signOut() {
    localStorage.removeItem('ff_user');
    localStorage.removeItem('ff_session_energy');
    window.location.href = 'index.html';
  },

  requireAuth() {
    if (!this.getCurrentUser()) {
      window.location.href = 'signin.html';
      return false;
    }
    return true;
  },

  redirectIfAuthed() {
    if (this.getCurrentUser()) {
      window.location.href = 'dashboard.html';
    }
  },

  signUp(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const user = { id: Date.now().toString(), name, email, password, createdAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem('ff_users', JSON.stringify(users));
    this.setCurrentUser({ id: user.id, name: user.name, email: user.email });
    return { success: true };
  },

  signIn(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Incorrect email or password.' };
    this.setCurrentUser({ id: user.id, name: user.name, email: user.email });
    return { success: true };
  },

  getUsers() {
    try { return JSON.parse(localStorage.getItem('ff_users')) || []; }
    catch { return []; }
  },

  // ── Tasks ──────────────────────────────────────────────────

  getTasks() {
    const user = this.getCurrentUser();
    if (!user) return [];
    try { return JSON.parse(localStorage.getItem(`ff_tasks_${user.id}`)) || this.getSampleTasks(user.id); }
    catch { return []; }
  },

  saveTasks(tasks) {
    const user = this.getCurrentUser();
    if (!user) return;
    localStorage.setItem(`ff_tasks_${user.id}`, JSON.stringify(tasks));
  },

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      description: task.description || '',
      focusType: task.focusType,
      energyLevel: task.energyLevel,
      dueDate: task.dueDate || null,
      subtasks: task.subtasks || [],
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  updateTask(id, updates) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates };
    this.saveTasks(tasks);
    return tasks[idx];
  },

  deleteTask(id) {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  },

  getTaskById(id) {
    return this.getTasks().find(t => t.id === id) || null;
  },

  // ── Session energy ─────────────────────────────────────────

  getSessionEnergy() {
    return localStorage.getItem('ff_session_energy') || null;
  },

  setSessionEnergy(level) {
    localStorage.setItem('ff_session_energy', level);
  },

  // ── Settings ───────────────────────────────────────────────

  getSettings() {
    const user = this.getCurrentUser();
    if (!user) return this.defaultSettings();
    try {
      return JSON.parse(localStorage.getItem(`ff_settings_${user.id}`)) || this.defaultSettings();
    } catch { return this.defaultSettings(); }
  },

  saveSettings(settings) {
    const user = this.getCurrentUser();
    if (!user) return;
    localStorage.setItem(`ff_settings_${user.id}`, JSON.stringify(settings));
  },

  defaultSettings() {
    return {
      defaultEnergy: 'Medium',
      resetEnergyDaily: true,
      contextLabels: {
        deepWork:     'Deep Work',
        quickWin:     'Quick Win',
        collaborative:'Collaborative',
        admin:        'Admin'
      }
    };
  },

  // ── Sample tasks for new users ─────────────────────────────

  getSampleTasks(userId) {
    const tasks = [
      { id:'t1', title:'Write Q3 progress report',    description:'Compile all Q3 metrics and write a comprehensive report.', focusType:'Deep Work',     energyLevel:'High',   dueDate:'2026-09-23', subtasks:[{id:'s1',text:'Gather Q3 metrics',done:false},{id:'s2',text:'Write executive summary',done:false}], completed:false, createdAt:new Date().toISOString() },
      { id:'t2', title:'Reply to client emails',       description:'Respond to outstanding client queries.',                   focusType:'Quick Win',     energyLevel:'Low',    dueDate:'2026-09-22', subtasks:[], completed:false, createdAt:new Date().toISOString() },
      { id:'t3', title:'Team standup preparation',     description:'Prepare notes and blockers for the team standup.',        focusType:'Collaborative', energyLevel:'Medium', dueDate:'2026-09-23', subtasks:[], completed:false, createdAt:new Date().toISOString() },
      { id:'t4', title:'Update project task tracker',  description:'Keep the project tracker up to date.',                    focusType:'Admin',         energyLevel:'Low',    dueDate:null,         subtasks:[], completed:false, createdAt:new Date().toISOString() },
      { id:'t5', title:'Research competitor features', description:'Analyse key competitors and document findings.',          focusType:'Deep Work',     energyLevel:'High',   dueDate:'2026-09-25', subtasks:[], completed:false, createdAt:new Date().toISOString() },
      { id:'t6', title:'Book meeting room for Friday', description:'Reserve the large conference room.',                      focusType:'Quick Win',     energyLevel:'Low',    dueDate:'2026-09-22', subtasks:[], completed:false, createdAt:new Date().toISOString() },
    ];
    localStorage.setItem(`ff_tasks_${userId}`, JSON.stringify(tasks));
    return tasks;
  },

  // ── Helpers ────────────────────────────────────────────────

  getFocusTypeClass(focusType) {
    const map = {
      'Deep Work':     'deep-work',
      'Quick Win':     'quick-win',
      'Collaborative': 'collab',
      'Admin':         'admin'
    };
    return map[focusType] || 'admin';
  },

  getEnergyClass(energyLevel) {
    const map = { 'High':'high', 'Medium':'med', 'Low':'low' };
    return map[energyLevel] || 'low';
  },

  formatDueDate(dateStr) {
    if (!dateStr) return 'No due date';
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
    const dueDay = new Date(due); dueDay.setHours(0,0,0,0);
    if (dueDay.getTime() === today.getTime()) return 'Due today';
    if (dueDay.getTime() === tomorrow.getTime()) return 'Due tomorrow';
    if (dueDay < today) return 'Overdue';
    return `Due ${due.toLocaleDateString('en-GB', { day:'numeric', month:'short' })}`;
  },

  suggestTasks(tasks, energy) {
    if (!energy) return tasks.filter(t => !t.completed).slice(0, 4);
    const energyMap = {
      'High':   ['Deep Work', 'Collaborative'],
      'Medium': ['Quick Win', 'Collaborative', 'Deep Work'],
      'Low':    ['Quick Win', 'Admin']
    };
    const preferred = energyMap[energy] || [];
    const suggested = tasks.filter(t => !t.completed && preferred.includes(t.focusType));
    const rest = tasks.filter(t => !t.completed && !preferred.includes(t.focusType));
    return [...suggested, ...rest].slice(0, 4);
  },

  // Populate sidebar user info
  populateSidebar() {
    const user = this.getCurrentUser();
    if (!user) return;
    const initials = user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    document.querySelectorAll('.js-user-name').forEach(el => el.textContent = user.name);
    document.querySelectorAll('.js-user-initials').forEach(el => el.textContent = initials);
    document.querySelectorAll('.js-signout').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); FF.signOut(); });
    });
  },

  showError(inputEl, msgEl, message) {
    inputEl.classList.add('error');
    if (msgEl) { msgEl.textContent = message; msgEl.style.display = 'block'; }
  },

  clearError(inputEl, msgEl) {
    inputEl.classList.remove('error');
    if (msgEl) { msgEl.style.display = 'none'; }
  }
};
