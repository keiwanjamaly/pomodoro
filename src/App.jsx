import React, { useEffect, useState } from 'react';
import { usePomodoro } from './hooks/usePomodoro';
import TimerDisplay from './components/TimerDisplay';
import StatusLabel from './components/StatusLabel';
import Timeline from './components/Timeline';
import ProgressBar from './components/ProgressBar';
import GlassCard from './components/GlassCard';
import './index.css';
import './components/Controls.css';

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

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update body background color and theme
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#121212';
      document.documentElement.style.setProperty('--text-color-dynamic', bgColor);
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.05)');
      document.documentElement.style.setProperty('--progress-color', bgColor);
    } else {
      document.body.style.backgroundColor = bgColor;
      document.documentElement.style.setProperty('--text-color-dynamic', '#ffffff');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--progress-color', 'rgba(255, 255, 255, 0.5)');
    }
  }, [bgColor, isDarkMode]);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <div className="controls-container">
        <button
          className="control-button"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button
          className="control-button"
          onClick={toggleSound}
          aria-label={isSoundEnabled ? "Mute sound" : "Enable sound"}
        >
          {isSoundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

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
