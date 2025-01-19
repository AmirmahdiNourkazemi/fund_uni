import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography, TextField, Button, Divider, List, useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../../api/profile.js';
import { getWithdraw, storeWithdraw } from '../../../api/payment.js';
import { En_To_Fa, Add_Commas } from 'persian_util/build/parser';
import JalaliDateConverter from '../../../utils/PersianDateConverter.jsx';
import WithdrawItem from '../widget/withdrawItem.jsx';
import SnackbarComponent from '../../../utils/SnackBar.jsx';

const WithdrawScreen = ({}) => {
  const [profile, setProfile] = useState(null);
  const [withdrawData, setWithdrawData] = useState([]);
  const [price, setPrice] = useState('');
  const [iban, setIban] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const isMobile = useMediaQuery('(max-width: 900px)');
  const navigate = useNavigate();
  const fontSize = isMobile ? '12px' : '14px';


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setProfile(userProfile);

        if (userProfile.bank_accounts && userProfile.bank_accounts.length > 0) {
          setIban(`${userProfile.bank_accounts[0].iban}`);
        } else {
          setIban('نامشخص');
        }

        const withdrawResponse = await getWithdraw();
        setWithdrawData(withdrawResponse.data);
      } catch (err) {
        if (err.message === 'Unauthenticated.' || err.message === 'No token found') {
          navigate('/login',{ state: { from: '/wallet/withdraw' } });
          localStorage.clear();
        }
        setError('Error fetching profile or withdraw data');
        setSnackbarMessage('Error fetching profile or withdraw data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, []);

  const validateAmount = (value) => {
    if (!value || value === '') {
      return 'لطفا مبلغ را وارد کنید';
    }
    const enteredAmount = parseFloat(value.replace(/,/g, ''));
    if (enteredAmount > profile.wallet) {
      return 'مبلغ درخواستی بیشتر از کیف پول است';
    }
    return null;
  };

  const handleWithdraw = async () => {
    const validationError = validateAmount(price);
    if (validationError) {
      setError(validationError);
      setSnackbarMessage(validationError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    try {
       await storeWithdraw(parseFloat(price.replace(/,/g, '')), iban.replace(/ /g, ''));
        setPrice('');
        setError('');
        setSnackbarMessage('درخواست با موفقیت ثبت شد');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
  
        // Fetch updated user profile and transaction history
        const userProfile = await fetchUserProfile();
        setProfile(userProfile);
  
        const withdrawResponse = await getWithdraw();
        setWithdrawData(withdrawResponse.data);
     
    } catch (err) {
      setError(err.toString());
      setSnackbarMessage(err.toString());
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  

  const handlePriceChange = (event) => {
    const { value } = event.target;
    const formattedValue = value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setPrice(formattedValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box  width={isMobile ? null : '900px'} sx={{ mt: 12, px: 2  }}>
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      {profile ? (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ p:2, mb:1 , borderRadius:'10px'}}>
          <div style={{display:'flex' , flexDirection:'row' , justifyContent:'space-between'}}>
         <Typography sx={{  fontSize }}>نام و نام خوانوادگی </Typography>
         <Typography sx={{  fontSize }}>{profile.name} </Typography>
         </div>
         <Divider sx={{my:1.5}}/>
          <div style={{display:'flex' , flexDirection:'row' , justifyContent:'space-between'}}>
         <Typography sx={{  fontSize }}>موجودی کیف پول </Typography>
         <Typography sx={{  fontSize }}>{En_To_Fa(Add_Commas(profile.wallet.toString()))} تومان</Typography>
         </div>
         <Divider sx={{my:1.5}}/>
         <div style={{display:'flex' , flexDirection:'row' , justifyContent:'space-between'}}>
         <Typography sx={{  fontSize }}>کد ملی</Typography>
         <Typography sx={{  fontSize }}>{En_To_Fa(profile.national_code)}</Typography>
         </div>
         <Divider sx={{my:1.5}}/>
         <div style={{display:'flex' , flexDirection:'row' , justifyContent:'space-between'}}>
         <Typography sx={{  fontSize }}>شماره تلفن</Typography>
         <Typography sx={{  fontSize }}>{En_To_Fa(profile.mobile)}</Typography>
         </div>
      
          </Box>
          <TextField
            fullWidth
            style={
             { fontSize}
            }
            label="میزان درخواست (تومان)"
            value={price}
            onChange={handlePriceChange}
            error={!!error}
            helperText={error}
            
            inputProps={{
              sx: { fontSize: isMobile ? '12px' : '14px' } 
            }}
            sx={{ mb: 2, fontSize , backgroundColor:'white' }}
            InputLabelProps={{
              sx: { fontSize: isMobile ? '12px' : '14px' } // Adjust the font size here
            }}
          />
          <TextField
            fullWidth
            label="شماره شبا"
            value={iban}
            inputProps={{
              sx: { fontSize: isMobile ? '12px' : '14px' } 
            }}
            sx={{ mb: 2, fontSize }}
            InputLabelProps={{
              sx: { fontSize: isMobile ? '12px' : '14px' } // Adjust the font size here
            }}
            InputProps={{
              readOnly: true,
            }}
           
            
          />
          <Button variant="contained" color="primary" sx={{ fontSize }} fullWidth onClick={handleWithdraw}>
            ثبت درخواست
          </Button>
          <Box sx={{ my: 3 }} />
          {withdrawData.length > 0 && (
            <Box>
              <Typography sx={{ fontSize}}>درخواست ها</Typography>
              <List>
                {withdrawData.map(item => (
                  <WithdrawItem key={item.id} item={item} fontSize={fontSize} />
                ))}
              </List>
            </Box>
          )}
        </Box>
      ) : (
        <CircularProgress  sx={{justifyContent:'center' , alignItems:'center' , display:'flex' , margin:'0 auto'}} />
      )}
      <Box sx={{height:'70px'}}></Box>
    </Box>
  );
};

export default WithdrawScreen;
