import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App without crashing', async () => {
  render(<App />);
  const elements = await screen.findAllByText(/Arup/i, {}, { timeout: 8000 });
  expect(elements.length).toBeGreaterThan(0);
});
