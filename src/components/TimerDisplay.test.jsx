import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TimerDisplay from './TimerDisplay';

describe('TimerDisplay Component', () => {
    it('renders the time correctly', () => {
        render(<TimerDisplay time="12:34" />);
        expect(screen.getByText('12:34')).toBeInTheDocument();
    });
});
