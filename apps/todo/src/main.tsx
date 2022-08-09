import { createTheme, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createTheme({
  palette:{
    primary:{
      main: '#1D3557'
    },
    secondary:{
      main: '#457B9D'
    },
    success:{
      main: '#00CCA0'
    },
    warning: {
      main:'#fbd87f'
    },
    error: {
      main: '#E63946'
    },
    info:{
      main: '#A8DADC'
    },
    background: {
      default: '#F1FAEE',
      paper: '#F1F9F8'
    }
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: 'Yanone Kaffeesatz',
  }
})

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
