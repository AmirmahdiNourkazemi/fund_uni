import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "@phosphor-icons/react";
import SnackbarComponent from "../../utils/SnackBar.jsx";
import formatNumberInWords from "../../utils/format.jsx";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  TextField,
  Typography,
  CircularProgress,
  Switch,
  Container,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { getProject } from "../../api/project.js";
import GavelIcon from "@mui/icons-material/Gavel";
import { fetchUserProfile } from "../../api/profile.js";
import { paidWallet, goToPayment } from "../../api/payment.js";
import { parse } from "persian_util";
import termsAndConditions from "../../utils/termsAndconditions.js";
import { captchaSiteKey } from "../../const.js";
import ReCAPTCHA from "react-google-recaptcha";
const BuyScreen = () => {
  const { uuid } = useParams();
  const [profile, setProfile] = useState(null);
  const [project, setProject] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [projectLoading, setProjectLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false); // State to show CAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [numberInWords, setNumberInWords] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    isPublic: true,
    checkedWallet: false,
    isChecked: false,
  });
  const [showListTile, setShowListTile] = useState(false);
  const [, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [walletBalance, setWalletBalance] = useState(
    profile ? profile.wallet : 0
  );

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const fontSize = isMobile ? "12px" : "14px";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await fetchUserProfile();
        setProfile(userData);
      } catch (error) {
        if (
          error.message === "Unauthenticated." ||
          error.message === "No token found"
        ) {
          navigate("/login", { state: { from: `/buy/${uuid}` } });
          localStorage.clear();
        } else {
          setError(error.message);
        }
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchProjectData = async () => {
      try {
        const projectData = await getProject(uuid);
        setProject(projectData);
      } catch (error) {
        setError(error.message);
      } finally {
        setProjectLoading(false);
      }
    };

    fetchProfileData();
    fetchProjectData();
  }, [uuid]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "amount") {
      const numericValue = parse.Fa_To_En(value).replace(/[^0-9]/g, "");
      const formattedValue = parse.Add_Commas(numericValue);
      const farsiFormattedValue = parse.En_To_Fa(formattedValue);
      setFormData((prevState) => ({
        ...prevState,
        [name]: farsiFormattedValue,
      }));
      if (numericValue === "") {
        setNumberInWords("");
      } else {
        const amountInWords = parse.numberToWord(numericValue);
        setNumberInWords(formatNumberInWords(amountInWords));
      }

      setShowListTile(farsiFormattedValue !== "");

      const numericAmount = parseInt(numericValue, 10);
      if (numericAmount > 200000000) {
        setSnackbarMessage(
          "برای مبالغ بیش از دویست میلیون تومان باید فیش واریزی خود را واریز کنید"
        );
        setSnackbarOpen(true);
      } else {
        setSnackbarOpen(false);
      }

      // setIsButtonDisabled(numericAmount > 200000000 || numericAmount === 0);

      // Update the wallet balance
      var newBalance =
        profile.wallet < numericAmount
          ? 0
          : Math.abs(profile.wallet - numericAmount);
      if (Number.isNaN(newBalance)) {
        newBalance = 0;
      }
      setWalletBalance(newBalance);
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: En_To_Fa(value) }));
      setShowListTile(value !== "");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDepositDialogClose = () => {
    setOpenDepositDialog(false);
  };

  const handleDialogConfirm = () => {
    setOpenDepositDialog(false);
    navigate(`/deposit/${project.id}`, { state: { project } });
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: checked }));
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    setPaymentLoading(true);
    setError(null);

    try {
      const price = parseInt(
        parse.Fa_To_En(formData.amount.replace(/,/g, "")),
        10
      ); // Parse amount correctly
      if (price > 200000000) {
        setOpenDepositDialog(true);
      } else {
        const url = await goToPayment(
          project.id,
          price,
          formData.checkedWallet,
          formData.isPublic,
          recaptchaToken
        );
        window.location.href = url;
      }
    } catch (error) {
      if (error.status == 423) {
        setShowCaptcha(true);
        setSnackbarMessage("لطفا کپچا را تایید کنید");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(error.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  if (profileLoading || projectLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  const calculateDayDifference = () => {
    const startDateTime = project.start_at ? new Date(project.start_at) : null;
    const finishDateTime = project.finish_at
      ? new Date(project.finish_at)
      : null;

    if (!startDateTime || !finishDateTime) {
      return 0;
    }

    return _calculateDaysDifference(startDateTime, finishDateTime);
  };
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Update token with CAPTCHA verification result
  };
  const _calculateDaysDifference = (start, finish) => {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInMilliseconds = finish - start;
    return Math.floor(differenceInMilliseconds / millisecondsPerDay);
  };

  const daysDifference = calculateDayDifference();

  return (
    <Box sx={{ p: 2, mt: 10 }}>
      <Container maxWidth="sm">
        <Box sx={{ backgroundColor: "#fff", borderRadius: 3, p: 2 }}>
          {project.images && project.images.length > 0 ? (
            <div
              style={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                justifyItems: "center",
              }}
            >
              <img
                src={project.images[0].original_url}
                alt={`project_image`}
                style={{
                  width: isMobile ? "100%" : "60%",
                  borderRadius: "10px",
                }}
              />
            </div>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <img
                src="assets/images/placeholder.png"
                alt="placeholder"
                width="450"
                height="250"
              />
            </Box>
          )}
          <Box sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize, color: "GrayText" }}>
              پیش بینی سود سالیانه
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ fontSize, color: "GrayText", pl: 0.6 }}>
                {parse.En_To_Fa(parse.Add_Commas(project.expected_profit))}
              </Typography>
              <Typography sx={{ fontSize, color: "GrayText", ml: 0.6 }}>
                درصد
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize, color: "GrayText" }}>
              حداقل مبلغ سرمایه گذاری
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ fontSize, color: "GrayText", pl: 0.6 }}>
                {parse.En_To_Fa(
                  parse.Add_Commas(project.min_invest.toString())
                )}
              </Typography>
              <Typography sx={{ fontSize, color: "GrayText", ml: 0.6 }}>
                تومان
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize, color: "GrayText" }}>
              دوره سرمایه گذاری
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ fontSize, color: "GrayText", pl: 0.6 }}>
                {parse.En_To_Fa("12")}
              </Typography>
              <Typography sx={{ fontSize, color: "GrayText", ml: 0.6 }}>
                ماه
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize, color: "GrayText" }}>
              پیش بینی سود سه ماهه
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ fontSize, color: "GrayText", pl: 0.6 }}>
                {parse.En_To_Fa(
                  calculateMonthlyROI(project.expected_profit).toFixed(2)
                )}
              </Typography>
              <Typography sx={{ fontSize, color: "GrayText", ml: 0.6 }}>
                درصد
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize, color: "GrayText" }}>
              میزان سرمایه گذاری باقی مانده
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ fontSize, color: "GrayText", pl: 0.6 }}>
                {parse.Add_Commas(
                  leftOverInvest(
                    parseInt(project.fund_needed , 10),
                    parseInt(project.fund_achieved == null ?  0 : project.fund_achieved, 10)
                  ).toFixed(0)
                )}
              </Typography>
              <Typography sx={{ fontSize, color: "GrayText", ml: 0.6 }}>
                تومان
              </Typography>
            </Box>
          </Box>
          {showCaptcha && (
            <Box
              mt={2}
              mb={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <ReCAPTCHA
                size={isMobile ? "compact" : "normal"}
                sitekey={captchaSiteKey} // Replace with your Google reCAPTCHA site key
                onChange={handleRecaptchaChange}
              />
            </Box>
          )}

          <form onSubmit={handlePayment}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="مبلغ سرمایه گذاری (تومان)"
                value={formData.amount}
                placeholder={`حداقل مقدار سرمایه گذاری: ${parse.En_To_Fa(
                  parse.Add_Commas(project.min_invest.toString())
                )} تومان ${numberInWords ? `${numberInWords} تومان` : ""}`}
                onChange={handleInputChange}
                name="amount"
                FormHelperTextProps={{
                  sx: {
                    fontSize: isMobile ? "12px" : "14px",
                    color: "GrayText",
                    display: "flex",
                    flexDirection: "column",
                  },
                }}
                helperText={
                  <>
                    <Box maxWidth="sm" sx={{ display: "flex", width: "100%" }}>
                      {numberInWords && `${numberInWords} تومان`}
                    </Box>
                  </>
                }
                required
                fullWidth
                margin="normal"
                variant="outlined"
                inputProps={{
                  style: { textAlign: "center", fontSize },
                  inputMode: "numeric",
                }}
                InputLabelProps={{
                  sx: { fontSize: isMobile ? "12px" : "14px" },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => {
                        setFormData({ ...formData, amount: "" });
                        setShowListTile(false);
                        setNumberInWords("");
                      }}
                    >
                      <X size={25} />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize }}>
                اسم من را به سایرین نمایش بده
              </Typography>
              <Checkbox
                checked={formData.isPublic}
                onChange={handleCheckboxChange}
                name="isPublic"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize }}>
                <a href="https://smartfunding.ir/risk/" target="_blank">
                  بیانیه ریسک
                </a>
                ،{" "}
                <a href="https://smartfunding.ir/terms/" target="_blank">
                  شرایط و قوانین
                </a>{" "}
                {project.contract && (
                  <>
                    و{" "}
                    <a href={project.contract.original_url} target="_blank">
                      قرارداد سرمایه گذاری{" "}
                    </a>
                  </>
                )}{" "}
                را خواندم و می پذیرم
              </Typography>
              <Checkbox
                checked={formData.isChecked}
                onChange={handleOpenDialog}
              />
            </Box>
            <Button
              type="submit"
              onClick={handlePayment}
              variant="contained"
              color="primary"
              fullWidth
              disabled={
                !formData.isChecked ||
                paymentLoading ||
                formData.amount.length === 0
              }
              sx={{ mt: 2 }}
            >
              {paymentLoading ? (
                <CircularProgress size={24} sx={{ fontSize }} />
              ) : (
                "ادامه"
              )}
            </Button>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => {
                  navigate(`/deposit/${project.id}`, { state: { project } });
                }}
                // onClick={navigate(`/deposit/${project.id}`,{ state: { project } })}
                variant="text"
                disabled={
                  !formData.isChecked ||
                  paymentLoading ||
                  formData.amount.length === 0
                }
                sx={{
                  fontSize,
                  mt: 1,
                }}
              >
                پرداخت از طریق ثبت فیش واریزی
              </Button>
            </div>
          </form>
        </Box>
      </Container>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            height: isMobile ? "70%" : "700px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <GavelIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          بیانیه ریسک
        </DialogTitle>
        <DialogContent dividers>
         
          <Typography
            component="pre"
            sx={{
              // color: "text.secondary",
              fontSize,
              whiteSpace: "pre-wrap", // This ensures the text wraps
              wordBreak: "break-word",
            }}
          >
            {termsAndConditions}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setFormData({ ...formData, isChecked: false });
              handleCloseDialog();
            }}
            color="primary"
          >
            رد
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setFormData({ ...formData, isChecked: true });
              handleCloseDialog();
            }}
            color="primary"
          >
            پذیرش
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDepositDialog} onClose={handleDepositDialogClose}>
        <DialogTitle>توجه</DialogTitle>
        <DialogContent>
          <DialogContentText>
            برای مبالغ بیش از دویست میلیون تومان باید فیش واریزی خود را واریز
            کنید
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDepositDialogClose}>انصراف</Button>
          <Button onClick={handleDialogConfirm} color="primary">
            ادامه
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <Box sx={{ height: "50px" }}></Box>
    </Box>
  );
};

const calculateMonthlyROI = (annualProfit) => {
  return annualProfit / 4;
};

const leftOverInvest = (needed, achieved) => {
  const neededNum = parseInt(needed, 10);
  const achievedNum = parseInt(achieved, 10);

  return Math.abs(neededNum - achievedNum);
};
export default BuyScreen;
