/* ============================================================
   FocusFlow — TaskBoard React Component
   Kanban-style board with live filtering by focus context.
   Depends on: React, ReactDOM, Babel, FFTasks, FFUtils (loaded)
   Usage: Mount into <div id="taskboard-root"></div>
   ============================================================ */

const TaskBoard = ({ onTaskEdit, onTaskDelete, onTaskFocus, onTaskView, refreshKey }) => {

  const [activeFilter, setActiveFilter] = React.useState('All');
  const [tasks,        setTasks]        = React.useState([]);

  const focusTypes = ['Deep Work', 'Quick Win', 'Collaborative', 'Admin'];

  const colConfig = {
    'Deep Work':     { bg: '#EEEDFE', dot: '#7F77DD', fg: '#3C3489' },
    'Quick Win':     { bg: '#E1F5EE', dot: '#1D9E75', fg: '#085041' },
    'Collaborative': { bg: '#FAEEDA', dot: '#EF9F27', fg: '#633806' },
    'Admin':         { bg: '#FAECE7', dot: '#D85A30', fg: '#712B13' },
  };

  const badgeColors = {
    'Deep Work':     { bg: '#EEEDFE', fg: '#3C3489' },
    'Quick Win':     { bg: '#E1F5EE', fg: '#085041' },
    'Collaborative': { bg: '#FAEEDA', fg: '#633806' },
    'Admin':         { bg: '#FAECE7', fg: '#712B13' },
  };

  const energyColors = {
    'High':   { bg: '#FCE8E8', fg: '#8B1515' },
    'Medium': { bg: '#FFF5E0', fg: '#7A4F00' },
    'Low':    { bg: '#EEF0F8', fg: '#3A4080' },
  };

  // Reload tasks whenever refreshKey changes
  React.useEffect(() => {
    setTasks(FFTasks.getAll());
  }, [refreshKey]);

  const filteredTypes = activeFilter === 'All' ? focusTypes : [activeFilter];

  const getTasksForType = (type) =>
    tasks.filter(t => t.focusType === type && !t.completed);

  const pillStyle = (type) => {
    const isActive = activeFilter === type || (type === 'All' && activeFilter === 'All');
    if (type === 'All') {
      return {
        padding: '5px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        border: 'none',
        fontFamily: 'Inter, sans-serif',
        background: isActive ? '#7F77DD' : '#F7F6F3',
        color:      isActive ? '#FFFFFF' : '#888780',
        transition: 'all 0.15s ease',
      };
    }
    const cfg = colConfig[type];
    return {
      padding: '5px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      border: `1px solid ${isActive ? cfg.dot : '#E0DFDA'}`,
      fontFamily: 'Inter, sans-serif',
      background: isActive ? cfg.bg : '#FFFFFF',
      color:      isActive ? cfg.fg : '#888780',
      transition: 'all 0.15s ease',
    };
  };

  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E0DFDA',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
  };

  const handleDelete = (e, taskId) => {
    e.stopPropagation();
    if (window.confirm('Delete this task? This cannot be undone.')) {
      FFTasks.remove(taskId);
      setTasks(FFTasks.getAll());
      if (onTaskDelete) onTaskDelete(taskId);
    }
  };

  const handleComplete = (e, taskId) => {
    e.stopPropagation();
    FFTasks.markComplete(taskId);
    setTasks(FFTasks.getAll());
    if (onTaskDelete) onTaskDelete(taskId);
  };

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E0DFDA',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#888780', marginRight: '4px' }}>
          Filter:
        </span>
        {['All', ...focusTypes].map(type => (
          <button
            key={type}
            style={pillStyle(type)}
            onClick={() => setActiveFilter(type)}
            aria-pressed={activeFilter === type || (type === 'All' && activeFilter === 'All')}
          >
            {type}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#888780' }}>
          {tasks.filter(t => !t.completed).length} task{tasks.filter(t => !t.completed).length !== 1 ? 's' : ''} remaining
        </span>
      </div>

      {/* Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${filteredTypes.length}, 1fr)`,
        gap: '16px',
        padding: '20px 24px',
      }}>
        {filteredTypes.map(type => {
          const cfg       = colConfig[type];
          const typeTasks = getTasksForType(type);

          return (
            <div key={type}>
              {/* Column header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: cfg.bg,
                borderRadius: '8px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }}></div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A' }}>{type}</span>
                </div>
                <span style={{
                  fontSize: '11px',
                  color: '#888780',
                  background: 'rgba(255,255,255,0.7)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}>
                  {typeTasks.length}
                </span>
              </div>

              {/* Task cards */}
              {typeTasks.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  color: '#888780',
                  fontSize: '12px',
                  border: '1px dashed #E0DFDA',
                  borderRadius: '10px',
                }}>
                  <i className="ti ti-plus" style={{ fontSize: '24px', display: 'block', marginBottom: '6px', color: '#E0DFDA' }} aria-hidden="true"></i>
                  No tasks here
                </div>
              ) : (
                typeTasks.map(task => {
                  const bc = badgeColors[task.focusType]  || { bg: '#F7F6F3', fg: '#888780' };
                  const ec = energyColors[task.energyLevel] || { bg: '#F7F6F3', fg: '#888780' };
                  const due = FFUtils.formatDueDate(task.dueDate);
                  const dueColor = task.dueDate
                    ? (new Date(task.dueDate) < new Date() ? '#E84040' : '#888780')
                    : '#888780';

                  return (
                    <div
                      key={task.id}
                      style={cardStyle}
                      onClick={() => onTaskView && onTaskView(task.id)}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                        e.currentTarget.style.borderColor = '#888780';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#E0DFDA';
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View task: ${task.title}`}
                      onKeyDown={e => e.key === 'Enter' && onTaskView && onTaskView(task.id)}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A1A', lineHeight: 1.4 }}>
                        {task.title}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '500', background: bc.bg, color: bc.fg }}>
                          {task.focusType}
                        </span>
                        <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '500', background: ec.bg, color: ec.fg }}>
                          {task.energyLevel} energy
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: dueColor }}>📅 {due}</div>
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        paddingTop: '8px',
                        borderTop: '1px solid #E0DFDA',
                      }}>
                        <button
                          style={{
                            padding: '5px 10px', borderRadius: '6px', border: 'none',
                            background: '#7F77DD', color: '#fff', fontSize: '11px',
                            fontWeight: '500', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          }}
                          onClick={e => { e.stopPropagation(); onTaskFocus && onTaskFocus(task.id); }}
                          aria-label={`Start focus for ${task.title}`}
                        >
                          ▶ Focus
                        </button>
                        <button
                          style={{
                            padding: '5px 10px', borderRadius: '6px',
                            border: '1px solid #E0DFDA', background: '#F7F6F3',
                            color: '#888780', fontSize: '11px', fontWeight: '500',
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          }}
                          onClick={e => { e.stopPropagation(); onTaskEdit && onTaskEdit(task); }}
                          aria-label={`Edit task: ${task.title}`}
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            padding: '5px 10px', borderRadius: '6px',
                            border: '1px solid #E84040', background: '#FCE8E8',
                            color: '#E84040', fontSize: '11px', fontWeight: '500',
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            marginLeft: 'auto',
                          }}
                          onClick={e => handleDelete(e, task.id)}
                          aria-label={`Delete task: ${task.title}`}
                        >
                          <i className="ti ti-trash" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
