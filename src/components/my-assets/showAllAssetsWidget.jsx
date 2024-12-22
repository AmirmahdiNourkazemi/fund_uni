import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
  Box,
  Divider,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCertificate } from "../../api/project"; // Import your project API function
import JalaliDateConverter from "../../utils/PersianDateConverter.jsx"; // Assuming you have the PersianDateConverter component
import { En_To_Fa, Add_Commas } from "persian_util/build/parser"; // Import Persian utility functions
import TransactionItem from "./TransactionItem"; // Assuming you have a TransactionItem component
import { CaretDown, CaretLeft, Receipt } from "@phosphor-icons/react";

const ShowAllAssetsWidget = ({ unit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // State for controlling modal open/close
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [error, setError] = useState(null);
  const fontSize = isMobile ? "12px" : "14px";
  const navigate = useNavigate();
  const handleViewCertificate = async () => {
    setLoading(true);

    try {
      const url = await getCertificate(unit.uuid);
      window.open(url, "_blank");
    } catch (error) {
      if (
        error.message === "Unauthenticated." ||
        error.message === "No token found"
      ) {
        navigate("/login");
        localStorage.clear();
      }
      setError(error.message);
    }
    setLoading(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  if (error) {
    return <Typography variant="h6">{error}</Typography>;
  }
  return (
    <Container
      style={{
        padding: isMobile ? "12px" : "20px",

        borderRadius: "8px",
        marginTop: "20px",
        transition: "height 0.3s ease-in-out",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={toggleExpanded}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "8px",
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              fontSize,
              color: "#074EA0",
              fontWeight: "bold",
              mr: 0.5,
              ":hover": { color: "#074EA0", borderColor: "#074EA0" },
            }}
          >
            {unit.title}
          </Typography>
          {isExpanded ? (
            <CaretDown size={20} weight="regular" color="#074EA0" />
          ) : (
            <CaretLeft size={20} weight="regular" color="#074EA0" />
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "start",
            justifyContent: "space-between",
            alignContent: "start",
          }}
        >
          {/* <div style={{ paddingRight: '2px' }}>
            <CaretDown size={20} weight='regular' color='#074EA0' />
          </div> */}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize, color: "GrayText" }}>
          مبلغ سرمایه گذاری
        </Typography>
        <Typography sx={{ fontSize, color: "GrayText" }}>
          {En_To_Fa(Add_Commas(unit.pivot.amount.toString()))} تومان
        </Typography>
      </div>

      <Divider sx={{ m: 1.5, opacity: 0.5 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize, color: "GrayText" }}>
          تعداد تراکنش ها
        </Typography>
        <Typography sx={{ fontSize, color: "GrayText" }}>
          {En_To_Fa(unit.transactions.length.toString())} تراکنش
        </Typography>
      </div>

      <Divider sx={{ m: 1.5, opacity: 0.5 }} />
      {Array.isArray(unit.transactions) &&
        unit.transactions.some((transaction) => transaction.type === 3) && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize, color: "GrayText" }}>
                مجموع سود واریزی
              </Typography>
              <Typography sx={{ fontSize, color: "GrayText" }}>
                <>
                  {Add_Commas(
                    unit.transactions.reduce((sum, transaction) => {
                      return transaction.type === 3
                        ? sum + transaction.amount
                        : sum;
                    }, 0)
                  )}
                  <span> تومان</span>
                </>
              </Typography>
            </div>
            <Divider sx={{ m: 1.5, opacity: 0.5 }} />
          </>
        )}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "10px",
            }}
          >
            {/* <Receipt color="#074EA0" size={22} sx={{ fontSize  }} />
         <Typography
            sx={{ fontSize, color: "#074EA0", textAlign: "start", ml:1 }}
          >
            جزئیات تراکنش
          </Typography> */}
          </div>

          <Box sx={{ overflowY: "auto" }}>
            {unit.transactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                transaction={transaction}
                index={index}
                isLast={index === unit.transactions.length - 1}
              />
            ))}
          </Box>
        </Box>
      </Collapse>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button 
        fullWidth = {isMobile ? true : false}
        variant="outlined" onClick={toggleExpanded} sx={{ fontSize }}>
          {isExpanded ? "بستن تراکنش ها" : "مشاهده تراکنش ها"}
        </Button>
        <Button
         fullWidth = {isMobile ? true : false}
          variant="outlined"
          onClick={handleViewCertificate}
          sx={{ fontSize }}
          style={{ marginRight: "10px" }}
        >
          {loading ? <CircularProgress size={24} /> : "مشاهده گواهی"}
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>
    </Container>
  );
};

export default ShowAllAssetsWidget;
