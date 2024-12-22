import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  Collapse,
  Snackbar,
  Alert,
  IconButton,
  ListItemText,
  useMediaQuery,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../api/profile.js";
import PrivateInfoWidget from "./PrivateInfoWidget.jsx";
import AddressWidget from "./AddressWidget.jsx";
import BankAccountWidget from "./BankAccountWidget.jsx";
import SnackbarComponent from "../../utils/SnackBar.jsx";
import Cookies from "js-cookie";
import ShareWidget from "./ShareWidget.jsx";
import userLogo from "../../assets/images/user.png";
import InviteWidget from "./InviteWidget.jsx";
import { CreditCard, MapPin, PencilSimple, ShareNetwork, SignOut, UserCircle, UserList } from "@phosphor-icons/react";
import { fetchProjects } from "../../api/project.js"; 

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState({
    
    privateInfo: false,
    address: false,
    bankAccount: false,
    invites: false,
    share: false,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  useEffect(() => {



    const getUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUser(userProfile);
        const getProjects = async () => {
          try {
            const fetchedProjects = await fetchProjects();
            setProjects(fetchedProjects);
          } catch (error) {
            console.error("Error fetching projects:", error);
          }
        };
        
          getProjects();
     
      } catch (err) {
        if (
          err.message === "Unauthenticated." ||
          err.message === "No token found"
        ) {
          navigate("/login", { state: { from: "/profile" } });
          localStorage.clear();
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [navigate]);

  const handleExpandClick = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInvitesClick = () => {
    if (user.invites.length > 0) {
      handleExpandClick("invites");
    } else {
      setSnackbarMessage("شما دعوتی نداشته اید");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress sx={{ color: "white" }} />;
  }

  if (error) {
    return (
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 3, width: { xs: "100%", sm: "600px", md: "600px" } }}>
      <Box sx={{ height: 50 }} />
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: 3,
          padding: 3,
        }}
      >
        <div style={{ justifyContent: "space-between", display: "flex" }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar src={userLogo} alt="" sx={{ marginLeft: 0 }} />
            <Box ml={1}>
              <Typography
                sx={{ fontSize: isMobile ? 12 : 14, fontWeight: "bold" }}
              >{`${user.full_name}`}</Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              // Cookies.remove("flutter.token");
              navigate("/edit-profile");
            }}
            startIcon={<PencilSimple />}
          >
            <Typography sx={{ fontSize: isMobile ? 10 : 12 }}>
              ویرایش
            </Typography>
          </Button>
        </div>

        <List component="nav" aria-label="profile sections">
        <ListItem
          button
          onClick={() => handleExpandClick("privateInfo")}
          sx={{ width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserCircle size={28} style={{color:'#074EA0' , marginLeft:'4px'}} />
              <Typography
                style={{
                  marginLeft: "5px",
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "bold",
                }}
              >
                مشخصات فردی
              </Typography>
            </div>
            <div>
              {expanded.privateInfo ? <ExpandLess /> : <ExpandMore />}
            </div>
          </div>
          </ListItem>

          <Collapse in={expanded.privateInfo} timeout="auto" unmountOnExit>
            <PrivateInfoWidget
              isUserPrivate={expanded.privateInfo}
              user={user}
            />
          </Collapse>
          <Divider />

          {user.addresses.length > 0 ? (
            <>
             <ListItem button onClick={() => handleExpandClick("address")}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MapPin size={28} style={{color:'#074EA0' , marginLeft:'4px'}} />
                  <Typography
                    style={{
                      marginLeft: "5px",
                      fontSize: isMobile ? 12 : 14,
                      fontWeight: "bold",
                    }}
                  >
                    آدرس سکونت
                  </Typography>
                </div>
                <div>
                  {expanded.address ? <ExpandLess /> : <ExpandMore />}
                </div>
              </div>
            </ListItem>
              <Collapse in={expanded.address} timeout="auto" unmountOnExit>
                <AddressWidget isUserAddress={expanded.address} user={user} />
              </Collapse>
              <Divider />
            </>
          ) : null}

          {user.bank_accounts.length > 0 ? (
            <>
             <ListItem button onClick={() => handleExpandClick("bankAccount")}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CreditCard size={28} style={{color:'#074EA0' , marginLeft:'4px'}}/>
                  <Typography
                    style={{
                      marginLeft: "5px",
                      fontSize: isMobile ? 12 : 14,
                      fontWeight: "bold",
                    }}
                  >
                    مشخصات حساب
                  </Typography>
                </div>
                <div>
                  {expanded.bankAccount ? <ExpandLess /> : <ExpandMore />}
                </div>
              </div>
            </ListItem>
              <Collapse in={expanded.bankAccount} timeout="auto" unmountOnExit>
                <BankAccountWidget
                  isBankAccount={expanded.bankAccount}
                  user={user}
                />
              </Collapse>
              <Divider />
            </>
          ) : null}

<ListItem button onClick={handleInvitesClick}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserList size={28} style={{color:'#074EA0' , marginLeft:'4px'}} />
              <Typography
                style={{
                  marginLeft: "5px",
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "bold",
                }}
              >
                لیست دعوت شدگان
              </Typography>
            </div>
            <div>
              {expanded.invites ? <ExpandLess /> : <ExpandMore />}
            </div>
          </div>
        </ListItem>
          <Collapse in={expanded.invites} timeout="auto" unmountOnExit>
            <InviteWidget user={user} projects={projects} isInvest={expanded.invites} />
          </Collapse>
          <Divider />

          <ListItem button onClick={() => handleExpandClick("share")}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <ShareNetwork size={28} style={{color:'#074EA0' , marginLeft:'4px'}} />
              <Typography
                style={{
                  marginLeft: "5px",
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "bold",
                }}
              >
                دعوت از دوستان
              </Typography>
            </div>
            <div>
              {expanded.share ? <ExpandLess /> : <ExpandMore />}
            </div>
          </div>
        </ListItem>
          <Collapse in={expanded.share} timeout="auto" unmountOnExit>
            <ShareWidget isShare={expanded.share} user={user} />
          </Collapse>
          <Divider />

          <ListItem
            button
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <SignOut size={28} style={{color:'#074EA0' , marginLeft:'4px'}} />
              <Typography
                style={{
                  marginRight: "5px",
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "bold",
                }}
              >
                خروج
              </Typography>
            </div>
            <ListItemText />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ height: 50 }} />
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};

export default ProfileScreen;
