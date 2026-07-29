import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App without crashing', async () => {
  render(<App />);
  const text = await screen.findByText(/Arup/i, {}, { timeout: 5000 });
  expect(text).toBeInTheDocument();
});
