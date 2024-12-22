import React from 'react';
import { Box, Typography, Collapse ,useMediaQuery} from '@mui/material';
import { En_To_Fa } from 'persian_util/build/parser';

const BankAccountWidget = ({ isBankAccount, user }) => {
  const bankAccount = user.bank_accounts ? user.bank_accounts[0] : null;
  const tradingAccount = user.trading_accounts ? user.trading_accounts[0] : null;
  const legalInfo = user.private_person_info;
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!bankAccount && !tradingAccount && !legalInfo) return null;

  return (
    <Collapse in={isBankAccount} timeout="auto" unmountOnExit>
      <Box pl={4} pr={4} pb={2}>
        {bankAccount.iban  && (
          <>
            <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}} >
              شماره شبا: {bankAccount.iban}
            </Typography>
            {bankAccount.number && (
              <>
              <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}} >
              شماره حساب: {bankAccount.number} - {(bankAccount.bank_name)}
            </Typography>
            </>
            )
            }
          </>
        )}
        {tradingAccount && (
          <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}} >
            کد بورسی: {tradingAccount.code}
          </Typography>
        )}
        {legalInfo && user.type === 2 && (
          <>
            
           {legalInfo.register_number  && (
            <>
             <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}} >
              شماره ثبت: {(legalInfo.register_number)}
            </Typography>
            </>
           )

           }
            {legalInfo.register_place  && (
            <>
             <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}}>
              محل ثبت: {legalInfo.register_place}
            </Typography>
            </>
           )

           }
           
          </>
        )}
      </Box>
    </Collapse>
  );
};

export default BankAccountWidget;
