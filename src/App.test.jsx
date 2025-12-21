import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the hook to control the state
vi.mock('./hooks/usePomodoro', () => ({
    usePomodoro: () => ({
        timeString: '25:00',
        statusLabel: 'Fokus 🚀',
        bgColor: '#e74c3c',
        progress: 0,
        sessions: [
            { startH: 9, startM: 5, duration: 25, type: 'work', label: 'Fokus' }
        ],
        isDebug: false,
        debugTime: '',
        timeOffset: 0
    })
}));

describe('App Component', () => {
    it('renders the timer display', () => {
        render(<App />);
        expect(screen.getByTestId('time-display')).toHaveTextContent('25:00');
    });

    it('renders the status label', () => {
        render(<App />);
        expect(screen.getByTestId('status-label')).toHaveTextContent('Fokus 🚀');
    });

    it('renders the timeline', () => {
        render(<App />);
        expect(screen.getByTestId('timeline')).toBeInTheDocument();
    });

    it('renders the progress bar', () => {
        render(<App />);
        expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });
});
