import { useState, useEffect, useRef, useCallback } from 'react';

const SESSIONS = [
    { startH: 0, startM: 0, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 0, startM: 25, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 0, startM: 30, duration: 30, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 1, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 1, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 1, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 1, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 2, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 2, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 2, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 2, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 3, startM: 0, duration: 30, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 3, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 3, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 4, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 4, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 4, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 4, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 5, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 5, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 5, startM: 30, duration: 30, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 6, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 6, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 6, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 6, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 7, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 7, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 7, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 7, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 8, startM: 0, duration: 30, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 8, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 8, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 9, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 9, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 9, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 9, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 10, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 10, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 10, startM: 30, duration: 30, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 11, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 11, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 11, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 11, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 12, startM: 0, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 12, startM: 5, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 12, startM: 30, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 12, startM: 35, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 13, startM: 0, duration: 60, type: 'lunch', label: 'Mittagspause 🍱' },
    { startH: 14, startM: 0, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 14, startM: 25, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 14, startM: 30, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 14, startM: 55, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 15, startM: 0, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 15, startM: 25, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 15, startM: 30, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 15, startM: 55, duration: 25, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 16, startM: 20, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 16, startM: 45, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 16, startM: 50, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 17, startM: 15, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 17, startM: 20, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 17, startM: 45, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 17, startM: 50, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 18, startM: 15, duration: 25, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 18, startM: 40, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 19, startM: 5, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 19, startM: 10, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 19, startM: 35, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 19, startM: 40, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 20, startM: 5, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 20, startM: 10, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 20, startM: 35, duration: 25, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 21, startM: 0, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 21, startM: 25, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 21, startM: 30, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 21, startM: 55, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 22, startM: 0, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 22, startM: 25, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 22, startM: 30, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 22, startM: 55, duration: 30, type: 'break', label: 'Lange Pause 🧘' },
    { startH: 23, startM: 25, duration: 25, type: 'work', label: 'Fokus 🚀' },
    { startH: 23, startM: 50, duration: 5, type: 'break', label: 'Pause ☕' },
    { startH: 23, startM: 55, duration: 5, type: 'work', label: 'Fokus 🚀' },
];

