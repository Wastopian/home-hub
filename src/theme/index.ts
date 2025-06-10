import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#8B7355', // Warm neutral brown
      light: '#A89682',
      dark: '#6B5B47',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#7A8471', // Natural green
      light: '#9BA192',
      dark: '#5C6356',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F5F3', // Warm off-white
      paper: 'rgba(255, 255, 255, 0.85)', // Glass morphism background
    },
    text: {
      primary: '#3C3C3C', // Soft graphite
      secondary: '#6B6B6B',
    },
    grey: {
      50: '#FAFAF9',
      100: '#F5F4F2',
      200: '#EEEDE9',
      300: '#E0DDD7',
      400: '#C7C3BA',
      500: '#9B9691',
      600: '#7A7670',
      700: '#5C5952',
      800: '#3F3D37',
      900: '#2A281F',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#3C3C3C',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#3C3C3C',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#3C3C3C',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#3C3C3C',
    },
    body1: {
      fontSize: '1rem',
      color: '#3C3C3C',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6B6B6B',
    },
  },
  shape: {
    borderRadius: 16, // Soft border radius as specified
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(135deg, #8B7355 0%, #A89682 100%)',
          boxShadow: '0 4px 16px rgba(139, 115, 85, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7A6449 0%, #9B8975 100%)',
            boxShadow: '0 6px 20px rgba(139, 115, 85, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            '& fieldset': {
              borderColor: 'rgba(139, 115, 85, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(139, 115, 85, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B7355',
            },
          },
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions); 