import React, { useEffect } from 'react';
import { usePomodoro } from './hooks/usePomodoro';
import TimerDisplay from './components/TimerDisplay';
import StatusLabel from './components/StatusLabel';
import Timeline from './components/Timeline';
import ProgressBar from './components/ProgressBar';
import GlassCard from './components/GlassCard';
import './index.css';
import './components/SoundToggle.css';

function App() {
  const {
    timeString,
    statusLabel,
    bgColor,
    progress,
    sessions,
    isDebug,
    debugTime,
    timeOffset,
    isSoundEnabled,
    setIsSoundEnabled
  } = usePomodoro();

  // Update body background color
  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);

  const toggleSound = () => {
    if (!isSoundEnabled) {
      // Unlock audio context on user interaction
      const baseUrl = import.meta.env.BASE_URL;
      const audioPath = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}notification.mp3`;
      const audio = new Audio(audioPath);
      audio.volume = 0; // Play silently to unlock
      audio.play().catch(() => { });
    }
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <>
      <button
        className="sound-toggle"
        onClick={toggleSound}
        aria-label={isSoundEnabled ? "Mute sound" : "Enable sound"}
      >
        {isSoundEnabled ? '🔊' : '🔇'}
      </button>

      {isDebug && (
        <div id="debug-badge" className="debug-badge" style={{ display: 'block' }}>
          Sim: {debugTime}
        </div>
      )}

      <main className="timer-container">
        <GlassCard className="timer-card">
          <StatusLabel label={statusLabel} />
          <TimerDisplay time={timeString} />
        </GlassCard>

        <GlassCard className="timeline-card">
          <Timeline sessions={sessions} timeOffset={timeOffset} />
        </GlassCard>
      </main>

      <ProgressBar progress={progress} />
    </>
  );
}

export default App;
