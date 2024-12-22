import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { En_To_Fa, Add_Commas, Fa_To_En } from "persian_util/build/parser";
import SnackbarComponent from "../../utils/SnackBar.jsx";
import { storeCompanies } from "../../api/company.js";
import Timeline from "./timeLine.jsx";
import Footer from "../home/Fotter.jsx";
import { captchaSiteKey } from "../../const.js";
import ReCAPTCHA from "react-google-recaptcha"; 
const CompanyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    agent_name: "",
    field: "",
    phone_number: "",
    fund_needed: "",
    anual_income: "",
    profit: "",
    bounced_check: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [showCaptcha, setShowCaptcha] = useState(false); // State to show CAPTCHA
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
  const isMobile = useMediaQuery("(max-width: 900px)");
  const fontSize = isMobile ? "12px" : "14px";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleMobileChange = (event) => {
    const { name, value } = event.target;
    if (value.length <= 11) {
      setFormData({
        ...formData,
        [name]: Fa_To_En(value),
      });
    }
  };
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Update token with CAPTCHA verification result
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await storeCompanies(
        formData.title,
        formData.description,
        formData.agent_name,
        formData.field,
        formData.phone_number,
        formData.fund_needed,
        formData.anual_income,
        formData.profit,
        formData.bounced_check,
        recaptchaToken
      );
      setSnackbar({
        open: true,
        message: "اطلاعات شما با موفقیت ثبت شد",
        severity: "success",
      });
      setFormData({
        title: "",
        description: "",
        agent_name: "",
        field: "",
        phone_number: "",
        fund_needed: "",
        anual_income: "",
        profit: "",
        bounced_check: "",
      });
    } catch (error) {
      console.log(error.status);
      setLoading(false);
      if (
        error.message === "Unauthenticated." ||
        error.data.message === "No token found"
      ) {
        navigate("/login", { state: { from: `/companies` } });
        localStorage.clear();
      } 
      if (error.status == 423) {
        setShowCaptcha(true);
        setSnackbarMessage("لطفا کپچا را تایید کنید");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }else if (error.status == 429) {
        setCountdown(60); // Set the countdown to 60 seconds
        setIsButtonDisabled(true); // Disable the button
      }
       
      else  {
          setSnackbarMessage(error.data.message.toString());
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        }
    }

    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        <Box
          sx={{
            px: 3,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#2282ED",
            width: "300px",
            borderRadius: "10px",
            height: isMobile ? "200px" : "700px",
            justifyContent: "center",
            justifyItems: "center",
            margin: isMobile ? null : "auto 0",
            marginTop: isMobile ? "90px" : null,
            mx: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{ lineHeight: isMobile ? 2 : 4, color: "white" }}
          >
            فرم درخواست بررسی طرح :
          </Typography>
          <Typography sx={{ lineHeight: 2.5, color: "white", fontSize }}>
            متقاضی گرامی، در صورت تمایل به تامین سرمایه مورد نیاز برای طرح خود
            از طریق سکوی تامین مالی جمعی اسمارت فاندینگ، فرم زیر را تکمیل
            فرمایید. همکاران ما در اولین فرصت با شما تماس می‌گیرند و در صورت
            تایید اولیه طرح برای مراحل بعدی شما را راهنمایی می‌کنند.
          </Typography>
        </Box>
        <Box
          sx={{
            p: 3,
            margin: "auto",
            width: isMobile ? null : "800px",
            mt: isMobile ? 0 : 15,
            borderRadius: "10px",
            direction: "rtl",
            textAlign: "right",
          }}
        >
          <div dir="rtl">
            <form onSubmit={handleSubmit}>
              <TextField
                label="نام شرکت"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2, fontSize, textAlign: "right" }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize, textAlign: "right" },
                }}
                inputProps={{ style: { fontSize, textAlign: "right" } }}
              />
              <TextField
                label="نام نماینده"
                name="agent_name"
                required
                value={formData.agent_name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2, fontSize }}
                InputLabelProps={{ style: { fontSize } }}
                inputProps={{ style: { fontSize } }}
              />

              <TextField
                select
                label="سرمایه مورد نیاز"
                name="fund_needed"
                required
                value={formData.fund_needed}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2, fontSize }}
                InputLabelProps={{ style: { fontSize } }}
                inputProps={{ style: { fontSize } }}
              >
                <MenuItem sx={{ fontSize }} value="1">
                  تا 2 میلیارد تومان
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="2">
                  2 تا 5 میلیارد تومان
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="3">
                  5 تا 10 میلیارد تومان
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="4">
                  بیش از 10 میلیارد تومان
                </MenuItem>
              </TextField>
              <TextField
                select
                label="درآمد سالیانه"
                name="anual_income"
                value={formData.anual_income}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={{ mb: 2, fontSize }}
                InputLabelProps={{ style: { fontSize } }}
                inputProps={{ style: { fontSize } }}
              >
                <MenuItem sx={{ fontSize }} value="1">
                  تا 5 میلیارد تومان
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="2">
                  5 تا 10 میلیارد تومان
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="3">
                  10 تا 20 میلیارد تومان
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="4">
                  بیش از 20 میلیارد تومان
                </MenuItem>
              </TextField>
              <TextField
                select
                label="وضعیت سود و زیان شرکت در سال گذشته"
                name="profit"
                value={formData.profit}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2, fontSize }}
                InputLabelProps={{ style: { fontSize } }}
                inputProps={{ style: { fontSize } }}
              >
                <MenuItem sx={{ fontSize }} value="1">
                  زیان ده بوده است{" "}
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="2">
                  سود ده بوده است
                </MenuItem>
              </TextField>
              <TextField
                select
                label="وضعیت چک برگشتی سرمایه‌پذیر و اعضای هیئت مدیره"
                name="bounced_check"
                value={formData.bounced_check}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2, fontSize }}
                inputProps={{ style: { fontSize } }}
                InputLabelProps={{ style: { fontSize } }}
              >
                <MenuItem sx={{ fontSize }} value="1">
                  چک برگشتی داریم و هنوز رفع سوء اثر نشده
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="2">
                  چک برگشتی نداریم
                </MenuItem>
                <MenuItem sx={{ fontSize }} value="3">
                  چک برگشتی داشتیم اما رفع سوء اثر شده
                </MenuItem>
              </TextField>
              <TextField
                label="زمینه فعالیت"
                name="field"
                value={formData.field}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={{ mb: 2, fontSize }}
                inputProps={{ style: { fontSize } }}
                InputLabelProps={{ shrink: true, style: { fontSize } }}
              />
              <TextField
                label="شماره همراه"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleMobileChange}
                fullWidth
                required
                variant="outlined"
                sx={{ mb: 2, fontSize }}
                inputProps={{ style: { fontSize } }}
                InputLabelProps={{ style: { fontSize } }}
              />
              <TextField
                label="شرح مختصر طرح"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                sx={{ mb: 1 }}
                inputProps={{ style: { fontSize } }}
                InputLabelProps={{ style: { fontSize } }}
              />
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
                sx={{ mt: 2, fontSize, mb: 4 }}
                disabled={loading}
              >
                {loading ? (
                <CircularProgress size={24} />
              ) : countdown > 0 ? (
                `لطفا ${countdown} ثانیه صبر کنید` // Show countdown when active
              ) : (
                'ثبت درخواست'

              )}
              </Button>
            </form>
            <SnackbarComponent
              open={snackbar.open}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              message={snackbar.message}
              severity={snackbar.severity}
            />
          </div>
          <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
        </Box>
      </Box>
      <Timeline></Timeline>
      <Box sx={{ height: "50px" }} />
      <Footer />
      <Box sx={{ height: "50px" }} />
      
    </Box>
    
  );
};

export default CompanyForm;
