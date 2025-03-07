// src/components/LoginForm.jsx
import React, { useState, useEffect } from "react";
import { loginWithOtp } from "../api/auth";
import logo from "../assets/images/logo1.png";
import { parse } from "persian_util";
import OTPDialog from "./OTPDialog.jsx";
import ErrorDialog from "./ErrorDialog.jsx";
import Cookies from "js-cookie";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SnackbarComponent from "../utils/SnackBar.jsx";
import {
  TextField,
  Button,
  CircularProgress,
  Container,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { captchaSiteKey } from "../const.js";
const LoginForm = () => {
  const [nationalCode, setNationalCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [customErrorMessage, setCustomErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [tempToken, setTempToken] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false); // State to show CAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [dialogShowCaptch, setDialogShowCaptch] = useState(false);
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
  const [otpCountdown, setOtpCountdown] = useState(0); // State for OTP dialog countdown
  const [isOtpDisabled, setIsOtpDisabled] = useState(false); // State to disable OTP input

  const { uuid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  // console.log(from);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Close the keyboard
    document.activeElement.blur();

    try {
      const result = await loginWithOtp(
        parse.Fa_To_En(mobile),
        parse.Fa_To_En(nationalCode),
       
      );
      setTempToken(result.token);
      Cookies.set("flutter.token", result.token, {
        sameSite: "strict",
      });
      Cookies.set(
        "flutter.netCode",
        result.user.national_code === null ? "" : result.user.national_code,
        { sameSite: "strict" }
      );
      Cookies.set("flutter.mobile", result.user.mobile, {
       
        sameSite: "strict",
      });
      localStorage.setItem(
        "userFullName",
        result.user.name === null ? "" : result.user.name
      );
      localStorage.setItem(
        "userMobile",
        result.user.mobile === null ? "" : result.user.mobile
      );
      localStorage.setItem(
        "userNational",
        result.user.national_code === null ? "" : result.user.national_code
      );
      localStorage.setItem(
        "userWallet",
        result.user.wallet === null ? "" : result.user.wallet
      );
      navigate("/")
    } catch (error) {
      if (error.data.message === "کد ملی وارد شده سجامی نیست") {
        setCustomErrorMessage();
        setErrorDialogOpen(true);
      }
       else {
        setError(error.data.message || "Login failed");
        setSnackbarMessage(error.data.message.toString());
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };
 
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Container
      maxWidth="xs"
      sx={{
        width: "80%",

        background: "white",
        borderRadius: "10px",
        boxShadow: 3,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <img
          src={logo}
          alt="Logo"
          style={{ marginBottom: "20px", width: "100px" }}
        />
        <Typography sx={{ fontSize: isMobile ? "14px" : "h8" }} gutterBottom>
          لطفا موارد زیر را وارد کنید:
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            variant="outlined"
            label="شماره موبایل"
            style={{ fontSize: isMobile ? "12px" : "14px" }}
            inputProps={{ inputMode: "numeric" }}
            value={mobile}
            size="medium"
            onChange={(e) => {
              setMobile(e.target.value);
            }}
            required
            InputProps={{
              sx: { fontSize: isMobile ? "12px" : "14px" },
            }}
            InputLabelProps={{
              sx: { fontSize: isMobile ? "12px" : "14px" },
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="کدملی/شناسه ملی"
            style={{ fontSize: isMobile ? "12px" : "14px" }}
            inputProps={{ inputMode: "numeric" }}
            value={nationalCode}
            size="medium"
            onChange={(e) => {
              setNationalCode(e.target.value);
            }}
            required
            InputProps={{
              sx: { fontSize: isMobile ? "12px" : "14px" },
            }}
            InputLabelProps={{
              sx: { fontSize: isMobile ? "12px" : "14px" },
            }}
            margin="normal"
          />

          
          <Box mt={2} mb={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: "45px", fontSize: isMobile ? "12px" : "14px" }}
              disabled={loading || isButtonDisabled} // Disable button during loading or countdown
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isButtonDisabled ? (
                `لطفا ${countdown} ثانیه صبر کنید ` // Show countdown when button is disabled
              ) : (
                "ورود"
              )}
            </Button>
            <Box mt={2} mb={2}>
            <Button
              onClick={() => navigate("/signup")}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ height: "45px", fontSize: isMobile ? "12px" : "14px" }}
              disabled={loading || isButtonDisabled} // Disable button during loading or countdown
            >
            <Typography >ثبت نام</Typography>
            </Button>
            </Box>
          </Box>
        </form>
       
        <ErrorDialog
          isOpen={errorDialogOpen}
          onRequestClose={() => setErrorDialogOpen(false)}
          customMessage={customErrorMessage}
          sx={{ zIndex: 1300 }}
        />
      </Box>
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};
export default LoginForm;
