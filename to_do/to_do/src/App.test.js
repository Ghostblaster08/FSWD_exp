import { render, screen } from '@testing-library/react';
import App from './App';

test('renders todo list', () => {
  render(<App />);
  const todoElement = screen.getByTestId('todo-list');
  expect(todoElement).toBeInTheDocument();
});
