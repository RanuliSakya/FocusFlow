/* ============================================================
   FocusFlow — TaskModal React Component
   Add / Edit task modal using Bootstrap modal + React state.
   Depends on: React, ReactDOM, Babel, Bootstrap (CDN)
   Usage: Mount into <div id="task-modal-root"></div>
   ============================================================ */

const TaskModal = ({ editTask, onSave, onClose }) => {
  const isEdit = !!editTask;

  const [form, setForm] = React.useState({
    title:       editTask?.title       || '',
    description: editTask?.description || '',
    focusType:   editTask?.focusType   || 'Quick Win',
    energyLevel: editTask?.energyLevel || 'Medium',
    dueDate:     editTask?.dueDate     || '',
  });
  const [errors, setErrors] = React.useState({});

  const focusTypes   = ['Deep Work', 'Quick Win', 'Collaborative', 'Admin'];
  const energyLevels = ['High', 'Medium', 'Low'];

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())       errs.title     = 'Task title is required.';
    if (!form.focusType)          errs.focusType  = 'Please select a focus type.';
    if (!form.energyLevel)        errs.energyLevel= 'Please select an energy level.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const taskData = {
      title:       form.title.trim(),
      description: form.description.trim(),
      focusType:   form.focusType,
      energyLevel: form.energyLevel,
      dueDate:     form.dueDate || null,
    };

    if (isEdit) {
      FFTasks.update(editTask.id, taskData);
    } else {
      FFTasks.add(taskData);
    }

    if (onSave) onSave();
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${errors[field] ? '#E84040' : '#1A1A1A'}`,
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    color: '#1A1A1A',
    background: errors[field] ? '#FCE8E8' : '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: '6px',
  };

  const errorStyle = {
    fontSize: '11px',
    color: '#E84040',
    marginTop: '4px',
  };

  const focusBadgeColors = {
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

  return (
    <div
      className="modal fade"
      id="taskModal"
      tabIndex="-1"
      aria-labelledby="taskModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: '16px', border: '1px solid #E0DFDA', overflow: 'hidden' }}>

          {/* Header */}
          <div className="modal-header" style={{ borderBottom: '1px solid #E0DFDA', padding: '20px 24px' }}>
            <h2
              id="taskModalLabel"
              style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}
            >
              {isEdit ? 'Edit task' : 'Add new task'}
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
              style={{ fontSize: '12px' }}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body" style={{ padding: '24px' }}>
            <form id="taskForm" onSubmit={handleSubmit} noValidate>

              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle} htmlFor="taskTitle">
                  Task title <span style={{ color: '#E84040' }}>*</span>
                </label>
                <input
                  style={inputStyle('title')}
                  type="text"
                  id="taskTitle"
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  maxLength={100}
                  autoFocus
                />
                {errors.title && <div style={errorStyle}>{errors.title}</div>}
              </div>

              {/* Description */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle} htmlFor="taskDesc">Description</label>
                <textarea
                  style={{ ...inputStyle('description'), minHeight: '72px', resize: 'vertical' }}
                  id="taskDesc"
                  placeholder="Add more context or notes..."
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  maxLength={500}
                />
              </div>

              {/* Focus type + Energy level row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>

                {/* Focus type */}
                <div>
                  <label style={labelStyle} htmlFor="taskFocusType">
                    Focus type <span style={{ color: '#E84040' }}>*</span>
                  </label>
                  <select
                    style={inputStyle('focusType')}
                    id="taskFocusType"
                    value={form.focusType}
                    onChange={e => handleChange('focusType', e.target.value)}
                  >
                    {focusTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.focusType && <div style={errorStyle}>{errors.focusType}</div>}
                  {form.focusType && (
                    <span style={{
                      display: 'inline-flex',
                      marginTop: '6px',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: focusBadgeColors[form.focusType]?.bg,
                      color:      focusBadgeColors[form.focusType]?.fg,
                    }}>
                      {form.focusType}
                    </span>
                  )}
                </div>

                {/* Energy level */}
                <div>
                  <label style={labelStyle} htmlFor="taskEnergy">
                    Energy level <span style={{ color: '#E84040' }}>*</span>
                  </label>
                  <select
                    style={inputStyle('energyLevel')}
                    id="taskEnergy"
                    value={form.energyLevel}
                    onChange={e => handleChange('energyLevel', e.target.value)}
                  >
                    {energyLevels.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  {errors.energyLevel && <div style={errorStyle}>{errors.energyLevel}</div>}
                  {form.energyLevel && (
                    <span style={{
                      display: 'inline-flex',
                      marginTop: '6px',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: energyColors[form.energyLevel]?.bg,
                      color:      energyColors[form.energyLevel]?.fg,
                    }}>
                      {form.energyLevel} energy
                    </span>
                  )}
                </div>
              </div>

              {/* Due date */}
              <div style={{ marginBottom: '8px' }}>
                <label style={labelStyle} htmlFor="taskDueDate">Due date <span style={{ color: '#888780', fontWeight: '400' }}>(optional)</span></label>
                <input
                  style={inputStyle('dueDate')}
                  type="date"
                  id="taskDueDate"
                  value={form.dueDate}
                  onChange={e => handleChange('dueDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ borderTop: '1px solid #E0DFDA', padding: '16px 24px', gap: '10px' }}>
            <button
              type="button"
              data-bs-dismiss="modal"
              onClick={onClose}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: '1px solid #E0DFDA',
                background: '#F7F6F3',
                fontSize: '13px',
                fontWeight: '500',
                color: '#888780',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="taskForm"
              style={{
                padding: '9px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#7F77DD',
                fontSize: '13px',
                fontWeight: '500',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {isEdit ? 'Save changes' : 'Add task'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
