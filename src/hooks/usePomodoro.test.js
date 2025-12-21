import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePomodoro } from './usePomodoro';

describe('usePomodoro', () => {
    const mockPlay = vi.fn().mockResolvedValue(undefined);
    global.Audio = vi.fn().mockImplementation(function () {
        return {
            play: mockPlay,
        };
    });

    beforeEach(() => {
        vi.useFakeTimers();
        mockPlay.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should show lunch break at 13:00', () => {
        const date = new Date(2024, 0, 1, 13, 0, 0);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        // Advance timer to trigger update
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.statusLabel).toBe('Mittagspause 🍱');
        expect(result.current.bgColor).toBe('var(--color-lunch)');
    });

    it('should show lunch break at 13:59', () => {
        const date = new Date(2024, 0, 1, 13, 59, 0);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.statusLabel).toBe('Mittagspause 🍱');
    });

    it('should start session 1/4 at 14:05', () => {
        const date = new Date(2024, 0, 1, 14, 5, 0);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.statusLabel).toBe('Fokus 🚀 (1/4)');
        expect(result.current.bgColor).toBe('var(--color-focus)');
    });

    it('should show correct status at 21:09', () => {
        const date = new Date(2024, 0, 1, 21, 9, 0);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.statusLabel).toBe('Fokus 🚀 (3/4)');
    });

    it('should generate sessions up to the end of the day', () => {
        const { result } = renderHook(() => usePomodoro());

        // Wait for sessions to be generated
        act(() => {
            vi.advanceTimersByTime(0);
        });

        const sessions = result.current.sessions;
        expect(sessions.length).toBeGreaterThan(0);
        const lastSession = sessions[sessions.length - 1];
        // Last session should be at 23:35
        expect(lastSession.startH).toBe(23);
    });

    it('should show correct status at 21:15', () => {
        const date = new Date(2024, 0, 1, 21, 15, 0);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.statusLabel).toBe('Fokus 🚀 (3/4)');
    });

    it('should parse time parameter with seconds from URL', () => {
        const date = new Date(2024, 0, 1, 10, 0, 0);
        vi.setSystemTime(date);

        // Mock URL search params
        const url = new URL(window.location.href);
        url.searchParams.set('time', '12:59:55');
        window.history.replaceState({}, '', url.toString());

        const { result } = renderHook(() => usePomodoro());

        expect(result.current.isDebug).toBe(true);
        expect(result.current.debugTime).toBe('12:59:55');

        // Reset
        url.searchParams.delete('time');
        window.history.replaceState({}, '', url.toString());
    });

    it('should play a sound when transitioning from work to break if sound is enabled', () => {
        const date = new Date(2024, 0, 1, 14, 29, 59);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        // Enable sound
        act(() => {
            result.current.toggleSound();
        });

        // Initial render, state is work.
        // Advance 2 seconds to 14:30:01
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(mockPlay).toHaveBeenCalled();
    });

    it('should NOT play a sound when transitioning if sound is disabled', () => {
        const date = new Date(2024, 0, 1, 14, 29, 59);
        vi.setSystemTime(date);

        renderHook(() => usePomodoro());

        // Sound is disabled by default

        // Advance 2 seconds to 14:30:01
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(mockPlay).not.toHaveBeenCalled();
    });

    it('should update progress bar correctly', () => {
        // 14:05 starts work (25 mins).
        // At 14:05:00, progress should be 0% (or close to it depending on implementation details)
        // At 14:17:30, progress should be 50%
        
        const date = new Date(2024, 0, 1, 14, 17, 30);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // 12.5 mins passed out of 25 mins = 50%
        expect(result.current.progress).toBeCloseTo(50, 0);
    });

    it('should cycle through work positions correctly', () => {
        // 14:05 -> 1/4
        // 14:35 -> 2/4
        // 15:05 -> 3/4
        // 15:35 -> 4/4
        // 16:05 -> 1/4

        const checkTime = (hours, minutes, expectedLabel) => {
            const date = new Date(2024, 0, 1, hours, minutes, 0);
            vi.setSystemTime(date);
            const { result } = renderHook(() => usePomodoro());
            act(() => { vi.advanceTimersByTime(1000); });
            expect(result.current.statusLabel).toBe(expectedLabel);
        };

        checkTime(14, 5, 'Fokus 🚀 (1/4)');
        checkTime(14, 35, 'Fokus 🚀 (2/4)');
        checkTime(15, 5, 'Fokus 🚀 (3/4)');
        checkTime(15, 35, 'Fokus 🚀 (4/4)');
        checkTime(16, 5, 'Fokus 🚀 (1/4)');
    });

    it('should toggle sound enabled state', () => {
        const { result } = renderHook(() => usePomodoro());

        expect(result.current.isSoundEnabled).toBe(false);

        act(() => {
            result.current.toggleSound();
        });

        expect(result.current.isSoundEnabled).toBe(true);

        act(() => {
            result.current.toggleSound();
        });

        expect(result.current.isSoundEnabled).toBe(false);
    });

    it('should return correct timeString', () => {
        // 14:05:00 -> 25:00 remaining
        const date = new Date(2024, 0, 1, 14, 5, 0);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // 1 second passed, so 24:59
        expect(result.current.timeString).toBe('24:59');
    });
});
