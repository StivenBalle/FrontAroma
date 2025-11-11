import React, { useState } from "react";
import "../App.css";
import logoCafe from "../assets/LogoCafe.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ShoppingHistory from "./ShoppingHistory";

export default function Header() {
  const { user, openAuthModal } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <svg
                className="svgIcon"
                viewBox="0 0 104 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100.5 40.75V96.5H66V68.5V65H62.5H43H39.5V68.5V96.5H3.5V40.75L52 4.375L100.5 40.75Z"
                  stroke="black"
                  strokeWidth="7"
                ></path>
              </svg>
            </a>

            {/* Login/Logout */}
            {!user ? (
              <a
                href="#"
                className="tab"
                id="show-form-button"
                onClick={openAuthModal}
              >
                <svg
                  width="104"
                  height="100"
                  viewBox="0 0 104 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="21.5"
                    y="3.5"
                    width="60"
                    height="60"
                    rx="30"
                    stroke="black"
                    strokeWidth="7"
                  />
                  <g clipPath="url(#clip0_41_27)">
                    <mask
                      id="mask0_41_27"
                      style={{ maskType: "luminance" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="61"
                      width="104"
                      height="52"
                    >
                      <path
                        d="M0 113C0 84.2812 23.4071 61 52.1259 61C80.706 61 104 84.4199 104 113H0Z"
                        fill="white"
                      />
                    </mask>
                    <g mask="url(#mask0_41_27)">
                      <path
                        d="M-7 113C-7 80.4152 19.4152 54 52 54H52.2512C84.6973 54 111 80.3027 111 112.749H97C97 88.0347 76.9653 68 52.2512 68H52C27.1472 68 7 88.1472 7 113H-7ZM-7 113C-7 80.4152 19.4152 54 52 54V68C27.1472 68 7 88.1472 7 113H-7ZM52.2512 54C84.6973 54 111 80.3027 111 112.749V113H97V112.749C97 88.0347 76.9653 68 52.2512 68V54Z"
                        fill="black"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_41_27">
                      <rect
                        width="104"
                        height="39"
                        fill="white"
                        transform="translate(0 61)"
                      />
                    </clipPath>
                  </defs>
                </svg>
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
            {user && user.role === "admin" && (
              <Link to="/admin" className="tab">
                <svg
                  viewBox="0 0 20 24"
                  fill="none"
                  height="30"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  class="svg w-6 h-6 text-gray-800 dark:text-white"
                >
                  <path
                    d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="square"
                    stroke="currentColor"
                  ></path>
                </svg>
              </Link>
            )}

            {/* Carrito de compras */}
            <a
              href="#"
              className="tab search-icon-wrapper"
              id="shopping-cart"
              onClick={toggleHistory}
            >
              <svg
                className="icon"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Tarjeta del menú hamburguesa (visible en pantallas pequeñas) */}
        {isMenuOpen && (
          <div className="mobile-menu-card">
            <a href="#" className="mobile-menu-item" onClick={closeMenu}>
              Máquinas y equipos
            </a>
            <Link
              to="/aromaHistoria"
              className="mobile-menu-item"
              onClick={closeMenu}
            >
              Nuestra historia
            </Link>
            <a href="#" className="mobile-menu-item" onClick={closeMenu}>
              Ubicaciones
            </a>
            <a href="/" className="mobile-menu-item" onClick={closeMenu}>
              <svg
                className="svgIcon"
                viewBox="0 0 104 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100.5 40.75V96.5H66V68.5V65H62.5H43H39.5V68.5V96.5H3.5V40.75L52 4.375L100.5 40.75Z"
                  stroke="black"
                  strokeWidth="7"
                ></path>
              </svg>
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
                <svg
                  width="104"
                  height="100"
                  viewBox="0 0 104 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="21.5"
                    y="3.5"
                    width="60"
                    height="60"
                    rx="30"
                    stroke="black"
                    strokeWidth="7"
                  />
                  <g clipPath="url(#clip0_41_27)">
                    <mask
                      id="mask0_41_27"
                      style={{ maskType: "luminance" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="61"
                      width="104"
                      height="52"
                    >
                      <path
                        d="M0 113C0 84.2812 23.4071 61 52.1259 61C80.706 61 104 84.4199 104 113H0Z"
                        fill="white"
                      />
                    </mask>
                    <g mask="url(#mask0_41_27)">
                      <path
                        d="M-7 113C-7 80.4152 19.4152 54 52 54H52.2512C84.6973 54 111 80.3027 111 112.749H97C97 88.0347 76.9653 68 52.2512 68H52C27.1472 68 7 88.1472 7 113H-7ZM-7 113C-7 80.4152 19.4152 54 52 54V68C27.1472 68 7 88.1472 7 113H-7ZM52.2512 54C84.6973 54 111 80.3027 111 112.749V113H97V112.749C97 88.0347 76.9653 68 52.2512 68V54Z"
                        fill="black"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_41_27">
                      <rect
                        width="104"
                        height="39"
                        fill="white"
                        transform="translate(0 61)"
                      />
                    </clipPath>
                  </defs>
                </svg>
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
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="mobile-menu-item"
                onClick={closeMenu}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  class="svg w-6 h-6 text-gray-800 dark:text-white"
                >
                  <path
                    d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="square"
                    stroke="currentColor"
                  ></path>
                </svg>
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
              <svg
                className="icon"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Historial
            </a>
          </div>
        )}
      </nav>
      <ShoppingHistory isOpen={historyOpen} toggleHistory={toggleHistory} />
    </header>
  );
}
