import React, { useState, useEffect } from "react";
import "../App.css";
import logoCafe from "../assets/LogoCafe.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../utils/api.js";
import ShoppingHistory from "./ShoppingHistory";
import {
  MapPin,
  Home,
  ShoppingCart,
  UserCog,
  User,
  Tractor,
  HandHeart,
} from "lucide-react";

export default function Header() {
  const { user, setUser, openAuthModal } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const fresh = await getUserProfile();
        if (fresh && fresh.role !== user?.role) {
          setUser(fresh);
        }
      } catch (_) {}
    };

    refreshUser();
  }, []);

  const toggleHistory = () => {
    setHistoryOpen(!historyOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getImageUrl = (image) => {
    if (!image || image.trim() === "") {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:3000${image}`;
  };

  return (
    <header className="header">
      <nav className="nav">
        {/* Brand / Logo */}
        <div className="brand-container">
          <img src={logoCafe} alt="Logo Café" className="logo" />
          <h1 className="brand-name">
            <span>Café</span>
            <br />
            Aroma de la Serrania
          </h1>
        </div>

        {/* Botón hamburguesa */}
        <button
          className={`hamburger-menu ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links principales */}
        <div className="nav-links">
          <div className="padding-btn">
            <a href="#" className="btn-superiores">
              Máquinas y equipos
            </a>
            <Link to="/aromaHistoria" className="btn-superiores">
              Nuestra historia
            </Link>
            <Link to="/ubicaciones" className="btn-superiores">
              Ubicaciones
            </Link>
          </div>

          {/* Tarjetas de navegación */}
          <div className="navigation-card">
            {/* Home */}
            <a href="/" className="tab">
              <Home strokeWidth="2.5px" />
            </a>

            {/* Login/Logout */}
            {!user ? (
              <a
                href="#"
                className="tab"
                id="show-form-button"
                onClick={openAuthModal}
              >
                <User strokeWidth="2.8px" />
              </a>
            ) : (
              <Link to="/profile" className="tab">
                <div className="user-profile">
                  <div className="user-info">
                    <div className="sign">
                      {getImageUrl(user.image) ? (
                        <img
                          src={getImageUrl(user.image)}
                          alt="Foto de perfil"
                          className="profile-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                            const parent = e.target.parentNode;
                            const initial = document.createElement("span");
                            initial.textContent = user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U";
                            parent.appendChild(initial);
                          }}
                        />
                      ) : (
                        <span>
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Admin link */}
            {user && (user.role === "admin" || user.role === "viewer") && (
              <Link to="/admin" className="tab">
                <UserCog strokeWidth="2.6px" />
              </Link>
            )}

            {/* Carrito de compras */}
            <a
              href="#"
              className="tab"
              id="shopping-cart"
              onClick={toggleHistory}
            >
              <ShoppingCart strokeWidth="2.5px" />
            </a>
          </div>
        </div>

        {/* Tarjeta del menú hamburguesa (visible en pantallas pequeñas) */}
        {isMenuOpen && (
          <div className="mobile-menu-card">
            <a href="#" className="mobile-menu-item" onClick={closeMenu}>
              <Tractor strokeWidth="2.5px" />
              Máquinas y equipos
            </a>
            <Link
              to="/aromaHistoria"
              className="mobile-menu-item"
              onClick={closeMenu}
            >
              <HandHeart strokeWidth="2.5px" />
              Nuestra historia
            </Link>
            <Link
              to="/ubicaciones"
              className="mobile-menu-item"
              onClick={closeMenu}
            >
              <MapPin strokeWidth="2.5px" />
              Ubicaciones
            </Link>
            <a href="/" className="mobile-menu-item" onClick={closeMenu}>
              <Home strokeWidth="2.5px" />
              Home
            </a>
            {!user ? (
              <a
                href="#"
                className="mobile-menu-item"
                onClick={() => {
                  openAuthModal();
                  closeMenu();
                }}
              >
                <User strokeWidth="2.5px" />
                Iniciar Sesión
              </a>
            ) : (
              <Link
                to="/profile"
                className="mobile-menu-item"
                onClick={closeMenu}
              >
                <div className="sign">
                  {getImageUrl(user.image) ? (
                    <img
                      src={getImageUrl(user.image)}
                      alt="Foto de perfil"
                      className="profile-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const parent = e.target.parentNode;
                        const initial = document.createElement("span");
                        initial.textContent = user.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U";
                        parent.appendChild(initial);
                      }}
                    />
                  ) : (
                    <span>
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  )}
                </div>
                Perfil
              </Link>
            )}
            {user && (user.role === "admin" || user.role === "viewer") && (
              <Link
                to="/admin"
                className="mobile-menu-item"
                onClick={closeMenu}
              >
                <UserCog strokeWidth="2.5px" />
                Admin
              </Link>
            )}
            <a
              href="#"
              className="mobile-menu-item"
              onClick={() => {
                toggleHistory();
                closeMenu();
              }}
            >
              <ShoppingCart strokeWidth="2.5px" />
              Historial
            </a>
          </div>
        )}
      </nav>
      <ShoppingHistory isOpen={historyOpen} toggleHistory={toggleHistory} />
    </header>
  );
}
