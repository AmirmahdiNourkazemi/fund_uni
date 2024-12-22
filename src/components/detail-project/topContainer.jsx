import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Cookies from "js-cookie";
import { Add_Commas, En_To_Fa } from "persian_util/build/parser";
import "../../styles/DetailSceen.css";
import SnackbarComponent from "../../utils/SnackBar";
const TopContainer = ({ project, width, bool  , uuidInvite = null}) => {
  const navigate = useNavigate();
  var token = Cookies.get("flutter.token");
  const [netCode, setNatCode] = useState(Cookies.get("flutter.netCode"));
  const [mobile, setMobile] = useState(Cookies.get("flutter.mobile"));
  const [name, setFullName] = useState(localStorage.getItem("userFullName"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setMobile(Cookies.get("flutter.mobile"));
    setNatCode(Cookies.get("flutter.netCode"));
    setFullName(localStorage.getItem("userFullName"));
  }, []);

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

  const _calculateDaysDifference = (start, finish) => {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInMilliseconds = finish - start;
    return Math.floor(differenceInMilliseconds / millisecondsPerDay);
  };

  const daysDifference = calculateDayDifference();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // console.log(mobile);
  // console.log(netCode);
  const handleInvestmentClick = () => {
    if (mobile == null) {
      if(uuidInvite != null){
        navigate(`/login/${uuidInvite}`);
      }else {
       navigate( "/login", { state: { from: `/buy/${project.uuid}` } });
      }
      setSnackbarMessage("لطفا ورود کنید!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else if (name == "" || name == null) {
      navigate("/signup");
      setSnackbarMessage("لطفا اطلاعات را کامل کنید!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else {
      navigate(`/buy/${project.uuid}`);
    }
  };
  // const isButtonDisabled = mobile === undefined && netCode === undefined;

  return (
    <Paper
      style={{
        width: width,
        padding: "20px",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      {project?.title && (
        <Typography
          style={{ fontWeight: 700, fontSize: isMobile ? "12px" : "14px" }}
        >
          {project.title}
        </Typography>
      )}

      <div style={{ margin: "20px 0" }}>
        {project?.fund_needed != null && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "14px" }}>
                سرمایه مورد نیاز:
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Typography
                  style={{
                    marginLeft: "5px",
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  {En_To_Fa(Add_Commas(project.fund_needed.toString()))}
                </Typography>
                <Typography
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "GrayText",
                  }}
                >
                  تومان
                </Typography>
              </div>
            </div>
            <Divider style={{ marginBottom: "10px", color: "#E0E0E0" }} />
          </>
        )}

        {project?.fund_achieved != null && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "14px" }}>
                سرمایه جذب شده:
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  style={{
                    marginLeft: "5px",
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  {En_To_Fa(Add_Commas(project.fund_achieved.toString()))}
                </Typography>
                <Typography
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "GrayText",
                  }}
                >
                  تومان
                </Typography>
              </div>
            </div>
            <LinearProgress
              className="progress"
              variant="determinate"
              value={(project.fund_achieved / project.fund_needed) * 100}
              style={{
                height: "10px",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            {project.users_count > 0 && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <Typography style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    تعداد کل سرمایه گذاران:
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      style={{
                        marginLeft: "5px",
                        fontSize: isMobile ? "12px" : "14px",
                      }}
                    >
                      {project.users_count}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "14px",
                        color: "GrayText",
                      }}
                    >
                      نفر
                    </Typography>
                  </div>
                </div>
                <Divider style={{ marginBottom: "10px", color: "#E0E0E0" }} />
              </>
            )}
          </>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Typography style={{ fontSize: isMobile ? "12px" : "14px" }}>
            نوع طرح:
          </Typography>
          <Typography style={{ fontSize: isMobile ? "12px" : "14px" }}>
            شناور
          </Typography>
        </div>

        <Divider style={{ marginBottom: "10px", color: "#E0E0E0" }} />

        {project?.expected_profit != null && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "14px" }}>
                پیش بینی سود سالیانه:
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  style={{
                    marginLeft: "5px",
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  {En_To_Fa(project.expected_profit)}
                </Typography>
                <Typography
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "GrayText",
                  }}
                >
                  درصد
                </Typography>
              </div>
            </div>
            <Divider style={{ marginBottom: "10px", color: "#E0E0E0" }} />
          </>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Typography style={{ fontSize: isMobile ? "12px" : "14px" }}>
            دوره سرمایه گذاری:
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{
                marginLeft: "5px",
                fontSize: isMobile ? "12px" : "14px",
              }}
            >
              {En_To_Fa("12")}
            </Typography>
            <Typography
              style={{
                fontSize: isMobile ? "12px" : "14px",
                color: "GrayText",
              }}
            >
              ماه
            </Typography>
          </div>
        </div>

        <Divider style={{ marginBottom: "10px", color: "#E0E0E0" }} />

        {project?.expected_profit != null && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "14px" }}>
                پیش بینی سود سه ماهه:
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  style={{
                    marginLeft: "5px",
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  {En_To_Fa(
                    calculateMonthlyROI(project.expected_profit).toFixed(2)
                  )}
                </Typography>
                <Typography
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "GrayText",
                  }}
                >
                  درصد
                </Typography>
              </div>
            </div>
            {/* <Divider style={{ marginBottom: '10px', color: '#E0E0E0' }} /> */}
          </>
        )}
      </div>
      <Button
        sx={{
          fontSize: isMobile ? "12px" : "12px",
          backgroundColor: project.status === 1 ? "#074EA0" : "GrayText",
          "&:hover": {
            backgroundColor: project.status === 1 ? "#053a7d" : "GrayText", // Change hover color as needed
          },
        }}
        variant="contained"
        onClick={handleInvestmentClick}
        fullWidth
      >
        {project.status === 1 ? "شروع سرمایه گذاری" : "تامین مالی شد"}
      </Button>
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Paper>
  );
};

const calculateMonthlyROI = (annualProfit) => {
  // Calculate the monthly ROI based on annual profit
  return annualProfit / 4;
};

const isAuthenticated = false; // Replace with actual authentication check
const hasNationalId = false; // Replace with actual national ID check

const showLoginDialog = () => {
  // Implement the login dialog display logic
};

const showSignUpDialog = () => {
  // Implement the sign-up dialog display logic
};

const navigateToInvestmentPage = (uuid) => {
  // Implement navigation to the investment page
};
const handleInvestmentStart = () => {
  // Navigate to project detail page with UUID
  navigate(`/buy/${project.uuid}`); // Use navigate instead of history.push
};
export default TopContainer;
