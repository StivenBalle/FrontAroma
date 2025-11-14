import React, { useState, useEffect } from "react";
import semillero from "../assets/Semillero.jpeg";
import cafeRojo from "../assets/CaféRojo.jpeg";
import bolsaPresentacion from "../assets/BolsaPresentación.jpeg";
import "../App.css";
import {
  Award,
  CircleCheckBig,
  Coffee,
  Handbag,
  ShieldCheck,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";

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
            <Award strokeWidth="2.5px" />
            <span>100% Café Aguachiquense</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line-1">Café</span>
            <span className="title-line-2">Aroma de la</span>
            <span className="title-line-3">Serrania</span>
          </h1>
          <div className="hero-features">
            <div className="feature-item">
              <CircleCheckBig strokeWidth="2.5px" color="green" />
              <span>100% Natural</span>
            </div>
            <div className="feature-item">
              <CircleCheckBig strokeWidth="2.5px" color="green" />

              <span>Tostado Artesanal</span>
            </div>
            <div className="feature-item">
              <CircleCheckBig strokeWidth="2.5px" color="green" />
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
              <Handbag strokeWidth="2.5px" />
              Comprar Ahora
              <div className="btn-shine"></div>
            </button>
          </div>
          <div className="hero-info-tags">
            <span className="info-tag">
              <TriangleAlert strokeWidth="2.5px" color="yellow" />
              Envío a toda Colombia
            </span>
            <span className="info-tag">
              <ShoppingCart strokeWidth="2.5px" />
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
                  <Coffee strokeWidth="2px" color="white" />
                </div>
              </div>
            ))}
          </div>

          <div className="quality-badge">
            <div className="badge-circle">
              <ShieldCheck strokeWidth="2px" color="white" />
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
