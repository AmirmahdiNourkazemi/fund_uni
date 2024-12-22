// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  
  direction: 'rtl',
  typography: {
    fontFamily: 'irms-w600, sans-serif',
  },
  palette:{
    primary:{
        main: '#074EA0',
        light: '#074EA0'
    }
  }
});

export default theme;


