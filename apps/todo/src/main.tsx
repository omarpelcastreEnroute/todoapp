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
      main: '#08c7d9'
    },
    secondary:{
      main: '#FCE4D8'
    },
    success:{
      main: '#00CCA0'
    },
    warning: {
      main:'#fbd87f'
    },
    error: {
      main: '#F75590'
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
