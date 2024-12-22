// src/components/OTPDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  Box,
} from "@mui/material";
import OtpInput from "react-otp-input";
import "../styles/OTPDialog.css";
import {
  ArrowArcLeft,
  ArrowCircleLeft,
  ArrowLeft,
} from "@phosphor-icons/react";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA component
import { captchaSiteKey } from "../const";

const OTPDialog = ({
  isOpen,
  onRequestClose,
  onSubmit,
  showCaptcha,
  otpCountdown,
  isOtpDisabled,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [dialogRecaptchaToken, setDialogRecaptchaToken] = useState(""); // Token from CAPTCHA
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(otp, dialogRecaptchaToken).finally(() => setLoading(false));
    onSubmit(otp, dialogRecaptchaToken).finally(() => setOtp(""));
  };

  const handleRecaptchaChange = (token) => {
    setDialogRecaptchaToken(token); // Update token with CAPTCHA verification result
  };

  const handleBackdropClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (otp.length === 5 && !isOtpDisabled) {
      handleSubmit(new Event("submit"));
    }
    if ("OTPCredential" in window) {
      const ac = new AbortController();

      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          setOtp(otp.code); // Autofill OTP
          ac.abort();
        })
        .catch((err) => {
          ac.abort();
          console.error("OTP autofill error:", err);
        });
    }
  }, [otp, isOtpDisabled]);

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="otp-dialog-title"
      disableBackdropClick
    >
      <div
        style={{
          display: "flex",
          alignContent: "space-between",
          width: "100%",
          justifyContent: "space-between",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <DialogTitle
          sx={{ fontSize: isMobile ? "14px" : "16px" }}
          id="otp-dialog-title"
        >
          <Typography>کد ورود</Typography>
        </DialogTitle>
        <div style={{ paddingLeft: 10 }}>
          <ArrowLeft
            onClick={onRequestClose}
            size={25}
            weight="light"
          ></ArrowLeft>
        </div>
      </div>
      <DialogContent>
        <Typography sx={{ fontSize: isMobile ? "12px" : "14px" }} gutterBottom>
          لطفا کد ارسال شده را وارد کنید
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <OtpInput
              value={otp}
              onChange={setOtp}
              inputType="number"
              numInputs={5}
              separator={<span>--</span>}
              inputStyle="otp-input"
              isInputNum={true}
              shouldAutoFocus={true}
              InputProps={{
                sx: { fontSize: isMobile ? "12px" : "14px" },
              }}
              skipDefaultStyles={false}
              containerStyle="otp-container"
              renderInput={(props, index) => (
                <input
                  {...props}
                  autocomplete={"one-time-code"} // Apply only to the first input
                  inputMode="numeric" // Ensure it's numeric input
                  // Make it required for form validation
                />
              )}
            />
          </div>

          {showCaptcha && ( // Conditionally render CAPTCHA
            <Box
              mt={2}
              mb={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <ReCAPTCHA
                sitekey={captchaSiteKey} // Your reCAPTCHA site key
                onChange={handleRecaptchaChange}
              />
            </Box>
          )}
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || isOtpDisabled} // Disable button during countdown
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : otpCountdown > 0 ? (
                `لطفا ${otpCountdown} ثانیه صبر کنید` // Show countdown when active
              ) : (
                "ادامه"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OTPDialog;
