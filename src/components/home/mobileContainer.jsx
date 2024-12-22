import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
} from "@mui/material";
import "../../styles/mobileMochup.css"; // Custom CSS for mobile mockup
import videoPalyer from "../../assets/images/app-video.mp4";
import appLogo from "../../assets/images/ic_launcher.png";
import { CloudArrowDown } from "@phosphor-icons/react";
import CustomDrawer from "../../utils/appDrawer";
import { ExpandMore } from "@mui/icons-material";
const MobileContainer = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const fontSize = isMobile ? "12px" : "14px";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isIphone, setIsIphone] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false); // State for bottom sheet

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };
  

  // Detect if the user is on an iPhone AND on a mobile-sized screen
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
    const isMobileScreen = window.innerWidth < 768; // Mobile screen size check
    if (isIOSDevice && isMobileScreen) {
      setIsIphone(true);
    } else {
      setIsIphone(false);
    }
  }, []);

  // Function to handle opening of the bottom sheet (Dialog)
  const handleDownloadClick = () => {
    if (isIphone) {
      setBottomSheetOpen(true);
    } else {
      toggleDrawer(true)(); // Open drawer for Android users
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        marginTop: "20px",
        paddingTop: "20px",
        margin: isMobile ? "0 auto" : null,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box className="mobile-mockup">
        <ReactPlayer
          url={videoPalyer} // Ensure this path is correct
          playing
          loop
          muted
          width="100%"
          height="100%"
          alt="سکوی تامین مالی جمعی"
          controls={false} // Disable player controls to prevent interaction
          onClick={(e) => e.preventDefault()}
        />
      </Box>
      <div
        style={{ marginRight: isMobile ? "auto" : "100px", marginTop: "20px" }}
      >
        <Box
          sx={{
            padding: "20px",
            width: isMobile ? "350px" : "500px",
            boxSizing: "border-box",

            borderRadius: "10px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                justifyContent: "center",
                justifyItems:'center',
                alignItems: isMobile ? "center" : "flex-start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: isMobile ? "12px" : "18px",
                  mb: "10px",
                  color: "primary.main",
                  fontWeight: "bold",
                }}
              >
                اپلیکیشن سرمایه گذاری اسمارت فاندینگ
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize,
                  color: "GrayText",
                  wordSpacing: "2px",
                  lineHeight: "22px",
                  textJustify: "initial",
                }}
              >
                اسمارت فاندینگ، پلتفرمی دیجیتال است که از طریق آن می توانید همه
                عملیات سرمایه گذاری و فرآیند واریز سود را بر روی اپلیکیشن
                اندرویدی و یا نسخه وب اپ آیفن مشاهده کنید. با نصب اپلیکیشن
                اسمارت فاندینگ همیشه از فرصت های سرمایه گذاری با خبر خواهید بود.
              </Typography>

              <Button
                color="primary"
                variant="outlined"
                sx={{ marginTop: "20px", fontWeight: "bold", width: "50%" }}
                startIcon={<CloudArrowDown />}
                onClick={handleDownloadClick} // Updated to handle iPhone users
              >
                دانلود اپلیکیشن
              </Button>
            </div>
          </div>
          <CustomDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
        </Box>

        {/* Bottom Sheet for iPhone users */}
        <Dialog
  open={bottomSheetOpen}
  onClose={() => setBottomSheetOpen(false)}
  fullWidth
  sx={{
    "& .MuiPaper-root": {
      position: "absolute",
      bottom: 0,
      margin: 0,
      width: "100%",
      boxSizing: "border-box",
      borderRadius: "10px 10px 0 0", // Rounded top corners for the sheet
      height: "250px",
    },
  }}
>
  <DialogContent>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        راهنمای افزودن به صفحه اصلی
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "14px", marginBottom: "10px" }}>
        ۱. روی دکمه "Share" در مرورگر Safari کلیک کنید.
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "14px", marginBottom: "10px" }}>
        ۲. گزینه "Add to Home Screen" را انتخاب کنید.
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "14px" }}>
        ۳. نام اپلیکیشن را وارد کرده و سپس گزینه "Add" را بزنید.
      </Typography>
    </div>
  </DialogContent>
</Dialog>

      </div>
    </div>
  );
};

export default MobileContainer;
