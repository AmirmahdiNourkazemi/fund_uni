import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, useMediaQuery } from '@mui/material';
import { Money, Receipt } from '@mui/icons-material';
import DepositGateway from './depositGatway'
import { useLocation } from 'react-router-dom'; ;
import TrackDeposit from './trackDeposit';


const DepositScreen = ({ responseData }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation(); // Use useLocation to get the profile data
  const profile = location.state?.profile;


  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const isMobile = useMediaQuery('(max-width: 768px)');
  const fontSize = isMobile ? '12px' : '14px';
  return (
    <Box sx={{ direction: 'ltr', backgroundColor: 'white', borderRadius: '10px', mt: isMobile ? 12 : 12, width: isMobile ? null : '700px' , }} >

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      </Box>
    

     
      
        {/* <DepositGateway responseData={responseData} /> */}
        <TrackDeposit />
      
    </Box>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default DepositScreen;
