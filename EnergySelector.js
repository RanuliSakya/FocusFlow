/* ============================================================
   FocusFlow — EnergySelector React Component
   Stateful energy check-in rendered on the Dashboard.
   Depends on: React, ReactDOM, Babel (loaded via CDN)
   Usage: Mount into <div id="energy-selector-root"></div>
   ============================================================ */

const EnergySelector = ({ initialEnergy, onSelect }) => {
  const [selected, setSelected] = React.useState(initialEnergy || null);

  const options = [
    {
      level:   'High',
      emoji:   '⚡',
      label:   'High',
      sub:     'Ready for deep, demanding work',
      bg:      '#FCE8E8',
      fg:      '#8B1515',
      border:  '#8B1515',
    },
    {
      level:   'Medium',
      emoji:   '🔆',
      label:   'Medium',
      sub:     'Good for collaborative or focused tasks',
      bg:      '#FFF5E0',
      fg:      '#7A4F00',
      border:  '#7A4F00',
    },
    {
      level:   'Low',
      emoji:   '🌙',
      label:   'Low',
      sub:     'Best for quick wins and admin tasks',
      bg:      '#EEF0F8',
      fg:      '#3A4080',
      border:  '#3A4080',
    },
  ];

  const handleSelect = (level) => {
    setSelected(level);
    FF.setSessionEnergy(level);
    if (onSelect) onSelect(level);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', marginBottom: '4px' }}>
          How's your energy today?
        </p>
        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>
          We'll surface the right tasks based on how you feel right now.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const isSelected = selected === opt.level;
          return (
            <button
              key={opt.level}
              onClick={() => handleSelect(opt.level)}
              style={{
                flex: '1',
                minWidth: '100px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: isSelected ? `2px solid ${opt.border}` : '1px solid #E0DFDA',
                background: isSelected ? opt.bg : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                outline: 'none',
                boxShadow: isSelected ? `0 0 0 3px ${opt.bg}` : 'none',
              }}
              aria-pressed={isSelected}
              aria-label={`Set energy to ${opt.level}`}
            >
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>{opt.emoji}</div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: isSelected ? opt.fg : '#1A1A1A',
                marginBottom: '2px',
              }}>
                {opt.label}
              </div>
              <div style={{ fontSize: '11px', color: isSelected ? opt.fg : '#888780', lineHeight: 1.4 }}>
                {opt.sub}
              </div>
            </button>
          );
        })}
      </div>
      {selected && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#2DAB72',
          fontWeight: '500',
        }}>
          <i className="ti ti-circle-check" aria-hidden="true"></i>
          Energy set to {selected} — tasks updated below.
        </div>
      )}
    </div>
  );
};
