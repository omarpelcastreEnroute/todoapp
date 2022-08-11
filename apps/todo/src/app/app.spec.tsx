import { enableFetchMocks } from 'jest-fetch-mock'

import { fireEvent, render, screen } from '@testing-library/react';

import App from './app';
import { Todos } from './todos';
enableFetchMocks()

describe('App', () => {
  // it('should render successfully', () => {
  //   const { baseElement } = render(<App />);

  //   expect(baseElement).toBeTruthy();
  // });

  it('should have a create new task button', () => {
    const { getByText } = render(<Todos />);
    expect(getByText(/CREATE NEW TASK/gi)).toBeTruthy();
  });
  
  it('should show a modal with cancel and create buttons', () => {
    const { getByText } = render(<Todos />);
    fireEvent.click(screen.getByText('CREATE NEW TASK'))
    expect(getByText('CANCEL')).toBeTruthy();
    expect(getByText('CREATE')).toBeTruthy();
  })
  
  it('modal cancel button should show create new task button again', () => {
    const { getByText } = render(<Todos />);
    fireEvent.click(screen.getByText('CREATE NEW TASK'))
    expect(getByText('CANCEL')).toBeTruthy();
    fireEvent.click(screen.getByText('CANCEL'))
    expect(getByText(/CREATE NEW TASK/gi)).toBeTruthy();
  })
});
