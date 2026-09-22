# FocusFlow
A context-aware task manager: check in your cognitive energy (High / Medium / Low) and FocusFlow surfaces the tasks that actually fit, groups the rest by focus type on a Kanban-style board, and gives you a distraction-free Focus Mode timer to get one thing done.

# Access GitHub through - https://github.com/RanuliSakya/FocusFlow.git

# Technology Stack
- HTML / CSS / JS as the base, built with Vite as a multi-page app (one HTML entry per view)
- Tailwind CSS for all layout/visual styling, driven by design tokens
- Bootstrap used selectively — only its JS behavior (Modal), for the task create/edit and confirm dialogs. No Bootstrap CSS is loaded; the classes its JS toggles are styled with our own Tailwind-based rules instead, so there's one visual system, not two.
- React, mounted only into views/components with real client state (Dashboard check-in, Task Board, Focus Mode timer) — everything else is plain HTML/JS
- No backend — accounts and tasks persist to localStorage

index.html                    Landing view (entry)
src/
  styles/
    tokens.css                 Design tokens: color, type, spacing, radius, shadow, motion (CSS custom properties)
    main.css                   Tailwind directives + tokens import + shared component classes (.btn, .card, .badge, .input, ...)
  views/                        One folder per view, each its own Vite HTML entry
    landing/                    (Landing HTML lives at project root; landing.js is here)
    signin/
    signup/
    dashboard/                  Energy check-in + suggested tasks (React)
    task-board/                 4 focus-type columns + filters + task CRUD (React)
    task-detail/                Single task view (vanilla)
    focus-mode/                 Task picker + countdown timer (React)
    settings/                   Profile, preferences, sign out (vanilla)
  components/
    vanilla/                    Framework-free reusable components (AppShell, Modal, Toast, Badge)
    react/                      Stateful React components (TaskCard, Badge, EnergySelector, FilterBar, TimerWidget)
  data/                         Seed data, loaded into localStorage on first run
  utils/                        auth.js, taskStore.js, taxonomy.js, helpers.js, Bootstrap JS re-export

  # Views
  Landing, Sign In, Sign Up, Dashboard, Task Board, Task Detail, Focus Mode, Settings.

  # Reusable Components
  - AppShell (vanilla) — Sidebar navigation (desktop) + Bottom Navigation (mobile), shared by every authenticated view
  - Badge (vanilla + React) — focus-type and energy-level pills, both reading one shared taxonomy
  - Button — .btn-primary / .btn-secondary / .btn-ghost / .btn-danger utility classes
  - Modal (vanilla, Bootstrap-JS-backed) — task create/edit form, plus a confirm() dialog for deletes
  - EnergySelector (React) — High / Medium / Low check-in control
  - FilterBar (React) — focus-type filter chips for the Task Board
  - TimerWidget (React) — Focus Mode countdown with start/pause/reset and session-length presets
  - TaskCard (React) — title, focus-type + energy badges, due date, complete/edit/delete actions

# Data Model
Every task has a focusType (deep-work / quick-win / collaborative / admin, driving the Task Board columns) and an energyLevel (high / medium / low, driving Dashboard suggestions). Both taxonomies live in src/utils/taxonomy.js so labels and colors can't drift between the vanilla and React views. src/utils/auth.js and src/utils/taskStore.js handle sign up/in/out and per-user task persistence in localStorage.

# Design Token
Defined once in src/styles/tokens.css as CSS custom properties, then mirrored into tailwind.config.js. Primary/Deep Work #7F77DD, Quick Win #1D9E75, Collaborative #EF9F27, Admin #D85A30; neutral scale anchored at #F7F6F3 / #E0DFDA / #888780 / #1A1A1A; radius 8px (inputs/buttons), 10px (cards), 16px (modals); Inter throughout.

