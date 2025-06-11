import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Home Hub title', () => {
  render(<App />);
  const titles = screen.getAllByText(/Home Hub/i);
  expect(titles.length).toBeGreaterThan(0);
});
