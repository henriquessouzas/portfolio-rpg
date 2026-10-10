import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { rooms } from '@/content/rooms';
import { SimpleScreen } from './SimpleScreen';

describe('SimpleScreen', () => {
  it('renders all room names', () => {
    render(<SimpleScreen onBack={vi.fn()} />);
    for (const room of rooms) {
      expect(screen.getByRole('heading', { name: room.name })).toBeInTheDocument();
    }
  });
});
