import React, { useState , useEffect} from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material';
import { useNavigate   , useParams} from 'react-router-dom';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { storeTicket } from '../../api/ticket.js'; // Ensure the API function is correctly imported
import { captchaSiteKey } from '../../const.js';
import ReCAPTCHA from "react-google-recaptcha"; 
const SnackbarComponent = ({ open, onClose, message, severity }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Snackbar
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={onClose}
    >
      <Alert severity={severity} sx={{ width: isMobile ? '200px' : '100%', justifyContent: 'center', justifyItems: 'center' }}>
        <Typography variant="h7" style={{ marginRight: '5px' }}>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

const InputTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [errorMessage, setErrorMessage] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false); // State to show CAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';
  const navigate = useNavigate();
  const {uuid} = useParams();
  useEffect(() => {
    if (uuid) {
      setCategory(uuid);
    } else {
      setCategory(1);
    }
  }, [uuid]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsButtonDisabled(false); // Re-enable button after countdown ends
    }
  }, [countdown]);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Update token with CAPTCHA verification result
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description) {
      setErrorMessage('لطفا همه فیلدها را پر کنید');
      return;
    }

    setLoading(true);
    try {
      const response = await storeTicket( title, description, category , recaptchaToken);
      setTitle('');
      setDescription('');
      setCategory(1);
      setSnackbarMessage('تیکت شما با موفقیت ثبت شد');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // history.goBack()
    } catch (error) {
      if (error.status == 423) {
        setShowCaptcha(true);
        setSnackbarMessage("لطفا کپچا را تایید کنید");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }else if (error.status == 429) {
        setCountdown(60); // Set the countdown to 60 seconds
        setIsButtonDisabled(true); // Disable the button
      }
       else {
        setSnackbarMessage(error.data.message.toString());
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
       }
     
     
    }
    setLoading(false);
  };

  const handleBack = () => {
    // Navigate back to the MessageBox component
  };

  return (
    <Container  sx={{backgroundColor:'white',p:2,borderRadius:3 , width:isMobile ? '300px' : '900px'}}>
      
      <Typography variant='h7' sx={{lineHeight:isMobile?2:4 ,display:'flex',justifyContent:'center'}}>
  ثبت تیکت   
   </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="عنوان"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          style={{ fontSize }}
          InputProps={{
            sx: { fontSize }
          }}
          InputLabelProps={{
            sx: { fontSize}
          }}
          margin="normal"
          required
        />
        <TextField
          label="توضیحات"
          style={{ fontSize }}
          value={description}
          InputProps={{
            sx: { fontSize }
          }}
          InputLabelProps={{
            sx: { fontSize}
          }}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline

          rows={4}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">انتخاب دسته بندی</InputLabel>
          <Select
           
            labelId="category-label"
            value={category}
            defaultValue={uuid}
            defaultChecked={uuid}
          
            sx={{fontSize}}
             MenuProps={{sx:{
                fontSize,
                
             }}}

            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem  sx={{fontSize}} value={1}>پشتیبانی فنی</MenuItem>
            <MenuItem  sx={{fontSize}} value={2}>پشتیبانی فروش</MenuItem>
            <MenuItem  sx={{fontSize}} value={3}>ثبت تخلف</MenuItem>
          </Select>
        </FormControl>
        {showCaptcha && (
            <Box
              mt={2}
              mb={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <ReCAPTCHA
                sitekey={captchaSiteKey} // Replace with your Google reCAPTCHA site key
                onChange={handleRecaptchaChange}
              />
            </Box>
          )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 , fontSize}}
          disabled={loading || isButtonDisabled}
        >
           {loading ? (
                <CircularProgress size={24} />
              ) : countdown > 0 ? (
                `لطفا ${countdown} ثانیه صبر کنید` // Show countdown when active
              ) : (
                'ثبت تیکت'

              )}
        </Button>
      </form>

      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};

export default InputTicket;
