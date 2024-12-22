import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Dialog,
  DialogContent,
  useMediaQuery,
} from "@mui/material";
import { Clipboard, Trash, X } from "@phosphor-icons/react";
import { DatePicker } from "jalaali-react-date-picker";
import { En_To_Fa, Add_Commas, Fa_To_En , numberToWord } from "persian_util/build/parser";
import { getDeposit, storeTrackDeposit } from "../../../api/payment.js";
import "jalaali-react-date-picker/lib/styles/index.css";
import SnackbarComponent from "../../../utils/SnackBar.jsx";
import moment from "moment-jalaali";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import JalaliDateConverter from "../../../utils/PersianDateConverter.jsx";
import { Border } from "@syncfusion/ej2-react-lineargauge/index.js";
import { CloudUpload } from "@mui/icons-material";
import "../../../styles/withdrawPage.css";
import empty from "../../../assets/images/empty.json";
import Lottie from "lottie-react";
import formatNumberInWords from "../../../utils/format.jsx";
const TrackDeposit = ({ project }) => {
  const [birthClick, setBirthClick] = useState(false);
  const [pickedDate, setPickedDate] = useState(null);
  const [amount, setAmount] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [date, setDate] = useState("");
  const { id } = useParams();
  const [jalaliDate, setJalaliDate] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numberInWords, setNumberInWords] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null); // New state for file
  const [imagePreview, setImagePreview] = useState(""); // New state for image preview
  const [showFileInput, setShowFileInput] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const fontSize = isMobile ? "12px" : "14px";
  const location = useLocation();
  const from = location.state?.from;
  // Fetch deposits on component mount
  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const result = await getDeposit();
        setDeposits(result.data || []);
        setLoading(false);
      } catch (error) {
        if (
          error.message === "Unauthenticated." ||
          error.message === "No token found"
        ) {
          navigate("/login", { state: { from: "/deposit" } });
          localStorage.clear();
        }
      }
    };
    fetchDeposits();
  }, []);

  // Handle date change from the date picker
  const handleDateChange = (date, dateString) => {
    setPickedDate(date);
    setDate(dateString);
    const jalaliFormattedDate = moment(date).format("jYYYY/jMM/jDD");
    setJalaliDate(jalaliFormattedDate);
    setDatePickerOpen(false);
  };

  // Handle amount change and format it
 // Handle amount change and format it
