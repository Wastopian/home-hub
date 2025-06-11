import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard title', () => {
  render(<App />);
  const title = screen.getByText(/Home Hub Dashboard/i);
  expect(title).toBeInTheDocument();
});
