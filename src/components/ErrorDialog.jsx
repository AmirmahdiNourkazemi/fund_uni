// src/components/ErrorDialog.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Link , useMediaQuery} from '@mui/material';

const ErrorDialog = ({ isOpen, onRequestClose, customMessage }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Dialog
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle sx={{fontSize:isMobile ? '14px' : 'h8'}} id="error-dialog-title">لطفا در سامانه سجام ثبت نام کنید</DialogTitle>
      <DialogContent>
        <Typography sx={{fontSize:isMobile ? '14px' : 'h8'}} id="error-dialog-description">
          برای ثبت نام در سامانه روی لینک{' '}
          <Link href="https://profilesejam.csdiran.ir/session" target="_blank" rel="noopener noreferrer">
            کلیک
          </Link>{' '}
          کنید
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onRequestClose} color="primary">
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
