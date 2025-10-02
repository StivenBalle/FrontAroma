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
import OrdersPage from "./pages/OrdersPage.jsx";
import SearchUsersPage from "./pages/SearchUsersPages.jsx";
import DeleteUsersPage from "./pages/DeleteUsersPage.jsx";
import ChangeRolePage from "./pages/ChangeRolePage.jsx";

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
