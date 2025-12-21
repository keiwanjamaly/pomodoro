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
        // Assuming the schedule logic:
        // 7:00 - 13:00 -> 12 sessions (3 full cycles)
        // 13:00 - 14:00 -> Lunch
        // 14:05 -> Should be start of next session.

        const date = new Date(2024, 0, 1, 14, 5, 0);
        vi.setSystemTime(date);

        const { result } = renderHook(() => usePomodoro());

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.statusLabel).toBe('Fokus 🚀 (1/4)');
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
        const originalLocation = window.location;
        delete window.location;
        window.location = { ...originalLocation, search: '?time=12:59:55' };

        const { result } = renderHook(() => usePomodoro());

        expect(result.current.isDebug).toBe(true);
        expect(result.current.debugTime).toBe('12:59:55');

        // Restore window.location
        window.location = originalLocation;
    });

    it('should play a sound when transitioning from work to break', () => {
        // 14:05 starts work. 14:30 ends work (25 mins).
        // Set time to 14:29:59
        const date = new Date(2024, 0, 1, 14, 29, 59);
        vi.setSystemTime(date);

        renderHook(() => usePomodoro());

        // Initial render, state is work.
        // Advance 2 seconds to 14:30:01
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(mockPlay).toHaveBeenCalled();
    });

    it('should play a sound when transitioning from break to work', () => {
        // 14:30 starts break. 14:35 ends break (5 mins).
        // Set time to 14:34:59
        const date = new Date(2024, 0, 1, 14, 34, 59);
        vi.setSystemTime(date);

        renderHook(() => usePomodoro());

        // Advance 2 seconds to 14:35:01
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(mockPlay).toHaveBeenCalled();
    });
});
