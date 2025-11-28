import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Historia from "./pages/Historia";
import Preparacion from "./pages/Preparacion";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import Terminos from "./pages/Terminos";
import NotFound from "./components/NotFound";
import AdminOrders from "./pages/admin/AdminDashboard.jsx";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/auth/AuthModal.jsx";
import OrdersPage from "./pages/admin/SearchOrdersPage.jsx";
import SearchUsersPage from "./pages/admin/SearchUsersPage.jsx";
import DeleteUsersPage from "./pages/admin/DeleteUsersPage.jsx";
import ChangeRolePage from "./pages/admin/ChangeRolePage.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AdminStats from "./pages/admin/AdminStats.jsx";
import { setNavigate } from "../src/utils/api.js";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage.jsx";
import LocationsPage from "./pages/LocationsPage.jsx";
import AdminSecurity from "./pages/admin/AdminSecurityAccounts.jsx";
import AdminLogs from "./pages/admin/AdminLogsViewer.jsx";
import AccountLocked from "./pages/AccountLocketPage.jsx";

function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const navigate = useNavigate();
  setNavigate(navigate);

  useEffect(() => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});
    if (!cookies["cookie_consent"]) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    setShowCookieConsent(false);
  };

  const handleDeclineCookies = () => {
    setShowCookieConsent(false);
  };

  return (
    <AuthProvider>
      <Header />
      <ScrollToTop />

      {showCookieConsent && (
        <div className="cookie-consent-container">
          <CookieConsent
            onAccept={handleAcceptCookies}
            onDecline={handleDeclineCookies}
          />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/aromaHistoria" element={<Historia />} />
        <Route path="/ubicaciones" element={<LocationsPage />} />
        <Route path="/preparacion" element={<Preparacion />} />
        <Route path="/terminos&condiciones" element={<Terminos />} />
        <Route path="/successfullPayment" element={<Success />} />
        <Route path="/paymentCanceled" element={<Cancel />} />
        <Route path="/account-locked" element={<AccountLocked />} />
        {/*Pages Admin*/}
        <Route path="/admin" element={<AdminOrders />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/users/search" element={<SearchUsersPage />} />
        <Route path="/admin/users/delete" element={<DeleteUsersPage />} />
        <Route path="/admin/users/role" element={<ChangeRolePage />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
        <Route path="/admin/security-accounts" element={<AdminSecurity />} />
        <Route path="/admin/logs-viewer" element={<AdminLogs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <AuthModal />
    </AuthProvider>
  );
}

export default App;
