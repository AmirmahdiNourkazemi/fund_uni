import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  InputAdornment,
  Icon,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack, Send } from "@mui/icons-material";
import JalaliDateConverter from "../../utils/PersianDateConverter.jsx";
import SnackbarComponent from "../../utils/SnackBar.jsx";
import { getTicketByUUID, storeMessage } from "../../api/ticket.js";
import ReCAPTCHA from "react-google-recaptcha";
import { captchaSiteKey } from "../../const.js";
const ChatBox = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false); // State to show CAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const isMobile = useMediaQuery("(max-width: 900px)");
  const fontSize = isMobile ? "12px" : "14px";
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const messagesEndRef = useRef(null);

  const loadTicket = async () => {
    try {
      const response = await getTicketByUUID(uuid);
      setTicket(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error === "Unauthenticated." || error === "No token found") {
        navigate("/login", { state: { from: `/chat/${uuid}` } });
        localStorage.clear();
      }
      setSnackbar({
        open: true,
        message: "خطا در بارگذاری اطلاعات تیکت",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadTicket();
  }, [uuid]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket]);
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

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        await storeMessage(uuid, message , recaptchaToken);
        await loadTicket();
        setMessage("");
        setSnackbar({
          open: true,
          message: "پیام شما با موفقیت ارسال شد",
          severity: "success",
        });
      } catch (error) {
        if (error.status == 423) {
          setShowCaptcha(true);
          setSnackbarMessage("لطفا کپچا را تایید کنید");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        } else if (error.status == 429) {
          setCountdown(60); // Set the countdown to 60 seconds
          setIsButtonDisabled(true); // Disable the button
        }
      else {
        
        setSnackbarMessage(error.data.message.toString());
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      }
    }
  };
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); 
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box mt={12} mb={2}>
        <Paper elevation={1} style={{ padding: "16px" }}>
          <Typography sx={{ fontSize }}>{ticket.user.full_name}</Typography>
          <Typography sx={{ fontSize, mt: 1 }}>
            موضوع: {ticket.title}
          </Typography>
          <Typography sx={{ fontSize, mt: 1 }}>
            توضیحات: {ticket.description}
          </Typography>
          <Typography sx={{ fontSize, mt: 1 }}>
            تاریخ: <JalaliDateConverter isoDate={ticket.created_at} />
          </Typography>
        </Paper>
      </Box>
      <Typography>پیام ها:</Typography>
      <List style={{ maxHeight: "60vh", overflow: "auto" }}>
        {ticket.messages.map((msg, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemText
              primaryTypographyProps={{ fontSize }}
              secondaryTypographyProps={{ fontSize, mt: 2 }}
              primary={msg.user ? `${msg.user.full_name}` : "ناشناس"}
              secondary={`پیام: ${msg.text}`}
            />
            <Typography sx={{ fontSize }}>
              تاریخ ارسال: <JalaliDateConverter isoDate={msg.created_at} />
            </Typography>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <Box sx={{ height: "90px" }}></Box>
      {ticket.status !== 3 && (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          sx={{
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            mt: 2,
            position: "fixed",
            bottom: isMobile ? 50 : 10,
            width: isMobile ? "100%" : "60%",
            left: isMobile ? 0 : null,
            flexDirection: "column",
            borderRadius: "10px",
          }}
        >
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
          <TextField
            fullWidth
            multiline
            rows={1}
            variant="outlined"
            label="پیام"
            value={message}
            InputLabelProps={{
              sx: { fontSize },
            }}
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{
              sx: { fontSize },
              startAdornment: isButtonDisabled ? (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize, color: "red" }}>
                    {`لطفا  ${countdown} ثانیه صبر کنید    `} </Typography>
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <IconButton type="submit" color="primary">
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};

export default ChatBox;
