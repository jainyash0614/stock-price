import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#06b6d4' }, // cyan
    secondary: { main: '#ec4899' }, // pink
    background: { default: '#18181b', paper: '#23232a' },
    success: { main: '#22d3ee' },
    warning: { main: '#f59e42' },
    error: { main: '#ef4444' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontWeightBold: 700,
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
  },
});
export default theme;