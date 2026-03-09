import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useThemeControl = () => useContext(ThemeContext);

/**
 * ThemeControlProvider
 * 
 * Manages both MUI theme and custom LESS variable synchronization.
 */
export const ThemeControlProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app-theme-mode') || 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme-mode', newMode);
      return newMode;
    });
  };

  // Sync with body class for LESS variables
  useEffect(() => {
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [mode]);

  // Create MUI theme based on mode
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#667eea',
      },
      secondary: {
        main: '#764ba2',
      },
      background: {
        default: mode === 'light' ? '#f5f7fa' : '#0f0c29',
        paper: mode === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h1: { fontSize: '2rem', fontWeight: 700 },
      h5: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
