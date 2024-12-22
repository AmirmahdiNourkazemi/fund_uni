import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import OtpInput from 'react-otp-input';
import '../../styles/OTPDialog.css';

const OtpDialogForceUpdate = ({ isOpen, onRequestClose, onSubmit }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(otp).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (otp.length === 5) {
      handleSubmit(new Event('submit'));
    }
  }, [otp]);

  return (
    <Dialog open={isOpen} onClose={onRequestClose} aria-labelledby="otp-dialog-title">
      <DialogTitle sx={{ fontSize: isMobile ? '14px' : '16px' }} id="otp-dialog-title">کد ورود</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: isMobile ? '12px' : '14px' }} gutterBottom>
          لطفا کد ارسال شده را وارد کنید
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <OtpInput
              value={otp}
              onChange={setOtp}
              inputType='number'
              numInputs={5}
              separator={<span>--</span>}
              inputStyle="otp-input"
              isInputNum={true}
              shouldAutoFocus={true}
              InputProps={{
                sx: { fontSize: isMobile ? '12px' : '14px' }
              }}
              skipDefaultStyles={false}
              containerStyle="otp-container"
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: '45px', fontSize: isMobile ? '12px' : '14px' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ادامه'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialogForceUpdate;
