import React from "react";
import {
  Typography,
  Box,
  Divider,
  useMediaQuery,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import { En_To_Fa } from "persian_util/build/parser";
import { Add_Commas } from "persian_util/build/parser"; // Import Add_Commas utility function
import JalaliDateConverter from "../../utils/PersianDateConverter"; // Assuming you have the JalaliDateConverter component
import { Hash, HashStraight, TrendDown, TrendUp } from "@phosphor-icons/react";

const TransactionItem = ({ transaction , index , isLast}) => {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const fontSize = isMobile ? "12px" : "14px";

  return (
    <Box sx={{ mb: 1 }}>
     
     <div style={{ display: isMobile ? "block" : "flex", alignItems: "center" }}>
     <div style={{display:'flex' , flexDirection:isMobile ? 'row' :'column' , justifyContent: 'space-between'}}>
     <Chip
        sx={{ fontSize, width: "auto", mb: 1 , mr:isMobile ? 0: 2 }}
        avatar={
          transaction.type === 1 ? (
            <TrendDown style={{ color: "red" }} />
          ) : (
            <TrendUp style={{ color: "green" }} />
          )
        }
size="small"
        label={transaction.type === 1 ? "سرمایه گذاری" : "واریز سود"}
      />
     <Chip
    
        sx={{ fontSize,width: "auto", mb: 1 ,mr:isMobile ? 0: 2 }}
        size="small"
      
        avatar={
          <HashStraight size={12} style={{ color: "GrayText" }} />
        }
        label={`تراکنش ${index + 1}`}
      />
    
     </div>
      <div style={{ flex: 1 }}>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        
        <Typography sx={{ fontSize, color: "GrayText" }}>
          {transaction.type === 2 ? "مبلغ سرمایه گذاری" : "مبلغ واریز شده"}
        </Typography>
        <Typography sx={{ fontSize, color: "GrayText" }}>
          {En_To_Fa(Add_Commas(transaction.amount.toString()))} تومان
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize, color: "GrayText" }}>
          {transaction.type === 1 ? "تاریخ سرمایه گذاری" : "تاریخ واریز"}
        </Typography>
        <Typography sx={{ fontSize, color: "GrayText" }}>
          <JalaliDateConverter isoDate={transaction.created_at} />
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize, color: "GrayText" }}>وضعیت</Typography>
        <Typography sx={{ fontSize, color: "GrayText" }}>
          {transaction.type === 1 ? "سرمایه گذاری" : "واریز سود"}
        </Typography>
      </Box>

      </div>



     </div>
      
     {!isLast && <Divider variant="middle" sx={{ my: 1.5 }} />}
    </Box>
  );
};

export default TransactionItem;
