import React from 'react';
import { Box, Typography, Collapse ,useMediaQuery} from '@mui/material';
import { En_To_Fa } from 'persian_util/build/parser';
import JalaliDateConverter from '../../utils/PersianDateConverter.jsx'

const PrivateInfoWidget = ({ isUserPrivate, user }) => {
  const privateInfo = user.private_person_info;
  const legalInfo = user.legal_person_info;
  const isMobile = useMediaQuery('(max-width: 768px)');
 
  return (
    <Collapse in={isUserPrivate} timeout="auto" unmountOnExit>
      <Box pl={4} pr={4} pb={2}>
        <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}} gutterBottom>
          نام و نام خانوادگی: {user.name}
        </Typography>
        <Typography sx={{fontSize:isMobile ? 12 : 14 ,color:'GrayText'}} gutterBottom>
          شماره موبایل: {En_To_Fa(user.mobile)}
        </Typography>
        <Typography sx={{fontSize:isMobile ? 12 : 14 ,color:'GrayText'}} gutterBottom>
          {user.type === 1 ? 'کدملی :' : 'شناسه ملی :'} {En_To_Fa(user.national_code)}
        </Typography>
        {privateInfo && privateInfo.birthday && (
          <Typography sx={{fontSize:isMobile ? 12 : 14 ,color:'GrayText'}} gutterBottom>
            تاریخ تولد : {<JalaliDateConverter isoDate={privateInfo.birthday} />}
          </Typography>
        )}
      </Box>
    </Collapse>
  );
};

export default PrivateInfoWidget;
