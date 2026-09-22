/* ============================================================
   FocusFlow — Utility Functions
   Shared helpers used across all pages.
   ============================================================ */

const FFUtils = {

  // ── Badge class mapping ────────────────────────────────────

  focusTypeClass(focusType) {
    const map = {
      'Deep Work':     'ff-badge-deep-work',
      'Quick Win':     'ff-badge-quick-win',
      'Collaborative': 'ff-badge-collab',
      'Admin':         'ff-badge-admin',
    };
    return map[focusType] || 'ff-badge-neutral';
  },

  energyClass(energyLevel) {
    const map = { 'High': 'ff-badge-high', 'Medium': 'ff-badge-med', 'Low': 'ff-badge-low' };
    return map[energyLevel] || 'ff-badge-neutral';
  },

  focusTypeFilterClass(focusType) {
    const map = {
      'Deep Work':     'active-deep',
      'Quick Win':     'active-quick',
      'Collaborative': 'active-collab',
      'Admin':         'active-admin',
    };
    return map[focusType] || '';
  },

  colHeaderStyle(focusType) {
    const map = {
      'Deep Work':     { bg:'#EEEDFE', dot:'#7F77DD' },
      'Quick Win':     { bg:'#E1F5EE', dot:'#1D9E75' },
      'Collaborative': { bg:'#FAEEDA', dot:'#EF9F27' },
      'Admin':         { bg:'#FAECE7', dot:'#D85A30' },
    };
    return map[focusType] || { bg:'#F7F6F3', dot:'#888780' };
  },

  // ── Date formatting ────────────────────────────────────────

  formatDueDate(dateStr) {
    if (!dateStr) return 'No due date';
    const due   = new Date(dateStr);
    const today = new Date(); today.setHours(0,0,0,0);
    const tmrw  = new Date(today); tmrw.setDate(today.getDate() + 1);
    const dueD  = new Date(due);   dueD.setHours(0,0,0,0);
    if (dueD.getTime() === today.getTime()) return 'Due today';
    if (dueD.getTime() === tmrw.getTime())  return 'Due tomorrow';
    if (dueD < today) return 'Overdue';
    const diff = Math.round((dueD - today) / 86400000);
    if (diff <= 7) return `Due in ${diff} day${diff > 1 ? 's' : ''}`;
    return `Due ${due.toLocaleDateString('en-GB', { day:'numeric', month:'short' })}`;
  },

  dueDateColor(dateStr) {
    if (!dateStr) return '';
    const due   = new Date(dateStr);
    const today = new Date(); today.setHours(0,0,0,0);
    const dueD  = new Date(due); dueD.setHours(0,0,0,0);
    if (dueD < today) return 'color: var(--color-error);';
    if (dueD.getTime() === today.getTime()) return 'color: var(--color-error);';
    return '';
  },

  formatGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  },

  formatDate(date = new Date()) {
    return date.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  },

  // ── DOM helpers ────────────────────────────────────────────

  el(selector, parent = document) {
    return parent.querySelector(selector);
  },

  els(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  },

  create(tag, classes = [], attrs = {}) {
    const el = document.createElement(tag);
    if (classes.length) el.classList.add(...classes);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  },

  on(selector, event, handler, parent = document) {
    const el = typeof selector === 'string' ? parent.querySelector(selector) : selector;
    if (el) el.addEventListener(event, handler);
  },

  show(el) { if (el) el.style.display = ''; },
  hide(el) { if (el) el.style.display = 'none'; },

  // ── Toast notifications ────────────────────────────────────

  toast(message, type = 'default', duration = 3000) {
    let container = document.querySelector('.ff-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'ff-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `ff-toast${type !== 'default' ? ' ' + type : ''}`;
    const iconMap = { success: 'ti-circle-check', error: 'ti-circle-x', default: 'ti-info-circle' };
    toast.innerHTML = `<i class="ti ${iconMap[type] || iconMap.default}" aria-hidden="true"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  },

  // ── Task card HTML builder ─────────────────────────────────

  buildTaskCardHTML(task, showFocusBtn = true) {
    const due      = this.formatDueDate(task.dueDate);
    const dueColor = this.dueDateColor(task.dueDate);
    const typeClass    = this.focusTypeClass(task.focusType);
    const energyClass  = this.energyClass(task.energyLevel);
    return `
      <div class="ff-task-card ff-slide-up" data-task-id="${task.id}">
        <div class="ff-task-card-title">${this.escapeHTML(task.title)}</div>
        <div class="ff-task-card-badges">
          <span class="ff-badge ${typeClass}">${task.focusType}</span>
          <span class="ff-badge ${energyClass}">${task.energyLevel} energy</span>
        </div>
        <div class="ff-task-card-due" style="${dueColor}">📅 ${due}</div>
        <div class="ff-task-card-actions">
          ${showFocusBtn ? `<button class="ff-btn ff-btn-primary ff-btn-sm js-start-focus" data-task-id="${task.id}">
            <i class="ti ti-player-play" aria-hidden="true"></i> Start focus
          </button>` : ''}
          <button class="ff-btn ff-btn-ghost ff-btn-sm js-view-task" data-task-id="${task.id}">
            View
          </button>
        </div>
      </div>`;
  },

  // ── Badge HTML builder ─────────────────────────────────────

  buildBadge(text, cssClass) {
    return `<span class="ff-badge ${cssClass}">${this.escapeHTML(text)}</span>`;
  },

  // ── Security ───────────────────────────────────────────────

  escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  },

  // ── Sidebar population ─────────────────────────────────────

  populateSidebar(activeNav) {
    const user = FF.getCurrentUser();
    if (!user) return;
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    document.querySelectorAll('.js-user-initials').forEach(el => el.textContent = initials);
    document.querySelectorAll('.js-user-name').forEach(el => el.textContent = user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1]?.[0] || '') + '.'.trim());
    document.querySelectorAll('.js-signout').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); FF.signOut(); });
    });
    if (activeNav) {
      document.querySelectorAll('.ff-nav-item').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.nav === activeNav) el.classList.add('active');
      });
    }
  },

  // ── Task navigation helpers ────────────────────────────────

  goToTask(taskId) {
    sessionStorage.setItem('ff_current_task', taskId);
    window.location.href = 'taskdetail.html';
  },

  goToFocus(taskId) {
    sessionStorage.setItem('ff_focus_task', taskId);
    window.location.href = 'focusmode.html';
  },

  getCurrentTaskId() {
    return sessionStorage.getItem('ff_current_task');
  },

  getFocusTaskId() {
    return sessionStorage.getItem('ff_focus_task');
  },

  // ── Local task suggestion ──────────────────────────────────

  suggestTasks(tasks, energy) {
    const incomplete = tasks.filter(t => !t.completed);
    if (!energy) return incomplete.slice(0, 4);
    const energyMap = {
      'High':   ['Deep Work', 'Collaborative'],
      'Medium': ['Quick Win', 'Collaborative', 'Deep Work'],
      'Low':    ['Quick Win', 'Admin'],
    };
    const preferred = energyMap[energy] || [];
    const suggested = incomplete.filter(t => preferred.includes(t.focusType));
    const rest      = incomplete.filter(t => !preferred.includes(t.focusType));
    return [...suggested, ...rest].slice(0, 4);
  },
};
