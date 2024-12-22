import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  CircularProgress,
  useMediaQuery,
  Switch,
} from "@mui/material";
import { fetchUserProfile, updateProfile } from "../../api/profile";
import { getTransaction } from "../../api/transaction.js";
import { useNavigate } from "react-router-dom";
import { storeWithdraw } from "../../api/payment.js";
import { En_To_Fa, Add_Commas } from "persian_util/build/parser";
import JalaliDateConverter from "../../utils/PersianDateConverter";
import {
  ArrowLeft,
  ArrowUpLeft,
  CaretRight,
  TrendUp,
} from "@phosphor-icons/react";
import Withdraw from "../../assets/images/witthdraw.png";
import deposit from "../../assets/images/deposit.png";
import SnackbarComponent from "../../utils/SnackBar.jsx";

const WalletScreen = () => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchLoading, setSwitchLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [autoWithdrawOnProfit, setAutoWithdrawOnProfit] = useState(false);
  const [nationalCode, setNationalCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sajamCode, setSajamCode] = useState("");
  const [sajamCodeID, setSajamCodeID] = useState("");
  const [ibanCode, setIbanCode] = useState("");
  const [ibanCodeID, setIbanCodeID] = useState("");
  const [mobile, setMobile] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedType, setSelectedType] = useState("private");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState();
  const navigate = useNavigate();
  const fontSize = isMobile ? "12px" : "14px";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setProfile(userProfile);
        setAutoWithdrawOnProfit(userProfile.auto_withdraw_on_profit);

        const userTransactions = await getTransaction(10, currentPage, 0); // Example parameters
        setTransactions(userTransactions.data); // Extract the data array from the response
        setTotalPages(userTransactions.last_page); // Update total pages from the response

        setSelectedType(userProfile.type);
        if (userProfile.type === 1) {
          setNationalCode(userProfile.national_code || "");
          setFirstName(userProfile.private_person_info.first_name || "");
          setLastName(userProfile.private_person_info.last_name || "");
        } else {
          setCompanyName(userProfile.full_name || "");
        }
        setMobile(userProfile.mobile || "");
        setNationalCode(userProfile.national_code || "");
        setSajamCode(userProfile.trading_accounts[0]?.code || "");
        setSajamCodeID(userProfile.trading_accounts[0]?.id || "");
        setIbanCode(userProfile.bank_accounts[0]?.iban || "");
        setIbanCodeID(userProfile.bank_accounts[0]?.id || "");
      } catch (error) {
        if (
          error.message === "Unauthenticated." ||
          error.message === "No token found"
        ) {
          navigate("/login");
          localStorage.clear();
        }
        setError("Error fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // if (error) {
  //   return (
  //     <SnackbarComponent
  //       open={snackbarOpen}
  //       onClose={handleSnackbarClose}
  //       message={snackbarMessage}
  //       severity={snackbarSeverity}
  //     />
  //   );
  // }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    // e.preventDefault();
     setSwitchLoading(true);
    var profileData = {};

    // Add fields to profileData only if they are not empty or null
    profileData.auto_withdraw_on_profit = event.target.checked;

    if (selectedType == 1) {
      if (firstName) profileData.first_name = firstName;
      if (lastName) profileData.last_name = lastName;
    } else {
      if (companyName) profileData.company_name = companyName;
    }

    if (nationalCode) profileData.national_code = nationalCode;
    profileData.type = selectedType;

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
      // console.log("Submitting profile data:", profileData);
      const result = await updateProfile(profileData);
      // console.log("Update result:", result);
      setSnackbarMessage(
        result.user.auto_withdraw_on_profit == false ? "غیر فعال شد" : "فعال شد"
      );
      setSnackbarSeverity(
        result.user.auto_withdraw_on_profit == false ? "error" : "success"
      );
      setSnackbarOpen(true);
    } catch (error) {
      if (
        error.message === "Unauthenticated." ||
        error.message === "No token found"
      ) {
        navigate("/login", { state: { from: "/wallet" } });
        localStorage.clear();
      }
      setError(error.message);
      setAutoWithdrawOnProfit(false);
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSwitchLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 12 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            fontSize,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box width={isMobile ? null : "900px"}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(to right, #074EA0, #4CC9F0)",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Typography color="white" sx={{ fontSize }}>
              موجودی کیف پول
            </Typography>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography
                color="white"
                sx={{ fontSize: isMobile ? "13px" : "15px" }}
              >
                {En_To_Fa(Add_Commas(profile.wallet.toString()))}
              </Typography>
              <Typography color="white" sx={{ fontSize, pl: 1 }}>
                تومان
              </Typography>
            </div>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 4 }}>
            <Box
              onClick={() => navigate("/wallet/withdraw")}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "15px",
                p: 2,
                m: 1,
                cursor: "pointer",
              }}
            >
              <img
                src={Withdraw}
                alt="برداشت از کیف پول"
                style={{ height: isMobile ? "60px" : "100px" }}
              />
              <Typography sx={{ mt: 2, cursor: "pointer", fontSize }}>
                برداشت از کیف پول
              </Typography>
            </Box>
            <Box
              onClick={() =>
                navigate("/wallet/deposit", { state: { profile } })
              }
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                alignItems: "center",
                borderRadius: "15px",
                p: 2,
                m: 1,
                cursor: "pointer",
              }}
            >
              <img
                src={deposit}
                alt="افزودن به کیف پول"
                style={{ height: isMobile ? "60px" : "100px" }}
              />
              <Typography sx={{ mt: 2, cursor: "pointer", fontSize }}>
                افزودن به کیف پول
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 2,
              backgroundColor: "white",
              width: isMobile ? "300px" : null,
            }}
          >
            <div style={{display:'flex', alignItems:'center' , justifyContent:'space-between' ,width:'100%'  }}>
            <Typography sx={{ fontSize }}>واریز سود طرح ها به صورت خودکار به حساب بانکی </Typography>
            {switchLoading ? <Box
          sx={{
           
            fontSize,
          }}
        >
          <CircularProgress color="primary" />
        </Box> :<Switch
          
          checked={autoWithdrawOnProfit}
          onChange={(e) => {
            // handleSwitchChange(e);
            setAutoWithdrawOnProfit(e.target.checked);
            handleSubmit(e); // Call handleSubmit after switch change
          }}
          // inputProps={{ "aria-label": "auto withdraw on profit switch" }}
        />}
            </div>
          </Box>
          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 2,
              backgroundColor: "white",
              width: isMobile ? "300px" : null,
            }}
          >
            <Typography sx={{ fontSize }}>تاریخچه تراکنش ها</Typography>
            <List>
              {Array.isArray(transactions) &&
                transactions.map((transaction, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      mb: 2,
                      px: 1,
                      border: "1px solid #e6e6e6",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#e6e6e6",
                          borderRadius: "10px",
                          justifyContent: "center",
                          justifyItems: "center",
                          justifySelf: "center",
                          alignContent: "center",
                          ml: 1,
                        }}
                      >
                        <Box
                          sx={{
                            ml: 1,
                            justifyContent: "center",
                            justifyItems: "center",
                            justifySelf: "center",
                            alignContent: "center",
                          }}
                        >
                          <TrendUp
                            size={25}
                            color={transaction.type === 2 ? "red" : "green"}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontSize,
                            ml: 1,
                            justifyContent: "center",
                            justifyItems: "center",
                            justifySelf: "center",
                            alignContent: "center",
                          }}
                        >
                          {transaction.type === 1
                            ? "خرید"
                            : transaction.type === 2
                            ? "فروش"
                            : transaction.type === 3
                            ? "سود"
                            : transaction.type === 4
                            ? "واریز به حساب"
                            : transaction.type === 5
                            ? "برداشت از حساب"
                            : "کمیسیون دعوت"}
                        </Typography>
                      </Box>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography sx={{ ml: 0.6, fontSize }}>
                          مبلغ تراکنش:
                        </Typography>
                        <Typography sx={{ ml: 0, fontSize }}>
                          {En_To_Fa(Add_Commas(transaction.amount.toString()))}{" "}
                          تومان
                        </Typography>
                      </div>
                    </Box>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ mt: 1, fontSize, color: "gray" }}>
                        تاریخ تراکنش
                      </Typography>
                      <Typography sx={{ mt: 1, fontSize, color: "gray" }}>
                        <JalaliDateConverter isoDate={transaction.created_at} />
                      </Typography>
                    </div>
                    {transaction.trace_code && (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography sx={{ mt: 1, fontSize, color: "gray" }}>
                          کد رهگیری فرابورس
                        </Typography>
                        <Typography sx={{ mt: 1, fontSize, color: "gray" }}>
                          {En_To_Fa(transaction.trace_code)}
                        </Typography>
                      </div>
                    )}
                  </ListItem>
                ))}
            </List>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                justifyItems: "Start",
                justifySelf: "Start",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={transactions.prev_page_url === null}
                sx={{ mx: 1 }}
              >
                صفحه قبل
              </Button>
              <Typography sx={{ mx: 0, fontSize }}>
                {En_To_Fa(currentPage.toString())} /{" "}
                {En_To_Fa(totalPages.toString())}
              </Typography>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={transactions.next_page_url === null}
                sx={{ mx: 1 }}
              >
                صفحه بعد
              </Button>
            </div>
          </Box>
        </Box>
      )}
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <Box sx={{ height: "90px" }} />
    </Box>
  );
};

export default WalletScreen;
