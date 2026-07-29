import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App without crashing', async () => {
  render(<App />);
  const text = await screen.findByText(/arup\.dev/i);
  expect(text).toBeInTheDocument();
});
