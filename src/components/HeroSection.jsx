import React, { useState, useEffect } from "react";
import semillero from "../assets/Semillero.jpeg";
import cafeRojo from "../assets/CaféRojo.jpeg";
import bolsaPresentacion from "../assets/BolsaPresentación.jpeg";
import "../App.css";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: semillero,
      alt: "Semillero de Café",
      caption: "De la tierra a tu taza",
    },
    { image: cafeRojo, alt: "Café Rojo", caption: "Granos selectos" },
    {
      image: bolsaPresentacion,
      alt: "Bolsa Café",
      caption: "Presentación premium",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleComprarClick = () => {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-modern">
      <div className="hero-background">
        <div className="coffee-bean-bg bean-bg-1"></div>
        <div className="coffee-bean-bg bean-bg-2"></div>
        <div className="coffee-bean-bg bean-bg-3"></div>
        <div className="steam-effect steam-1"></div>
        <div className="steam-effect steam-2"></div>
        <div className="steam-effect steam-3"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content-modern">
          <div className="hero-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" className="badge-icon">
              <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,10.5V13.5A4.5,4.5 0 0,0 12,18A4.5,4.5 0 0,0 16.5,13.5V10.5A4.5,4.5 0 0,0 12,6A4.5,4.5 0 0,0 7.5,10.5Z" />
            </svg>
            <span>100% Café Aguachiquense</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line-1">Café</span>
            <span className="title-line-2">Aroma de la</span>
            <span className="title-line-3">Serrania</span>
          </h1>
          <div className="hero-features">
            <div className="feature-item">
              <div className="hero-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>100% Natural</span>
            </div>
            <div className="feature-item">
              <div className="hero-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Tostado Artesanal</span>
            </div>
            <div className="feature-item">
              <div className="hero-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Molido al Momento</span>
            </div>
          </div>
          <p className="hero-description">
            Descubre el auténtico sabor del café colombiano cultivado en las
            montañas de Aguachica. Cada grano es seleccionado, tostado y molido
            con dedicación artesanal para brindarte una experiencia única en
            cada taza.
          </p>
          <div className="hero-actions">
            <button className="btn-primary-modern" onClick={handleComprarClick}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="btn-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Comprar Ahora
              <div className="btn-shine"></div>
            </button>
          </div>
          <div className="hero-info-tags">
            <span className="info-tag">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
              </svg>
              Envío a toda Colombia
            </span>
            <span className="info-tag">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
              </svg>
              Compra segura
            </span>
          </div>
        </div>

        <div className="hero-gallery">
          <div className="gallery-main">
            <div className="gallery-slides">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`gallery-slide ${
                    index === currentSlide ? "active" : ""
                  }`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="slide-overlay">
                    <span className="slide-caption">{slide.caption}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="gallery-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="gallery-thumbnails">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`thumbnail ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="thumbnail-overlay">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="quality-badge">
            <div className="badge-circle">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
              </svg>
            </div>
            <div className="badge-text">
              <span className="badge-title">Premium</span>
              <span className="badge-subtitle">Calidad</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
