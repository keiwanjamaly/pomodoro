import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GlassCard from './GlassCard';

describe('GlassCard Component', () => {
    it('renders children correctly', () => {
        render(
            <GlassCard>
                <div data-testid="child">Child Content</div>
            </GlassCard>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('has the glass-card class', () => {
        const { container } = render(<GlassCard>Content</GlassCard>);
        expect(container.firstChild).toHaveClass('glass-card');
    });
});
