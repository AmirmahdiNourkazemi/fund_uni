import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Divider, TextField,RadioGroup,List, ListItem, Collapse, FormControlLabel,
  Radio,Snackbar, Alert, IconButton, ListItemText , useMediaQuery,Avatar , CircularProgress , Button} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Navigate, useNavigate } from 'react-router-dom';
import CoinIcon from '@mui/icons-material/MonetizationOn';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HouseIcon from '@mui/icons-material/House';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ListIcon from '@mui/icons-material/List';
import ShareIcon from '@mui/icons-material/Share';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Logout from '@mui/icons-material/Logout';
import { fetchUserProfile , updateProfile } from '../../api/profile.js';
import PrivateInfoWidget from './PrivateInfoWidget.jsx';
import AddressWidget from './AddressWidget.jsx';
import BankAccountWidget from './BankAccountWidget.jsx';
import SnackbarComponent from '../../utils/SnackBar.jsx';
import Cookies from 'js-cookie';
import ShareWidget from './ShareWidget.jsx';
import { En_To_Fa, Add_Commas, Fa_To_En } from 'persian_util/build/parser';
import userLogo from '../../assets/images/user.png'
import InviteWidget from './InviteWidget.jsx';
import ForceUpdateWidget from './forceUpdateWidget.jsx'; 
import { Update } from '@mui/icons-material';
import ErrorDialog from '../ErrorDialog.jsx';
import { Warning } from '@phosphor-icons/react';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nationalCode, setNationalCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sajamCode, setSajamCode] = useState('');
  const [sajamCodeID, setSajamCodeID] = useState('');
  const [ibanCode, setIbanCode] = useState('');
  const [ibanCodeID, setIbanCodeID] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedType, setSelectedType] = useState('private');
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [customErrorMessage, setCustomErrorMessage] = useState('');
  const fontSize = isMobile ? '12px' : '14px';
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUser(userProfile);
        setSelectedType(userProfile.type === 1 ? 'private' : 'legal');
        if(userProfile.type === 1) {
          setNationalCode(userProfile.national_code || '');
          setFirstName(userProfile.private_person_info.first_name || '');
          setLastName(userProfile.private_person_info.last_name || '');
        }else { 
          setCompanyName(userProfile.full_name || '');
        }
        setMobile(userProfile.mobile || '');
        setNationalCode(userProfile.national_code || '');
        setSajamCode(userProfile.trading_accounts[0]?.code || '');
        setSajamCodeID(userProfile.trading_accounts[0]?.id || '');
        setIbanCode(userProfile.bank_accounts[0]?.iban || '');
        setIbanCodeID(userProfile.bank_accounts[0]?.id || '');
      } catch (err) {
        if (err.message === 'Unauthenticated.' || err.message === 'No token found') {
          navigate('/login', { state: { from: '/profile' } });
          localStorage.clear();
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    // console.log(Fa_To_En('۲۱۳۲۱۳۲۱۳')); 
    getUserProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const profileData = {};
  
    // Add fields to profileData only if they are not empty or null
    if (selectedType === 'private') {
      if (firstName) profileData.first_name = firstName;
      if (lastName) profileData.last_name = lastName;
    } else {
      if (companyName) profileData.company_name = companyName;
    }
  
    if (nationalCode) profileData.national_code = nationalCode;
    profileData.email = ''; // replace with actual email input if needed
    profileData.type = user.type;

      


 if (sajamCode) {
    const tradingCodes = [{ code: sajamCode }];
    if (sajamCodeID) {
      tradingCodes[0].id = sajamCodeID;
    }
    profileData.trading_codes = tradingCodes;
  }
  
    const bankAccounts = [{ iban: ibanCode }];
    if (ibanCodeID) {
      bankAccounts[0].id = ibanCodeID;
    }
    profileData.bank_accounts = bankAccounts;
  
    try {
      const result = await updateProfile(profileData);
      localStorage.setItem('userFullName', result.user.full_name);
      localStorage.setItem('userWallet', result.user.wallet);
      setSnackbarMessage('اطلاعات ویرایش شد!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      if (error.message === "کد ملی وارد شده سجامی نیست") {
        setCustomErrorMessage();
        setErrorDialogOpen(true);

      }
      if (error.message === 'Unauthenticated.' || error.message === 'No token found') {
        navigate('/login', { state: { from: '/signup' } });
        localStorage.clear();
      }
      setError(error);
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress sx={{ color: 'white' }} />;
  }

  // if (error) {
  //   return (
  //     <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  //       <Typography color="error">Error: {error}</Typography>
  //     </Container>
  //   );
  // }

  return (
    
  <div>
      <Container sx={{ mt: 7, width: { xs: '100%', sm: '600px', md: '600px' } }}>
      <Box sx={{ height: 50 }} />
      <Box sx={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: 3, padding: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
            <Avatar src={userLogo} alt="" sx={{ marginLeft: 2 }} />
            <div style={{display:'flex'  , width:'100%',justifyContent:'space-between' , justifyItems:'center', alignItems:'center'}}>
            <Box ml={2}>
              <Typography sx={{ fontSize: isMobile ? 14 : 15, fontWeight: 'bold' }}>مشخصات فردی</Typography>
              
            </Box>
            {/* <Button variant="outlined" color="primary"  onClick={()=>{
              Cookies.remove("flutter.token");
              Cookies.remove("flutter.mobile");
              Cookies.remove("flutter.netCode");
              navigate('/login');
            }}>
              خروج
            </Button> */}
            </div>
          </Box>

        <form onSubmit={handleSubmit}>
          {selectedType === 'private' ? (
            <>
              <TextField
                id="firstName"
                label="نام"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
              <TextField
                id="lastName"
                label="نام خانوادگی"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
          ) : (
            <TextField
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
          )}
   <TextField
            id="nationalCode"
            label="شماره موبایل"
            value={mobile}
            
            onChange={(e) => {
              const value =Fa_To_En(e.target.value)
              if (value.length <= 11) { // Assuming national code should be max 10 characters
                setNationalCode(value)
              }
            }}
            fullWidth
            size="medium"
            InputProps={{
              readOnly: true,
            }}
            inputProps={{
              
              style: {  fontSize, inputMode: 'numeric'},
            }}
            required
            InputLabelProps={{
              sx: { fontSize },
            }}
            sx={{backgroundColor:'#f2f2f2'}}
            margin="normal"
          />
          <TextField
            id="nationalCode"
            label="کد ملی"
            value={nationalCode}
            
            onChange={(e) => {
              const value =Fa_To_En(e.target.value)
              if (value.length <= 10) { // Assuming national code should be max 10 characters
                setNationalCode(value)
              }
            }}
            fullWidth
            size="medium"
            InputProps={{
              readOnly: true,
            }}
            inputProps={{
              
              style: {  fontSize, inputMode: 'numeric'},
            }}
            required
            InputLabelProps={{
              sx: { fontSize },
            }}
            sx={{backgroundColor:'#f2f2f2'}} 
            margin="normal"
          />
          <div>
          <TextField
            id="sajamCode"
            label="کد بورسی"
            value={sajamCode}
            required
            onChange={(e) => setSajamCode(e.target.value)}
            fullWidth
            size="medium"
           
            InputProps={{
              sx: { fontSize },
            }}
            InputLabelProps={{
              sx: { fontSize },
            }}
            margin="normal"
          />
           <div style={{display:'flex' , alignItems:'center'}}>
          <Warning  color='#074EA0'/>
          <a href="https://profilesejam.csdiran.ir/session" target='_blank' style={{ fontSize , marginRight:'3px' , color:'#074EA0' }}>پیدا کردن کد بورسی</a></div>
        </div>
          
          <TextField
            id="iban"
            label="شماره شبا"
            value={ibanCode}
            onChange={(e) => {
              let value = Fa_To_En(e.target.value)
              if (value.length <= 26) { // Assuming national code should be max 10 characters
              if (!value.includes('IR')) {
                value = 'IR' + value;
              }   
                setIbanCode(value)
              }
            }}
            fullWidth
            placeholder="---- ---- ---- ---- IR"
            size="medium"
            required
            inputProps={{
              style: { textAlign: 'center', fontSize, inputMode: 'numeric' },
            }}
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
                'ویرایش'
              )}
            </Button>


            <Button
              
              variant="outlined"
           onClick={()=>{
            navigate('/profile')
           }}
              fullWidth
              sx={{ height: '45px', fontSize: isMobile ? '12px' : '14px' ,mt:1 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'انصراف'
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
      </Box>
      <Box sx={{ height: 50 }} />
      <ErrorDialog
          isOpen={errorDialogOpen}
          onRequestClose={() => setErrorDialogOpen(false)}
          customMessage={customErrorMessage}
          sx={{ zIndex: 1300 }}
        />
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
    <Box sx={{height:'90px'}}>

    </Box>
  </div>
  );
};

export default ProfileScreen;