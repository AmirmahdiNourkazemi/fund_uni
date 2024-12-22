import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, CircularProgress, Divider, IconButton, useMediaQuery } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { fetchUserProfile } from '../../../api/profile';
import { depositWallet } from '../../../api/payment';
import { Add_Commas, En_To_Fa, Fa_To_En } from 'persian_util/build/parser';
import SnackbarComponent from '../../../utils/SnackBar.jsx';
import { useNavigate } from 'react-router-dom';

const DepositGateway = ({profile}) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';
  const navigate = useNavigate();
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserProfile();
        setUserData(data);
      } catch (error) {
        if (error.message === 'Unauthenticated.' || error.message === 'No token found') {
          navigate('/login');
          localStorage.clear();
        }
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      }
    };
    getUserData();
  }, []);

  const handleAmountChange = (event) => {
    const { value } = event.target;
    const formattedValue = value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setAmount(formattedValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!amount) {
      setErrors({ amount: 'لطفا مبلغ را وارد کنید' });
      return;
    }

    setLoading(true);
    const parsedAmount = parseInt(Fa_To_En(amount.replace(/,/g, '')));
    try {
      const url = await depositWallet(parsedAmount);
        // setSnackbar({ open: true, message: 'Transfer successful', severity: 'success' });
      setAmount('');
      window.open(url, 'self');
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
    setLoading(false);
  };

  if (!profile) return <CircularProgress sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', justifyItems: 'center' }} />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        {profile.type === 1 && profile.private_person_info && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize }}>نام و نام خانوادگی</Typography>
            <Typography sx={{ fontSize }}>{`${profile.private_person_info.first_name} ${profile.private_person_info.last_name}`}</Typography>
          </Box>
        )}
        {profile.type === 2 && profile.legal_person_info && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize }}>نام شرکت</Typography>
            <Typography sx={{ fontSize }}>{profile.legal_person_info.name}</Typography>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize }}>کد ملی</Typography>
          <Typography sx={{ fontSize }}>{En_To_Fa(profile.national_code.toString())}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize }}>شماره تلفن</Typography>
          <Typography sx={{ fontSize }}>{En_To_Fa(profile.mobile)}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize }}>مبلغ کیف پول</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize }}>{En_To_Fa(Add_Commas(profile.wallet.toString()))}</Typography>
            <Typography sx={{ ml: 0.5, fontSize: 12 }}>تومان</Typography>
          </Box>
        </Box>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="میزان درخواست (تومان)"
          fullWidth
          style={{
            marginTop:'10px'
          }}
          variant="outlined"
          value={amount}
          onChange={handleAmountChange}
          InputLabelProps={{ sx: { fontSize } }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setAmount('')}>
                <Clear />
              </IconButton>
            )
          }}
          error={!!errors.amount}
          helperText={errors.amount ? errors.amount : ''}
          inputProps={{ inputMode: 'numeric' , style:{
          fontSize,
          }}}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 , fontSize }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            'ادامه'
          )}
        </Button>
      </form>
      <SnackbarComponent
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default DepositGateway;
