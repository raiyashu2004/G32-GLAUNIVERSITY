import { createTheme } from '@mui/material/styles';

// Modern Material Design 3 inspired color palette
const primaryColor = {
  main: '#1976D2',
  light: '#42A5F5',
  dark: '#1565C0',
  contrastText: '#FFFFFF',
};

const secondaryColor = {
  main: '#7B1FA2',
  light: '#BA68C8',
  dark: '#4A148C',
  contrastText: '#FFFFFF',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: primaryColor,
    secondary: secondaryColor,
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    grey: {
      50: '#F8F9FA',
      100: '#ECEFF1',
      200: '#CFD8DC',
      300: '#B0BEC5',
      800: '#37474F',
      900: '#263238',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.005em' },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1.125rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.02em' },
    subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 },
    body1: { fontSize: '0.95rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 12,
          padding: 0,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 25px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': { paddingBottom: '20px' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': { 
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0,0,0,0.2)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '& input': { padding: '16px 14px' },
            '& .MuiOutlinedInput-notchedOutline': { 
              borderColor: 'rgba(0, 0, 0, 0.15)',
              borderWidth: '1.5px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': { 
              borderColor: primaryColor.light,
              borderWidth: '1.5px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
              borderWidth: '2px', 
              borderColor: primaryColor.main,
              boxShadow: `0 0 0 3px ${primaryColor.main}20`,
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            '&.MuiInputLabel-outlined': { transform: 'translate(14px, 16px) scale(1)' },
            '&.MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.75)' },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: { padding: '14px' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.08)',
          '&.MuiPaper-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
          '& .MuiPaper-root': {
            borderRadius: 12,
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { 
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        },
        head: { 
          fontWeight: 600, 
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          color: primaryColor.dark,
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
          '&:last-child td': { borderBottom: 0 },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 12px 32px rgba(0,0,0,0.2)',
          border: '1px solid rgba(0,0,0,0.08)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { 
          fontSize: '1.375rem', 
          fontWeight: 600, 
          padding: '24px 24px 16px',
          color: primaryColor.dark,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: '0 24px' },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: '16px 24px 20px', gap: '8px' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: '24px !important',
          paddingRight: '24px !important',
          minHeight: '64px',
        },
      },
    },
  },
});

export default theme;
