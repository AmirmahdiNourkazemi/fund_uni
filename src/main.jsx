import React from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import theme from './theme';
import cacheRtl from './cacheRtl';
import Modal from 'react-modal';
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>

 <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      <App />
      
    </ThemeProvider>
    </CacheProvider>
 
 
  // </React.StrictMode>,
)
