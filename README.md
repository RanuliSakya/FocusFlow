# FocusFlow
A context-aware task manager: check in your cognitive energy (High / Medium / Low) and FocusFlow surfaces the tasks that actually fit, groups the rest by focus type on a Kanban-style board, and gives you a distraction-free Focus Mode timer to get one thing done.

# Technology Stack
HTML / CSS / JS as the base, built with Vite as a multi-page app (one HTML entry per view)
Tailwind CSS for all layout/visual styling, driven by design tokens
Bootstrap used selectively — only its JS behavior (Modal), for the task create/edit and confirm dialogs. No Bootstrap CSS is loaded; the classes its JS toggles are styled with our own Tailwind-based rules instead, so there's one visual system, not two.
React, mounted only into views/components with real client state (Dashboard check-in, Task Board, Focus Mode timer) — everything else is plain HTML/JS
No backend — accounts and tasks persist to localStorage
