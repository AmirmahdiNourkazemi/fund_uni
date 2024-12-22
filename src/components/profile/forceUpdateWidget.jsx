import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-jalaali';
import { getForceUpdateDate, setForceUpdateDate } from '../../utils/SharedPref';
import { loginWithOtp, checkOtp } from '../../api/auth';
import JalaliDateConverter from '../../utils/PersianDateConverter.jsx';
import { En_To_Fa } from 'persian_util/build/parser';
import SnackbarComponent from '../../utils/SnackBar.jsx';
import OtpDialogForceUpdate from './OtpDialogForceUpdate';

const ForceUpdateWidget = ({ isForceUpdate, user }) => {
  const navigate = useNavigate();
  const [forceUpdateDate, setForceUpdateDateState] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);

  useEffect(() => {
    const fetchForceUpdateDate = async () => {
      const date = await getForceUpdateDate();
      setForceUpdateDateState(date);
    };
    fetchForceUpdateDate();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSendCode = async () => {
    try {
      setLoading(true);
      const response = await loginWithOtp(user.national_code, null, true);
      if (response.success) {
        setLoading(false);
        setOtpDialogOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setSnackbarMessage(error.message || 'An error occurred');
      setSnackbarOpen(true);
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      const response = await checkOtp(user.national_code, otp, true);
      if (response.success) {
        await setForceUpdateDate(new Date().toISOString());
        setForceUpdateDateState(new Date().toISOString());
        setOtpDialogOpen(false);
        navigate('/profile'); // or use window.location.reload() to refresh the page
      } else {
        setSnackbarMessage(response.message);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred');
      setSnackbarOpen(true);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return moment(date).locale('fa').format('YYYY/MM/DD');
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return moment(date).locale('fa').format('HH:mm');
  };

  const lastUpdateDate = forceUpdateDate || (user.type === 1 ? user.private_person_info.updated_at : user.legal_person_info.updated_at);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';

  return (
    <Box sx={{ padding: '10px 20px', overflow: 'hidden', transition: 'height 0.4s ease-in-out' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography sx={{ fontSize }}>تاریخ آخرین آپدیت:</Typography>
          <Typography sx={{ fontSize }}><JalaliDateConverter isoDate={formatDate(lastUpdateDate)} /></Typography>
          <Typography sx={{ fontSize }}>ساعت: {En_To_Fa(formatTime(lastUpdateDate))}</Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ fontSize }}>کد به شماره موبایل</Typography>
          <Typography sx={{ fontSize, color: 'primary.main', px: '4px' }}>
            {En_To_Fa(user.mobile)}
          </Typography>
          <Typography sx={{ fontSize }}>ارسال می شود.</Typography>
        </Box>
        <Button variant="outlined" sx={{ alignSelf: 'center', fontSize }} onClick={handleSendCode}>
          {loading ? <CircularProgress size={24} /> : 'ارسال کد'}
        </Button>
      </Box>
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity="warning"
      />
      <OtpDialogForceUpdate
        isOpen={otpDialogOpen}
        onRequestClose={() => setOtpDialogOpen(false)}
        onSubmit={handleOtpSubmit}
      />
    </Box>
  );
};

export default ForceUpdateWidget;
