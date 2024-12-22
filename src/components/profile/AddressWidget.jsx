import React from 'react';
import { Box, Typography, Collapse ,useMediaQuery } from '@mui/material';
import { En_To_Fa } from 'persian_util/build/parser';

const AddressWidget = ({ isUserAddress, user }) => {
  const address = user.addresses ? user.addresses[0] : null;
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (!address) return null;

  return (
    <Collapse in={isUserAddress} timeout="auto" unmountOnExit>
      <Box pl={4} pr={4} pb={2}>
        <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}} gutterBottom>
          کد پستی: {En_To_Fa(address.postal_code)}
        </Typography>
        <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}}>
          آدرس: شهر {address.province}، شهرستان {address.city}، خیابان {address.street}، کوچه {address.alley}، پلاک {En_To_Fa(address.plaque)}
        </Typography>
      </Box>
    </Collapse>
  );
};

export default AddressWidget;