export const usePomodoro = () => {
    const [timeString, setTimeString] = useState('00:00');
    const [statusLabel, setStatusLabel] = useState('Laden...');
    const [bgColor, setBgColor] = useState('#222');
    const [progress, setProgress] = useState(0);
    const [sessions] = useState(SESSIONS);
    const [currentSessionIndex, setCurrentSessionIndex] = useState(-1);
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const previousStateRef = useRef(null);
    const audioRef = useRef(null);
    const workerRef = useRef(null);
    const isSoundEnabledRef = useRef(isSoundEnabled);

    // Update ref when state changes
    useEffect(() => {
        isSoundEnabledRef.current = isSoundEnabled;
    }, [isSoundEnabled]);

    // Initialize Audio
    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL;
        const audioPath = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}notification.mp3`;
        audioRef.current = new Audio(audioPath);
    }, []);

    const [initialDebugState] = useState(() => {
        if (typeof window === 'undefined') return { offset: 0, isDebug: false, debugTime: '' };
        const params = new URLSearchParams(window.location.search);
        const debugTimeParam = params.get('time');
        if (debugTimeParam) {
            const parts = debugTimeParam.split(':').map(Number);
            if (parts.length >= 2) {
                const [h, m, s = 0] = parts;
                if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                    const now = new Date();
                    const targetDate = new Date();
                    targetDate.setHours(h, m, s, 0);
                    return {
                        offset: targetDate.getTime() - now.getTime(),
                        isDebug: true,
                        debugTime: parts.length === 3 ? `${h}:${m}:${s}` : `${h}:${m}`
                    };
                }
            }
        }
        return { offset: 0, isDebug: false, debugTime: '' };
    });

    const [timeOffset] = useState(initialDebugState.offset);
    const [isDebug] = useState(initialDebugState.isDebug);
    const [debugTime] = useState(initialDebugState.debugTime);

    const toggleSound = useCallback(() => {
        if (!isSoundEnabled) {
            const baseUrl = import.meta.env.BASE_URL;
            const audioPath = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}notification.mp3`;
            const audio = new Audio(audioPath);
            audio.volume = 0;
            audio.play().catch(() => { });
        }
        setIsSoundEnabled(prev => !prev);
    }, [isSoundEnabled]);

    // Update timer logic
    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/timerWorker.js', import.meta.url));

        const updateTimer = () => {
            const now = new Date(Date.now() + timeOffset);
            const hours = now.getHours();
            const minutes = now.getMinutes();

            const nowMinutes = hours * 60 + minutes;

            // Find current session
            let activeIndex = -1;
            let currentSession = null;

            for (let i = 0; i < sessions.length; i++) {
                const s = sessions[i];
                const start = s.startH * 60 + s.startM;
                const end = start + s.duration;
                if (nowMinutes >= start && nowMinutes < end) {
                    activeIndex = i;
                    currentSession = s;
                    break;
                }
            }

            setCurrentSessionIndex(activeIndex);

            let state = '';
            let secondsRemaining = 0;
            let totalDurationSeconds = 0;

            if (currentSession) {
                state = currentSession.type;
                const sessionStartMinutes = currentSession.startH * 60 + currentSession.startM;
                const sessionEndMinutes = sessionStartMinutes + currentSession.duration;

                // Calculate end time object for accurate seconds diff
                const endTime = new Date(now);
                endTime.setHours(0, 0, 0, 0); // Reset to midnight
                // Add minutes to midnight
                endTime.setMinutes(sessionEndMinutes);

                secondsRemaining = Math.floor((endTime - now) / 1000);
                totalDurationSeconds = currentSession.duration * 60;
            } else {
                // Fallback for gaps
                state = 'break';
                secondsRemaining = 0;
                totalDurationSeconds = 1;
            }

            // Sound Logic
            if (previousStateRef.current && previousStateRef.current !== state) {
                if (isSoundEnabledRef.current && audioRef.current) {
                    audioRef.current.play().catch(e => console.error('Error playing sound:', e));
                }
            }
            previousStateRef.current = state;

            // Render Logic
            if (secondsRemaining < 0) secondsRemaining = 0;

            const m = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
            const s = (secondsRemaining % 60).toString().padStart(2, '0');
            setTimeString(`${m}:${s}`);

            let label = '';
            let color = '';

            switch (state) {
                case 'lunch':
                    label = currentSession ? currentSession.label : 'Mittagspause 🍱';
                    color = 'var(--color-lunch)';
                    break;
                case 'break':
                    label = currentSession ? currentSession.label : 'Pause ☕';
                    color = 'var(--color-break)';
                    break;
                case 'work':
                default:
                    label = currentSession ? currentSession.label : 'Fokus 🚀';
                    if (activeIndex !== -1) {
                        let workCount = 0;
                        let sessionGroupStart = 0;
                        for (let j = activeIndex; j >= 0; j--) {
                            if (sessions[j].type === 'lunch' || sessions[j].label.includes('Lange Pause')) {
                                sessionGroupStart = j + 1;
                                break;
                            }
                        }

                        for (let i = sessionGroupStart; i <= activeIndex; i++) {
                            if (sessions[i] && sessions[i].type === 'work') {
                                workCount++;
                            }
                        }
                        const cyclePos = ((workCount - 1) % 4) + 1;
                        if (!label.includes('(')) {
                            label += ` (${cyclePos}/4)`;
                        }
                    }
                    color = 'var(--color-focus)';
                    break;
            }

            setStatusLabel(label);
            setBgColor(color);

            const progressPercent = totalDurationSeconds > 0
                ? 100 - ((secondsRemaining / totalDurationSeconds) * 100)
                : 0;
            setProgress(progressPercent);
        };

        workerRef.current.onmessage = (e) => {
            if (e.data === 'tick') {
                updateTimer();
            }
        };

        workerRef.current.postMessage('start');
        updateTimer();

        return () => {
            workerRef.current.postMessage('stop');
            workerRef.current.terminate();
        };
    }, [timeOffset, sessions]);

    // Document title update
    useEffect(() => {
        document.title = `${timeString} - ${statusLabel}`;
    }, [timeString, statusLabel]);

    return {
        timeString,
        statusLabel,
        bgColor,
        progress,
        sessions,
        currentSessionIndex,
        isDebug,
        debugTime,
        timeOffset,
        isSoundEnabled,
        toggleSound
    };
};
