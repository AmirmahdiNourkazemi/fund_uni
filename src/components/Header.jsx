import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/profile";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  CaretLeft,
  Wallet,
  MoneyWavy,
  TrendUp,
  House,
  SignOut,
} from "@phosphor-icons/react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/images/logo1.png";
import logoDrawer from "../assets/images/revers_logo .png";
import "../styles/Header.css";
import { display } from "@splidejs/splide/src/js/utils";
import { Add_Commas, En_To_Fa } from "persian_util/build/parser";
import Cookies from "js-cookie";
const Header = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [wallet, setWallet] = useState('0');
  const [natCode, setNatCode] = useState(Cookies.get("flutter.netCode"));
  const [mobile, setMobile] = useState(Cookies.get("flutter.mobile"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const fontSize = isMobile ? "12px" : "14px";

  useEffect(() => {
    // const getUserProfile = async () => {
    //   try {
    //     const userProfile = await fetchUserProfile();
    //     setUser(userProfile);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // getUserProfile();

    const storedFullName = localStorage.getItem('userFullName');
    const storedMobile = localStorage.getItem('userMobile');
    const storedWallet = localStorage.getItem('userWallet');
    if (storedFullName) {
      setFullName(storedFullName);
    }
   
    if (storedWallet) {
      setWallet(storedWallet);
    }
  }, []);
  useEffect(() => {
    setMobile(Cookies.get('flutter.mobile'));
    setNatCode(Cookies.get('flutter.netCode'));
  }, []);

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (!mobile) {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNavigateToCompanies = () => {
    if (natCode) {
      navigate("/companies");
    } else {
      localStorage.clear()
      navigate("/login", { state: { from: "/companies" } });
    }
  };

  const drawerList = (
    <Box
      sx={{ width: 230, direction: "rtl", fontSize: 13, zIndex: 2000 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Container sx={{ mt: 0, background: "#074EA0" }}>
        <Avatar
          alt="logoDrawer"
          src={logoDrawer}
          sx={{
            width: "80%",
            height: "100%",
            alignItems: "center",
            borderRadius: "0px",
          }}
        />
      </Container>
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton sx={{ cursor: "pointer" }}>
            <ListItemText
              primary="متقاضی سرمایه"
              onClick={handleNavigateToCompanies}
              primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary="طرح های سرمایه گذاری"
              onClick={() => {
                navigate("/projects");
              }}
              primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary="اپلیکیشن"
              onClick={() => {
                navigate("/#application");
              }}
              primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary="بلاگ"
              onClick={() => {
                window.open("https://smartfunding.ir/blogs/", "_self");
              }}
              primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
            />
          </ListItemButton>
          <Divider />
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary="محتوای آموزشی"
              onClick={() => {
                window.open("https://smartfunding.ir/faqs/", "_self");
              }}
              primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              disablePadding
              primary="درباره ما"
              onClick={() => {
                window.open("https://smartfunding.ir/about-us/", "_self");
              }}
              primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List disablePadding>
        {fullName ? (
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
              onClick={()=>{
                navigate('/profile')
              }}
                primary={fullName}
                primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
              />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLoginClick}>
              <ListItemText
                primary={mobile ? "تکمیل ثبت نام" : "ورود"}
                primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
              />
            </ListItemButton>
          </ListItem>
        )}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              onClick={() => {
                navigate("/messagebox");
              }}
              primary="پشتیبانی"
              primaryTypographyProps={{ fontSize: "12px", textAlign: "left" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <header className="app-header">
      <div className="header-section header-left">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => {
            navigate("/");
          }}
          style={{ cursor: "pointer" }}
        />
        <nav className="desktop-menu">
          <a onClick={handleNavigateToCompanies} style={{ cursor: "pointer" }}>
            متقاضی سرمایه
          </a>
          &nbsp;
          <a
            onClick={() => {
              navigate("/projects");
            }}
            style={{ cursor: "pointer" }}
          >
            طرح های سرمایه گذاری
          </a>
          &nbsp;
          <a href="https://smartfunding.ir/blogs/">بلاگ</a>&nbsp;
          <a href="https://smartfunding.ir/faqs/">محتوای آموزشی</a>&nbsp;
          <a href="https://smartfunding.ir/about-us/">درباره ما</a>&nbsp;
          <a
            onClick={() => {
              navigate("/#application");
            }}
            style={{ cursor: "pointer" }}
          >
            اپلیکیشن
          </a>
          &nbsp;
        </nav>
      </div>
      <div className="header-section header-right">
        <a
          onClick={() => {
            navigate("/messagebox");
          }}
          href="#support"
          className="support-link"
        >
          پشتیبانی
        </a>
        { fullName ? (
          <div className="user-button" style={{ marginLeft: "10px" }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mr: 4, borderRadius: "10px" }}
          
              onClick={handleMenuClick}
            >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <KeyboardArrowDownIcon /> {fullName}
              </Box>
            </Button>
            <Menu
              sx={{ mt: 4, borderRadius: "20px" }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 30],
                    },
                  },
                ],
              }}
              PaperProps={{
                sx: {
                  borderRadius: "10px",
                  backgroundColor: "#fffff",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginLeft: 20 }}>
                    <UserCircle size={32} weight="light" color="#074EA0" />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontSize: "14px" }}>
                      {fullName}
                    </Typography>

                    <Typography
                      sx={{ fontSize: "12px", color: "GrayText", mt: 1 }}
                    >
                      {mobile}
                    </Typography>
                  </div>
                  <div style={{ marginRight: 20 }}>
                    <CaretLeft size={22} weight="light" color="#074EA0" />
                  </div>
                </div>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/myassets");
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "Row",
                    alignContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginLeft: 10 }}>
                    <TrendUp size={28} weight="light" color="#074EA0" />
                  </div>
                  <Typography sx={{ fontSize: "14px" }}>
                    مشاهده دارایی ها
                  </Typography>
                </div>
              </MenuItem>

              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/");
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "Row",
                    alignContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginLeft: 10 }}>
                    <House size={28} weight="light" color="#074EA0" />
                  </div>
                  <Typography sx={{ fontSize: "14px" }}>خانه</Typography>
                </div>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  Cookies.remove("flutter.token");
                  Cookies.remove("flutter.mobile");
                  Cookies.remove("flutter.netCode");
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "Row",
                    alignContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginLeft: 10 }}>
                    <SignOut size={28} weight="light" color="#074EA0" />
                  </div>
                  <Typography sx={{ fontSize: "14px" }}>خروج</Typography>
                </div>
              </MenuItem>
            </Menu>
          </div>
        ) : mobile ? (
          <a href="#login" onClick={handleLoginClick} className="login-link">
            تکمیل ثبت نام
          </a>
        ) : (
          <a href="#login" onClick={handleLoginClick} className="login-link">
 ورود
          </a>
        )}
        <div className="menu-icon" onClick={toggleDrawer(true)}>
          <MenuIcon sx={{ fontSize: 25 }} />
        </div>
      </div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "15px",
            borderBottomLeftRadius: "15px",
          },
        }}
        onClose={toggleDrawer(false)}
      >
        {drawerList}
      </Drawer>
    </header>
  );
};

export default Header;