const handleAmountChange = (event) => {
  const { value } = event.target;

  // Remove non-numeric characters and format the number with commas
  const formattedValue = value
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  setAmount(formattedValue);

  if (formattedValue === "") {
    setNumberInWords(""); // Handle empty input case
  } else {
    // Parse the numeric value after removing commas
    const numericValue = parseInt(value.replace(/,/g, ""), 10);

    if (!isNaN(numericValue) && numericValue >= 0) {
      // Add a range check for the numberToWord function
      try {
        const amountInWords = numberToWord(numericValue); // Ensure numericValue is within the valid range
        setNumberInWords(formatNumberInWords(amountInWords));
      } catch (error) {
       
        setNumberInWords("Number out of range");
      }
    } else {
      setNumberInWords("Invalid input");
    }
  }
};

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (event) => {
    event.stopPropagation();
    setSelectedFile(null);
    setImagePreview("");
  };
  // Handle form submission
  const handleSubmit = async () => {
    const parsedAmount = parseInt(Fa_To_En(amount.replace(/,/g, "")));
    if (!parsedAmount || !trackingCode || !date || !selectedFile) {
      setSnackbar({
        open: true,
        message: "لطفاً تمامی فیلدها را پر کنید",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await storeTrackDeposit(
        id,
        parsedAmount,
        trackingCode,
        date,
        selectedFile
      );
      const result = await getDeposit();
      setDeposits(result.data || []);
      setSnackbar({
        open: true,
        message: "اطلاعات با موفقیت ثبت شد",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({ open: true, message: error.data.message, severity: "error" });
    }
    setLoading(false);
  };
  // Handle clearing of input fields
  const handleClear = (setter) => () => setter("");

  return (
    <Box
      sx={{
        mt: isMobile ? 12 : 14,
        backgroundColor: "white",
        p: 2,
        borderRadius: 3,
      }}
    >
      {deposits.length > 0 && deposits[0].status == 1 ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Lottie
              animationData={empty}
              loop={true}
              style={{ width: isMobile ? "200px" : "250px" }}
            />
            {deposits.length > 0 && deposits[0].project != null ? (
              <>
                <Typography sx={{ fontSize }} color="error">
                  درخواست خرید شما برای طرح {deposits[0].project.title} با
                  موفقیت ثبت شد. به محض بررسی و تایید فیش واریزی توسط کارشناسان،
                  سرمایه گذاری شما نهایی خواهد شد و از طریق پیامک اطلاع رسانی می
                  گردد.
                </Typography>
              </>
            ) : (
              <>
                <Typography sx={{ fontSize }} color="error">
                  درخواست خرید شما با موفقیت ثبت شد. به محض بررسی و تایید فیش
                  واریزی توسط کارشناسان، سرمایه گذاری شما نهایی خواهد شد و از
                  طریق پیامک اطلاع رسانی می گردد.
                </Typography>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <Box style={{ padding: "16px", backgroundColor: "white" }}>
            <Typography sx={{ fontSize }} gutterBottom>
              راهنما و شماره حساب
            </Typography>
            <Typography sx={{ fontSize }} gutterBottom>
              لطفا برای مبلغ زیر 2۰۰ میلیون تومان از طریق پرداخت اینترنتی اقدام
              فرمایید. در صورت پرداخت از طریق بانک، اطلاعات فیش واریزی را در این
              قسمت ثبت نمایید.
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ fontSize }}>شماره حساب</Typography>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => navigator.clipboard.writeText("10115483932")}
                >
                  <Clipboard />
                </IconButton>
                <Typography sx={{ fontSize }}>
                  {En_To_Fa("10115483932")}
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ fontSize }}>شماره شبا</Typography>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() =>
                    navigator.clipboard.writeText("IR490700010002211548393002")
                  }
                >
                  <Clipboard />
                </IconButton>
                <Typography sx={{ fontSize }}>
                  {En_To_Fa("IR490700010002211548393002")}
                </Typography>
              </Box>
            </Box>
            <Box mt={2}>
              <Typography sx={{ fontSize }} color="error">
                درج کد/شناسه ملی پرداخت‌کننده در قسمت «شناسه پرداخت» فرم‌های
                پایا یا ساتنای واریز به حساب بانکی اسمارت فاندینگ الزامی است.
              </Typography>
            </Box>
          </Box>
          <Box mt={2}>
            <TextField
              label="مبلغ (تومان)"
              sx={{
                fontSize,
                textAlign: "center",
              }}
              helperText={
                <>
                  <Box
                    maxWidth="100%"
                    sx={{ display: "flex", width: "100%" }}
                  >
                    {numberInWords &&
                      `${numberInWords} تومان`}
                  </Box>
                </>
              }
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              InputLabelProps={{ sx: { fontSize } }}

              inputProps={{
                inputMode: "numeric",
              }}
              InputProps={{
                style: { textAlign: "center", fontSize },
                endAdornment: (
                  <IconButton onClick={handleClear(setAmount)}>
                    <X />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box mt={2}>
            <TextField
              label="کد رهگیری"
              style={{
                fontSize,
              }}
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              fullWidth
              InputLabelProps={{ sx: { fontSize } }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleClear(setTrackingCode)}>
                    <X />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box mt={2}>
            <TextField
              label="تاریخ"
              style={{
                fontSize,
              }}
              value={jalaliDate ? En_To_Fa(jalaliDate) : ""}
              onClick={() => setDatePickerOpen(true)}
              fullWidth
              InputLabelProps={{ sx: { fontSize } }}
              InputProps={{ readOnly: true, fontSize }}
            />
            <Dialog
              open={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
            >
              <DialogContent>
                <DatePicker
                  style={{ fontSize }}
                  value={pickedDate}
                  onChange={handleDateChange}
                  format="YYYY/MM/DD"
                  locale="fa"
                  fullWidth
                />
              </DialogContent>
            </Dialog>
          </Box>
          <Box mt={2}>
            {/* Custom file upload box */}
            <Paper
              sx={{
                border: "1px dashed #ccc",
                padding: "16px",
                textAlign: "center",
                position: "relative",
                cursor: "pointer",
                borderRadius: "8px",
                overflow: "hidden",
              }}
              onClick={() => {
                document.getElementById("file-input").click();
              }}
            >
              <CloudUpload size={24} color="#007bff" />
              <Typography sx={{ mt: 1, fontSize }}>
                لطفا تصویر را بارگزاری کنید
              </Typography>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {/* Display the image preview inside the Paper */}
              {imagePreview && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: "8px",
                  }}
                >
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "white",
                      borderRadius: "50%",
                      boxShadow: 1,
                    }}
                  >
                    <Trash color="#cc3300" />
                  </IconButton>
                  <img
                    src={imagePreview}
                    alt="Selected"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Box>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              disabled={loading}
              sx={{ fontSize }}
            >
              {loading ? <CircularProgress size={24} /> : "ثبت"}
            </Button>
          </Box>
        </>
      )}

      <Box mt={2} width={"95%"} mx={"auto"}>
        {deposits.length > 0 && (
          <Box sx={{ borderRadius: "10px" }}>
            {deposits.map((deposit, index) => (
              <React.Fragment key={index}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  marginBottom={2}
                  sx={{ backgroundColor: "#f2f2f2", borderRadius: "8px" }}
                >
                  <Box>
                    <Typography sx={{ fontSize, lineHeight: 3 }}>
                      مبلغ درخواستی:{" "}
                      {En_To_Fa(Add_Commas(deposit.amount.toString()))} تومان
                    </Typography>
                    <Typography sx={{ fontSize }}>
                      تاریخ ثبت:{" "}
                      {<JalaliDateConverter isoDate={deposit.created_at} />}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize,
                        color:
                          deposit.status === 1
                            ? "#000099"
                            : deposit.status === 2
                            ? "#00b359"
                            : "#cc3300",
                      }}
                    >
                      وضعیت:{" "}
                      {deposit.status === 1
                        ? "در حال بررسی"
                        : deposit.status === 2
                        ? "تایید شده"
                        : "لغو شده"}
                    </Typography>
                  </Box>
                </Box>
                {/* {index < deposits.length - 1 && <Divider />} */}
              </React.Fragment>
            ))}
          </Box>
        )}
      </Box>
      <Box sx={{ height: "90px" }}></Box>
      <SnackbarComponent
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default TrackDeposit;
