/* ============================================================
   FocusFlow — Timer React Component
   Stateful countdown timer for Focus Mode.
   Depends on: React, ReactDOM, Babel (loaded via CDN)
   Usage: Mount into <div id="timer-root"></div>
   ============================================================ */

const Timer = ({ task, onComplete, onExit }) => {
  const DURATION = 25 * 60; // 25 minutes in seconds

  const [timeLeft,   setTimeLeft]   = React.useState(DURATION);
  const [isRunning,  setIsRunning]  = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const [subtasks,   setSubtasks]   = React.useState(task?.subtasks || []);

  const intervalRef = React.useRef(null);

  // ── Timer logic ──────────────────────────────────────────
  React.useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // ── Format time ──────────────────────────────────────────
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Progress ─────────────────────────────────────────────
  const progress = Math.round(((DURATION - timeLeft) / DURATION) * 100);

  // ── Subtask toggle ────────────────────────────────────────
  const toggleSubtask = (subtaskId) => {
    if (!task) return;
    const updated = FFTasks.toggleSubtask(task.id, subtaskId);
    if (updated) setSubtasks(updated.subtasks);
  };

  const doneCount  = subtasks.filter(s => s.done).length;
  const totalCount = subtasks.length;

  // ── Stroke dash for circle ────────────────────────────────
  const radius      = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDash  = circumference - (progress / 100) * circumference;

  // ── Colour based on time left ─────────────────────────────
  const timerColor = timeLeft <= 60
    ? '#E84040'
    : timeLeft <= 5 * 60
    ? '#EF9F27'
    : '#7F77DD';

  // ── Styles ───────────────────────────────────────────────
  const s = {
    wrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      width: '100%',
    },
    circleWrap: {
      position: 'relative',
      width: '180px',
      height: '180px',
      flexShrink: 0,
    },
    timeText: {
      position: 'absolute',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    },
    controls: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
    },
    btnBase: {
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
  };

  return (
    <div style={s.wrap}>

      {/* Circular timer */}
      <div style={s.circleWrap} role="timer" aria-label={`${formatTime(timeLeft)} remaining`}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="#F7F6F3"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={timerColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
        </svg>
        <div style={s.timeText}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: timeLeft === 0 ? '#E84040' : '#1A1A1A',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{ fontSize: '11px', color: '#888780', marginTop: '4px' }}>
            {isFinished ? 'done!' : 'remaining'}
          </div>
        </div>
      </div>

      {/* Finished message */}
      {isFinished && (
        <div style={{
          background: '#E1F5EE',
          border: '1px solid #1D9E75',
          borderRadius: '10px',
          padding: '12px 20px',
          fontSize: '13px',
          fontWeight: '500',
          color: '#085041',
          textAlign: 'center',
          width: '100%',
        }}>
          <i className="ti ti-confetti" aria-hidden="true"></i> Session complete — great work!
        </div>
      )}

      {/* Controls */}
      <div style={s.controls}>
        {!isFinished ? (
          <>
            <button
              style={{
                ...s.btnBase,
                background: isRunning ? '#FFF5E0' : '#7F77DD',
                color:      isRunning ? '#7A4F00' : '#FFFFFF',
                border:     isRunning ? '1px solid #EF9F27' : 'none',
                minWidth: '100px',
              }}
              onClick={() => setIsRunning(r => !r)}
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            >
              <i className={`ti ${isRunning ? 'ti-player-pause' : 'ti-player-play'}`} aria-hidden="true"></i>
              {isRunning ? 'Pause' : timeLeft === DURATION ? 'Start' : 'Resume'}
            </button>
            <button
              style={{ ...s.btnBase, background: '#F7F6F3', color: '#888780', border: '1px solid #E0DFDA' }}
              onClick={() => { setTimeLeft(DURATION); setIsRunning(false); setIsFinished(false); }}
              aria-label="Reset timer"
            >
              <i className="ti ti-refresh" aria-hidden="true"></i> Reset
            </button>
          </>
        ) : (
          <button
            style={{ ...s.btnBase, background: '#7F77DD', color: '#FFFFFF', minWidth: '140px' }}
            onClick={() => { setTimeLeft(DURATION); setIsRunning(false); setIsFinished(false); }}
          >
            <i className="ti ti-refresh" aria-hidden="true"></i> New session
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#888780',
          marginBottom: '6px',
        }}>
          <span>Session progress</span>
          <span>{progress}%</span>
        </div>
        <div style={{ height: '6px', background: '#E0DFDA', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: timerColor,
            borderRadius: '3px',
            width: `${progress}%`,
            transition: 'width 1s linear, background 0.5s ease',
          }}></div>
        </div>
      </div>

      {/* Subtasks */}
      {totalCount > 0 && (
        <div style={{ width: '100%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Subtasks
            </span>
            <span style={{ fontSize: '11px', color: '#888780' }}>
              {doneCount} of {totalCount} completed
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {subtasks.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: i < subtasks.length - 1 ? '1px solid #E0DFDA' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => toggleSubtask(s.id)}
                role="checkbox"
                aria-checked={s.done}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && toggleSubtask(s.id)}
              >
                <div style={{
                  width: 18, height: 18,
                  borderRadius: 4,
                  border: `1.5px solid ${s.done ? '#7F77DD' : '#E0DFDA'}`,
                  background: s.done ? '#7F77DD' : '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}>
                  {s.done && <i className="ti ti-check" style={{ fontSize: '10px', color: '#fff' }} aria-hidden="true"></i>}
                </div>
                <span style={{
                  fontSize: '13px',
                  color: s.done ? '#888780' : '#1A1A1A',
                  textDecoration: s.done ? 'line-through' : 'none',
                  lineHeight: 1.4,
                }}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mark complete */}
      <button
        style={{
          ...s.btnBase,
          background: '#2DAB72',
          color: '#FFFFFF',
          width: '100%',
          justifyContent: 'center',
          padding: '12px 20px',
          fontSize: '14px',
        }}
        onClick={() => onComplete && onComplete()}
        aria-label="Mark task as complete and return to dashboard"
      >
        <i className="ti ti-circle-check" aria-hidden="true"></i> Mark task as complete
      </button>

    </div>
  );
};
