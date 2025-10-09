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
import AdminOrders from "./components/AdminOrders";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";
import OrdersPage from "./pages/OrdersPage.jsx";
import SearchUsersPage from "./pages/SearchUsersPage.jsx";
import DeleteUsersPage from "./pages/DeleteUsersPage.jsx";
import ChangeRolePage from "./pages/ChangeRolePage.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import PhoneInput from "./components/PhoneInput.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { setNavigate } from "./api.js";

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

      <PhoneInput />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aromaHistoria" element={<Historia />} />
        <Route path="/preparacion" element={<Preparacion />} />
        <Route path="/terminos&condiciones" element={<Terminos />} />
        <Route path="/successfullPayment" element={<Success />} />
        <Route path="/paymentCanceled" element={<Cancel />} />
        {/*Pages Admin*/}
        <Route path="/admin" element={<AdminOrders />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/users/search" element={<SearchUsersPage />} />
        <Route path="/admin/users/delete" element={<DeleteUsersPage />} />
        <Route path="/admin/users/role" element={<ChangeRolePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <AuthModal />
    </AuthProvider>
  );
}

export default App;
