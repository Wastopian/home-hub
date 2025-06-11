import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Home Hub heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /Home Hub/i });
  expect(heading).toBeInTheDocument();
});
