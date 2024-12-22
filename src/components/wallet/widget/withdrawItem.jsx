import React from 'react';
import {
  Box,
  Typography,
  ListItem,
  Divider,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalanceWallet,
  Payment,
  Cancel,
} from '@mui/icons-material';
import { En_To_Fa, Add_Commas } from 'persian_util/build/parser';
import JalaliDateConverter from '../../../utils/PersianDateConverter.jsx';

const WithdrawItem = ({ item, fontSize }) => (


  <Box >
    <ListItem  sx={{ fontSize, direction: 'ltr', flexDirection: 'column', alignItems: 'normal'  ,backgroundColor:'white' , borderRadius:'10px'}}>
      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        {item.status === 1 && <AccountBalanceWallet style={{ color: '#074EA0'  }} />}
        {item.status === 2 && <Payment style={{ color: '#074EA0' }} />}
        {item.status === 3 && <Cancel style={{ color: '#074EA0' }} />}
    <div>
  <Box sx={{display:'flex' , flexDirection:'row' , justifyContent: 'space-between'}}>
  <Typography sx={{ fontSize , mr:2}} color="textPrimary">
          {`مبلغ درخواستی`}
        </Typography>
        <Typography sx={{ fontSize , mr:2}} color="textPrimary">
          {`${En_To_Fa(Add_Commas(item.amount.toString()))} تومان`}
        </Typography>
  </Box>
    </div>
      
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
    
      <Box sx={{display:'flex' , mb:0.5 , mr:5 , justifyContent: 'space-between'}}>
      <Typography component="span" sx={{ fontSize  }} color="textPrimary">
          {`تاریخ ثبت: `}
        </Typography>
        <Typography component="span" sx={{ fontSize }} color="textPrimary">
          <JalaliDateConverter isoDate={item.created_at} />
        </Typography>
    
       </Box>
        {item.status === 2 && (
          <Box sx={{display:'flex' , flexDirection:'row' , mb:0.5 , mr:5 , justifyContent: 'space-between'}}>
            <Typography component="span" sx={{ fontSize }} color="textPrimary">
              {`تاریخ پرداخت:`}
            </Typography>
            <Typography component="span" sx={{ fontSize }} color="textPrimary">
              <JalaliDateConverter isoDate={item.withdraw_date ?? item.created_at} />
            </Typography>
          </Box>


        )}
        {item.status === 3 && (
          <Box sx={{display:'flex' , flexDirection:'row' , mb:0.5 , mr:5 , justifyContent: 'space-between'}}>
            <Typography component="span" sx={{ fontSize }} color="textPrimary">
              {`تاریخ لغو:`}
            </Typography>
            <Typography component="span" sx={{ fontSize }} color="textPrimary">
              <JalaliDateConverter isoDate={item.withdraw_date ?? item.created_at} />
            </Typography>
          </Box>

        )}
      </Box>
      <Box sx={{ display: 'flex' , mr:5 , justifyContent: 'space-between' }}>
        <Typography component="span" sx={{ fontSize }} color="textPrimary">
          {`وضعیت :`}
        </Typography>
        {item.status === 1 && (
          <Typography component="span" sx={{ fontSize }} color="blue">
            {`در حال بررسی`}
          </Typography>
        )}
        {item.status === 2 && (
          <Typography component="span" sx={{ fontSize }} color="green">
            {`پرداخت شده`}
          </Typography>
        )}
        {item.status === 3 && (
          <Typography component="span" sx={{ fontSize }} color="red">
            {`لغو شده`}
          </Typography>
        )}
      </Box>
    </ListItem>
    <Box sx={{ my: 1 }} />
  </Box>
);

export default WithdrawItem;