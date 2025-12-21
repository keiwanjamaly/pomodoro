import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the hook to control the state
const mockToggleSound = vi.fn();

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
        timeOffset: 0,
        isSoundEnabled: false,
        toggleSound: mockToggleSound
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

    it('toggles theme when theme button is clicked', () => {
        render(<App />);
        const themeButton = screen.getByLabelText(/Switch to Dark Mode/i);
        
        // Initial state (Light Mode)
        expect(document.body.style.backgroundColor).toBe('rgb(231, 76, 60)'); // #e74c3c

        // Click to toggle to Dark Mode
        fireEvent.click(themeButton);
        expect(document.body.style.backgroundColor).toBe('rgb(18, 18, 18)'); // #121212
        expect(screen.getByLabelText(/Switch to Light Mode/i)).toBeInTheDocument();

        // Click to toggle back to Light Mode
        fireEvent.click(themeButton);
        expect(document.body.style.backgroundColor).toBe('rgb(231, 76, 60)');
    });

    it('calls toggleSound when sound button is clicked', () => {
        render(<App />);
        const soundButton = screen.getByLabelText(/Enable sound/i);
        
        fireEvent.click(soundButton);
        expect(mockToggleSound).toHaveBeenCalled();
    });
});

