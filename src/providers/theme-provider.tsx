'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2F5FA5',
      light: '#5C8CC4',
      dark: '#1A3E70',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#5CC6C4',
      light: '#7DE3E0',
      dark: '#3A9B99',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F6FAFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    divider: '#E3EEF7',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'var(--font-inter), sans-serif',
    h1: {
      fontSize: '36px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '28px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '22px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '14px',
    },
    caption: {
      fontSize: '12px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(47, 95, 165, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2F5FA5 0%, #5CC6C4 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2F5FA5 20%, #5CC6C4 120%)',
            boxShadow: '0 8px 20px rgba(92, 198, 196, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(227, 238, 247, 0.5)',
          border: '1px solid #E3EEF7',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              borderColor: '#E3EEF7',
            },
            '&:hover fieldset': {
              borderColor: '#5CC6C4',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2F5FA5',
              boxShadow: '0 0 0 4px rgba(47, 95, 165, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
  },
});

export default function ClinovaThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
