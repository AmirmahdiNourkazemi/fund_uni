// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Cookies from "js-cookie";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import BottomNavBar from "./components/BottomNavBar.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import BuyPage from "./pages/buyPage.jsx";
import MyAssetsPage from "./pages/myAssetsPage.jsx";
import WalletPage from "./pages/walletPage.jsx";
import WithdrawPage from "./pages/withdrawPage.jsx";
import "./styles/global.css";
import DepositPage from "./pages/depositPage.jsx";
import CompanyPage from "./pages/companyPage.jsx";
import MessageBoxPage from "./pages/messageBoxPage.jsx";
import InputTicketPage from "./pages/InputTicketPage.jsx";
import ChatBoxPage from "./pages/chatBoxPage.jsx";
import SignUpPage from "./pages/signUpPage.jsx";
import ProjectPage from "./pages/projectPage.jsx";
import EditProfilePage from "./pages/editProfilePage.jsx";
import TrackDeposit from "./components/wallet/deposit/trackDeposit.jsx";
import { Helmet, HelmetProvider } from "react-helmet-async";
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [headerKey, setHeaderKey] = useState(0);
  const { uuid } = useParams();
  const [prevLocation, setPrevLocation] = useState("");
  const restrictedPaths = [
    "/myassets",
    "/buy",
    "/wallet",
    "/companies",
    "/messagebox",
    "/ticket",
    `/chat/${uuid}`,
    "/profile",
  ];
  useEffect(() => {
    // Check if the navigation is from /login to /
    if (prevLocation === "/login" && location.pathname === "/") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (prevLocation === "/" && location.pathname === "/signup") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (prevLocation === "/signup" && location.pathname === "/") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/login" && prevLocation === "/profile") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/profile" && prevLocation === "/login") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/myassets" && prevLocation === "/login") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/" && prevLocation === "/profile") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/login" && prevLocation === "/") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/login" && prevLocation === "/messagebox") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/messagebox" && prevLocation === "/login") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/login" && prevLocation === "/wallet") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/login" && prevLocation === "/wallet") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/login" && prevLocation === "/ticket") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/login" && prevLocation === "/companies") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname.startsWith("/buy") && prevLocation === "/login") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname.startsWith("/chat") && prevLocation === "/login") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/" && prevLocation === "/companies") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/companies") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    if (location.pathname === "/login") {
      setHeaderKey((prevKey) => prevKey + 1);
    }
    // console.log('pathname' +location.pathname);
    // console.log('prevLocation'+prevLocation);
    setPrevLocation(location.pathname);
  }, [location, prevLocation]);

  useEffect(() => {
    const mobile = Cookies.get("flutter.mobile");
    const netCode = Cookies.get("flutter.netCode");
    const fullname = localStorage.getItem("userFullName");
    if (restrictedPaths.some((path) => location.pathname.startsWith(path))) {
      if (!mobile) {
        navigate("/login");
      } else if (!fullname) {
        navigate("/signup");
      }
    }
  }, [location, navigate]);
  return (
    <>
      <Helmet>
        <title> اسمارت فاندینگ سکوی تامین مالی جمعی، کرادفاندینگ </title>
      </Helmet>
      <Header key={headerKey} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:uuid" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/project/:uuid" element={<ProjectDetailPage />} />
          <Route
            path="/project/:uuid/:uuidInvite"
            element={<ProjectDetailPage />}
          />
          <Route path="/buy/:uuid" element={<BuyPage />} />
          <Route path="/myassets" element={<MyAssetsPage />} />
          <Route path="/deposit/:id" element={<WalletPage />} />
          {/* <Route path="/wallet/withdraw" element={<WithdrawPage />} />  */}
          {/* <Route path="/deposit" element={<TrackDeposit />} /> */}
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/messagebox" element={<MessageBoxPage />} />
          <Route path="/ticket" element={<InputTicketPage />} />
          <Route path="/ticket/:uuid" element={<InputTicketPage />} />
          <Route path="/chat/:uuid" element={<ChatBoxPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      </div>
      <BottomNavBar />
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
};

export default App;
