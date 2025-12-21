import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePomodoro } from './usePomodoro';

describe('usePomodoro', () => {
    beforeEach(() => {
        vi.useFakeTimers();
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
});
