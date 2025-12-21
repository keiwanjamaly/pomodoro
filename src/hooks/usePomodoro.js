import { useState, useEffect, useRef } from 'react';

const CONFIG = {
    workDuration: 25, // Minutes
    lunchHour: 13,    // 13:00
    lunchDuration: 60, // Minutes
    startHour: 7,      // Timeline Start
    endHour: 24        // Timeline End
};

const generateSessions = () => {
    const newSessions = [];
    for (let h = CONFIG.startHour; h < CONFIG.endHour; h++) {
        if (h === 13) {
            newSessions.push({ startH: 13, startM: 0, duration: 60, type: 'lunch', label: 'Mittagspause' });
        } else {
            newSessions.push({ startH: h, startM: 5, duration: 25, type: 'work', label: 'Fokus' });
            newSessions.push({ startH: h, startM: 35, duration: 25, type: 'work', label: 'Fokus' });
        }
    }
    return newSessions;
};

export const usePomodoro = () => {
    const [timeString, setTimeString] = useState('00:00');
    const [statusLabel, setStatusLabel] = useState('Laden...');
    const [bgColor, setBgColor] = useState('#222');
    const [progress, setProgress] = useState(0);
    const [sessions] = useState(generateSessions);
    const [currentSessionIndex, setCurrentSessionIndex] = useState(-1);
    const [timeOffset, setTimeOffset] = useState(0);
    const [isDebug, setIsDebug] = useState(false);
    const [debugTime, setDebugTime] = useState('');
    const previousStateRef = useRef(null);

    // Check for debug time in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const debugTimeParam = params.get('time');
        if (debugTimeParam) {
            const [h, m] = debugTimeParam.split(':').map(Number);
            if (!isNaN(h) && !isNaN(m)) {
                const now = new Date();
                const targetDate = new Date();
                targetDate.setHours(h, m, 0, 0);
                setTimeOffset(targetDate.getTime() - now.getTime());
                setIsDebug(true);
                setDebugTime(`${h}:${m}`);
            }
        }
    }, []);

    // Update timer logic
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date(Date.now() + timeOffset);
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            // Update Timeline Active State Logic
            const nowMinutes = hours * 60 + minutes;
            let activeIndex = -1;

            // We need to calculate this to pass it to the view, or handle it in the view.
            // In React, we update the state.
            // Let's find the current session index.
            sessions.forEach((session, index) => {
                const sessionStart = session.startH * 60 + session.startM;
                const sessionEnd = sessionStart + session.duration;

                if (nowMinutes >= sessionStart && nowMinutes < sessionEnd) {
                    activeIndex = index;
                }
            });
            setCurrentSessionIndex(activeIndex);


            let state = '';
            let secondsRemaining = 0;
            let totalDurationSeconds = 0;

            const isLunchTime = (hours === CONFIG.lunchHour && minutes < CONFIG.lunchDuration);

            if (isLunchTime) {
                state = 'lunch';
                const endOfLunch = new Date(now);
                endOfLunch.setHours(CONFIG.lunchHour, CONFIG.lunchDuration, 0, 0);
                secondsRemaining = Math.floor((endOfLunch - now) / 1000);
                totalDurationSeconds = CONFIG.lunchDuration * 60;
            } else {
                let startOffset = 5;

                const minuteInBlock = (minutes - startOffset + 60) % 30;
                const secondsInBlock = (minuteInBlock * 60) + seconds;

                if (minuteInBlock < CONFIG.workDuration) {
                    state = 'work';
                    const workSeconds = CONFIG.workDuration * 60;
                    secondsRemaining = workSeconds - secondsInBlock;
                    totalDurationSeconds = workSeconds;
                } else {
                    state = 'break';
                    const cycleSeconds = 30 * 60;
                    secondsRemaining = cycleSeconds - secondsInBlock;
                    totalDurationSeconds = (30 - CONFIG.workDuration) * 60;
                }
            }
            // Sound Logic
            if (previousStateRef.current && previousStateRef.current !== state) {
                const audioPath = `${import.meta.env.BASE_URL}notification.mp3`;
                new Audio(audioPath).play().catch(e => console.error('Error playing sound:', e));
            }
            previousStateRef.current = state;

            // 
            // Render Logic (State Updates)
            const m = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
            const s = (secondsRemaining % 60).toString().padStart(2, '0');
            setTimeString(`${m}:${s}`);

            let label = '';
            let color = '';

            switch (state) {
                case 'lunch':
                    label = 'Mittagspause 🍱';
                    color = 'var(--color-lunch)';
                    break;
                case 'break':
                    label = 'Pause ☕';
                    color = 'var(--color-break)';
                    break;
                case 'work':
                default:
                    label = 'Fokus 🚀';
                    if (activeIndex !== -1) {
                        let workCount = 0;
                        for (let i = 0; i <= activeIndex; i++) {
                            if (sessions[i] && sessions[i].type === 'work') {
                                workCount++;
                            }
                        }
                        const cyclePos = ((workCount - 1) % 4) + 1;
                        label += ` (${cyclePos}/4)`;
                    }
                    color = 'var(--color-focus)';
                    break;
            }

            setStatusLabel(label);
            setBgColor(color);

            // Document title update
            document.title = `${m}:${s} - ${label}`;

            const progressPercent = 100 - ((secondsRemaining / totalDurationSeconds) * 100);
            setProgress(progressPercent);
        };

        const intervalId = setInterval(updateTimer, 1000);
        updateTimer(); // Initial call

        return () => clearInterval(intervalId);
    }, [timeOffset, sessions]);

    return {
        timeString,
        statusLabel,
        bgColor,
        progress,
        sessions,
        currentSessionIndex,
        isDebug,
        debugTime,
        timeOffset // Exposed for timeline calculation if needed
    };
};
