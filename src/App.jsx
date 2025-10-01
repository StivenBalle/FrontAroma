import { Routes, Route, Form } from "react-router-dom";
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

function App() {
  return (
    <AuthProvider>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aromaHistoria" element={<Historia />} />
        <Route path="/preparacion" element={<Preparacion />} />
        <Route path="/terminos&condiciones" element={<Terminos />} />
        <Route path="/successfullPayment" element={<Success />} />
        <Route path="/paymentCanceled" element={<Cancel />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <AuthModal />
    </AuthProvider>
  );
}

export default App;
