import React, { useEffect } from 'react';
import { usePomodoro } from './hooks/usePomodoro';
import TimerDisplay from './components/TimerDisplay';
import StatusLabel from './components/StatusLabel';
import Timeline from './components/Timeline';
import ProgressBar from './components/ProgressBar';
import './index.css';

function App() {
  const {
    timeString,
    statusLabel,
    bgColor,
    progress,
    sessions,
    isDebug,
    debugTime,
    timeOffset
  } = usePomodoro();

  // Update body background color
  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);

  return (
    <>
      {isDebug && (
        <div id="debug-badge" className="debug-badge" style={{ display: 'block' }}>
          Sim: {debugTime}
        </div>
      )}

      <main className="timer-container">
        <TimerDisplay time={timeString} />
        <StatusLabel label={statusLabel} />
        <Timeline sessions={sessions} timeOffset={timeOffset} />
      </main>

      <ProgressBar progress={progress} />
    </>
  );
}

export default App;
