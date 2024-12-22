import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  useMediaQuery,
  Divider,
  Box,
  Button,
  Drawer,
  Link,
} from "@mui/material";
import faraborse from "../../assets/images/faraborse.png";
import enamad from "../../assets/images/enamed.png";
import appLogo from "../../assets/images/ic_launcher.png";
import vada from "../../assets/images/Powered_by_vada.png";
import bazzar from "../../assets/images/coffe-bazzar.svg";
import myket from "../../assets/images/myket.svg";
import bazzarDark from "../../assets/images/mobile-coffe-dark.svg";
import myketDark from "../../assets/images/myket-dark.svg";
import footerContent from "../../utils/footerContent.js";
import "../../styles/Home.css";
import {
  InstagramLogo,
  LinkedinLogo,
  TelegramLogo,
} from "@phosphor-icons/react";
import CustomDrawer from "../../utils/appDrawer.jsx";

const Footer = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  return (
    <div style={{ fontFamily: "irms-w600" }} className="footer">
      <Container
        id="application"
        maxWidth="lg"
        sx={{
          padding: "20px",
          backgroundColor: "#f2f2f2",
          marginTop: "auto",
          overflowX: "hidden",
          borderRadius: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#999999",
            padding: "10px",
            borderRadius: 5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Image and Text in the first section */}
            <CardMedia
              component="img"
              image={appLogo}
              alt="Example Image"
              sx={{ width: 40, height: 40, marginRight: 1 }}
            />
            <Typography
              className="footer"
              sx={{
                fontSize: isMobile ? "12px" : "15px",
                color: "white",
                marginRight: 1,
              }}
            >
              دانلود اپلیکیشن اسمارت فاندینگ
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 3, ml: 1 }}>
            {/* Two cards or Download Button */}
            {isMobile ? (
              <Button
                variant="contained"
                sx={{ fontSize: "12px", borderRadius: 2 }}
                onClick={toggleDrawer(true)}
              >
                دانلود
              </Button>
            ) : (
              <>
                <Link
                  href="https://cafebazaar.ir/app/ir.smartfunding"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card
                    sx={{
                      width: 120,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={bazzar}
                      alt="bazzar"
                      sx={{ width: 120, height: 25 }}
                    />
                  </Card>
                </Link>
                <Link
                  href="https://myket.ir/app/ir.smartfunding"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card
                    sx={{
                      width: 120,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={myket}
                      alt="Example Card Image 2"
                      sx={{ width: 120, height: 25 }}
                    />
                  </Card>
                </Link>
              </>
            )}
          </Box>
        </Box>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid
          container
          className="footer"
          spacing={3}
          sx={{ flexWrap: "wrap" }}
        >
          {/* Column 1: درباره ی ما */}
          <Grid className="footer" item xs={12} md={4}>
            <Typography
              className="footer"
              sx={{ fontSize: isMobile ? "14px" : "15px" }}
            >
              {footerContent.aboutUs.title}
            </Typography>
            <Typography
              className="footer"
              sx={{ fontSize: "12px", color: "GrayText", mt: 0.5 }}
            >
              {footerContent.aboutUs.description}
            </Typography>
            {isMobile ? null : (
              <img
                src={vada}
                onClick={() => window.open("https://www.vada.ir/")}
                style={{ cursor: "pointer" }}
                alt=""
                width={isMobile ? "80px" : "150px"}
              />
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography
              className="footer"
              sx={{ fontSize: isMobile ? "14px" : "15px" }}
              gutterBottom
            >
              {footerContent.contactUs.title}
            </Typography>
            <Typography
              className="footer"
              sx={{
                fontSize: "12px",
                color: "GrayText",
                whiteSpace: "pre-line",
                mt: 0.5,
              }}
            >
              {footerContent.contactUs.description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography
              className="footer"
              sx={{ fontSize: isMobile ? "14px" : "15px" }}
              gutterBottom
            >
              سایر بخش ها
            </Typography>
            <Typography
              className="footer"
              sx={{
                fontSize: "12px",
                color: "GrayText",
                whiteSpace: "pre-line",
                mt: 1,
              }}
            >
              <a
                href="https://smartfunding.ir/about-us/"
                style={{ color: "GrayText" }}
              >
                درباره ما
              </a>
            </Typography>

            <Typography
              className="footer"
              sx={{
                fontSize: "12px",
                color: "GrayText",
                whiteSpace: "pre-line",
                mt: 1,
              }}
            >
              <a
                href="https://smartfunding.ir/terms/"
                style={{ color: "GrayText" }}
              >
                شرایط و قوانین
              </a>
            </Typography>
            <Typography
              className="footer"
              sx={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "GrayText",
                whiteSpace: "pre-line",
                mt: 1,
              }}
            >
              <a
                href="https://smartfunding.ir/risk/"
                style={{ color: "GrayText" }}
              >
                بیانیه ریسک
              </a>
            </Typography>

            <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
              <Box
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/smartfunding-ir/"
                  )
                }
                sx={{
                  display: "inline-block",
                  cursor: "pointer",
                  color: "GrayText",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.2)",
                    color: "#074EA0",
                  },
                }}
              >
                <LinkedinLogo size={30} weight="regular" />
              </Box>
              <Box
                onClick={() =>
                  window.open("https://www.instagram.com/smartfunding_ir/")
                }
                sx={{
                  display: "inline-block",
                  cursor: "pointer",
                  color: "GrayText",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.2)",
                    color: "#074EA0",
                  },
                }}
              >
                <InstagramLogo size={30} weight="regular" />
              </Box>
              <Box
                onClick={() => window.open("https://t.me/smartfunding")}
                sx={{
                  display: "inline-block",
                  cursor: "pointer",
                  color: "GrayText",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.2)",
                    color: "#074EA0",
                  },
                }}
              >
                <TelegramLogo size={30} weight="regular" />
              </Box>
            </Box>
            <Box
              sx={{
                display: "inline-block",
                cursor: "pointer",
                color: "GrayText",
              }}
            >
              {isMobile ? (
                <img
                  src={vada}
                  onClick={() => window.open("https://www.vada.ir/")}
                  alt=""
                  width={isMobile ? "130px" : "150px"}
                />
              ) : null}
            </Box>
          </Grid>
          {/* Column 3: Cards with logos */}
          <Grid
            item
            xs={12}
            md={3}
            container
            spacing={0}
            justifyContent="center"
          >
            <Grid item xs={6} sm={3} md={6}>
              <Card
                sx={{
                  maxWidth: isMobile ? "140px" : "150px",
                  height: "155px",
                  ml: 1,
                  borderRadius: 3,
                  mr: 1,
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open(
                      "https://trustseal.enamad.ir/?id=449122&Code=HWmnS4V6RcjZdJasBypl23owN4eV0JTY"
                    );
                  }}
                >
                  <a
                    referrerpolicy="origin"
                    target="_blank"
                    href="https://trustseal.enamad.ir/?id=449122&Code=HWmnS4V6RcjZdJasBypl23owN4eV0JTY"
                  >
                    <img
                      referrerpolicy="origin"
                      src="https://trustseal.enamad.ir/logo.aspx?id=449122&Code=HWmnS4V6RcjZdJasBypl23owN4eV0JTY"
                      alt=""
                      style={{ cursor: "pointer" }}
                      code="HWmnS4V6RcjZdJasBypl23owN4eV0JTY"
                    />
                  </a>
                </div>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3} md={6}>
              <Card
                sx={{
                  maxWidth: isMobile ? "140px" : "150px",
                  height: "155px",
                  mr: 1,
                  borderRadius: 3,
                  ml: 1,
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.open(
                    "https://ifb.ir/GetFiles/GetFinstarsCertificationFile.aspx?id=38&cert_type=4"
                  );
                }}
              >
                {/* <a
                  target="_blank"
                  href="https://cf.ifb.ir/report/PlatformActivityLicenseTrustSealDetail?licenseguid=f3c49f99-4062-4a79-adef-49e5d32cbbba"
                >
                  <img
                    id="rgvlgwmdxlaphwlabrgw"
                    loading="lazy"
                    // class="namad"
                    // width="60"
                    // height="71"
                    alt="نماد فرابورس"
                    src="https://cf.ifb.ir/report/PlatformActivityLicenseTrustSealImage?licenseguid=f3c49f99-4062-4a79-adef-49e5d32cbbba"
                  />
                </a> */}
                {/* <div style={{cursor:'pointer'}} onClick={()=>{
                    window.open('https://cf.ifb.ir/report/PlatformActivityLicenseTrustSealDetail?licenseguid=f3c49f99-4062-4a79-adef-49e5d32cbbba')
                  }}>
                  <img id="rgvlgwmdxlaphwlabrgw" style={{cursor:'pointer'}}
onclick="window.open('https://cf.ifb.ir/report/PlatformActivityLicenseTrustSealDetail?licenseguid=f3c49f99-4062-4a79-adef-49e5d32cbbba')" alt="" src="https://cf.ifb.ir/report/PlatformActivityLicenseTrustSealImage?licenseguid=f3c49f99-4062-4a79-adef-49e5d32cbbba"/>
                  </div> */}
                <CardMedia
                  component="img"
                  image={faraborse}
                  alt="Logo 2"
                  sx={{ width: "100%", height: "150px", mt: 1 }}
                  onClick={() => {
                    window.open(
                      "https://ifb.ir/GetFiles/GetFinstarsCertificationFile.aspx?id=38&cert_type=4"
                    );
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <CustomDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
        
      </Container>
    </div>
  );
};

export default Footer;
