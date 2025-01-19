import React, { useState , useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  useMediaQuery,
  CircularProgress,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useNavigate   } from 'react-router-dom';
import {updateProfile , fetchProfile} from '../../api/profile.js';
import SnackbarComponent from '../../utils/SnackBar.jsx';
import Cookies from 'js-cookie';
import { Siren, Warning, WarningCircle } from '@phosphor-icons/react';
import ErrorDialog from '../ErrorDialog.jsx';

const SignUp = () => {
  const [nationalCode, setNationalCode] = useState(localStorage.getItem('userNational'));
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [sajamCode, setSajamCode] = useState('');
  const [ibanCode, setIbanCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [user , setUser] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState('');
  const [selectedType, setSelectedType] = useState('private');
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [customErrorMessage, setCustomErrorMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    setSnackbarMessage('برای سرمایه گذاری در این سکو باید در ابتدا اطلاعات خود را تکمیل نمایید');
    setSnackbarSeverity('warning');
    setSnackbarOpen(true);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const profileData = {};

    if(selectedType === 'private'){
      profileData.type = true;
    }else  {
      profileData.type = false;
    }

    // Add fields to profileData only if they are not empty or null
    if (selectedType === 'private') {
      if (name) profileData.name = name;
    } else {
      if (companyName) profileData.name = companyName;
    }
  
    if (nationalCode) profileData.national_code = nationalCode;
    if (mobile) profileData.mobile = mobile;
  
    try {
      const result = await updateProfile(profileData);
      setUser(result)
      Cookies.set(
              "flutter.netCode",
              result.user.national_code === null ? "" : result.user.national_code,
              { sameSite: "strict" }
            );
      Cookies.set("flutter.token", result.token, {
        sameSite: "strict",
      });
      Cookies.set("flutter.mobile", result.user.mobile, {
        sameSite: "strict",
      });
      localStorage.setItem('userFullName', result.user.name);
      localStorage.setItem('userMobile', result.user.mobile);
      navigate('/');
      
    } catch (error) {
// console.log(user.message.status)
      if (error.message === "کد ملی وارد شده سجامی نیست") {
        setCustomErrorMessage();
        setErrorDialogOpen(true);

      }

      if (error.message === 'Unauthenticated.' || error.message === 'No token found') {
        navigate('/login',{ state: { from: '/signup' } });
        localStorage.clear();

      }
      setError(error);
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
   <div>
 <Container
      maxWidth="md"
      sx={{
        width: '80%',
        backgroundColor: 'white',
        background: 'white',
        borderRadius: '10px',
        boxShadow: 3,
        p:3,
        mt:isMobile ? 12 : 14
      }}
    >
      <form onSubmit={handleSubmit}>
     
         
        <Typography  color="initial" sx={{mb:2 , fontSize:isMobile ? '14px' : "18px",display:'flex' , alignItems:'center'  , gap:'5px' }}><Warning size={18} weight='regular' color='primary'></Warning>لطفا موارد زیر را تکمیل کنید: </Typography>

        
        <Typography sx={{fontSize}} gutterBottom>
          شما شخص حقیقی یا حقوقی هستید؟
        </Typography>
        <RadioGroup
        style={{fontSize}}
        sx={{fontSize}}
      
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          row
        >
          <FormControlLabel  value="private" sx={{fontSize}} control={<Radio />} label={<Typography sx={{ fontSize }}>حقیقی</Typography>}  />
          <FormControlLabel value="legal" sx={{fontSize}} control={<Radio />} label={<Typography sx={{ fontSize }}>حقوقی</Typography>}  />
        </RadioGroup>

        {selectedType === 'private' ? (
          <>
            <TextField
              id="name"
              label="نام و نام خانوادگی"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="medium"
              required
              InputProps={{
                sx: { fontSize },
              }}
              InputLabelProps={{
                sx: { fontSize },
              }}
              margin="normal"
            />
           
          </>
        ):<TextField
        id="companyName"
        label="نام شرکت"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        fullWidth
        size="medium"
        required
        InputProps={{
          sx: { fontSize },
        }}
        InputLabelProps={{
          sx: { fontSize },
        }}
        margin="normal"
      />
      }

       {selectedType === 'private' ? 
        <TextField
          id="nationalCode"
          label="کد ملی"
          value={nationalCode}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 10) { // Assuming national code should be max 10 characters
              setNationalCode(value);
            }
          }}
          fullWidth
          size="medium"
          inputProps={{
            style: { fontSize, inputMode: 'numeric' ,maxLength:10 },
          }}
          required
          InputLabelProps={{
            sx: { fontSize },
          }}
         
          margin="normal"
        /> : 
        <TextField
          id="nationalCode"
          label="شناسه ملی"
          value={nationalCode}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 11) { // Assuming national code should be max 10 characters
              setNationalCode(value);
            }
          }}
          fullWidth
          size="medium"
          inputProps={{
            style: { fontSize, inputMode: 'numeric' ,maxLength:10 },
          }}
          required
          InputLabelProps={{
            sx: { fontSize },
          }}
          
      
          margin="normal"
        />

       } 
        
        <TextField
          id="mobile"
          label="شماره موبایل"
          value={mobile}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 11) { // Assuming national code should be max 10 characters
              setMobile(value);
            }
          }}
          fullWidth
          size="medium"
          inputProps={{
            style: { fontSize, inputMode: 'numeric' ,maxLength:11 },
          }}
          required
          InputLabelProps={{
            sx: { fontSize },
          }}
          margin="normal"
        />

        <Box my={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '45px', fontSize: isMobile ? '12px' : '14px' }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'ثبت نام'
            )}
          </Button>
        </Box>
      </form>
     
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      
    </Container>
    <ErrorDialog
          isOpen={errorDialogOpen}
          onRequestClose={() => setErrorDialogOpen(false)}
          customMessage={customErrorMessage}
          sx={{ zIndex: 1300 }}
        />
    <Box sx={{height:'90px'}}></Box>
   </div>
   
  );
};

export default SignUp;
