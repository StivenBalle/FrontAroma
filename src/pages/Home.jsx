import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import logoCafe from "../assets/LogoCafe.png";
import bolsaCafe from "../assets/Bolsa_café.png";
import TestimonialSection from "../components/TestimonialSection.jsx";
import HeroSection from "../components/HeroSection.jsx";
import tostado from "../assets/Tostado.jpeg";
import logger from "../utils/logger";
import {
  getConfig,
  getProducts,
  getProfile,
  createCheckout,
  getShippingAddress,
} from "../utils/api.js";
import "../App.css";
import { Link } from "react-router-dom";
import {
  Bean,
  Coffee,
  Egg,
  FileText,
  Flame,
  Info,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

function App() {
  const { openAuthModal } = useAuth();
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stripe, setStripe] = useState(null);

  // 🔹 Cargar Stripe y productos
  useEffect(() => {
    async function initApp() {
      setLoading(true);
      try {
        const config = await getConfig();
        const stripeInstance = window.Stripe(config.publishableKey);
        setStripe(stripeInstance);

        const data = await getProducts();
        logger.log(
          "✅ Productos obtenidos:",
          data.products.length,
          "productos"
        );
        setProducts(data.products);
        setPrices(data.prices);
      } catch (err) {
        logger.error("❌ Error inicializando:", err.message);
        Swal.fire("Error", "No se pudieron cargar los productos", "error");
      } finally {
        setLoading(false);
      }
    }

    if (window.Stripe) {
      initApp();
    } else {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.onload = initApp;
      document.head.appendChild(script);
    }
  }, []);

  // 🔹 Iniciar checkout
  const handleCheckout = async (priceId) => {
    try {
      const profile = await getProfile();
      const addressData = await getShippingAddress();

      const missingFields = [];
      if (!profile.name) missingFields.push("nombre");
      if (!profile.phone_number) missingFields.push("teléfono");
      if (!addressData.address) missingFields.push("dirección de envío");

      if (missingFields.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Completa tu perfil",
          html: `
          <p>Antes de realizar una compra, debes completar tu perfil:</p>
          <ul style="text-align:left; margin:10px 0 0 20px;">
            ${missingFields.map((f) => `<li>${f}</li>`).join("")}
          </ul>
        `,
          confirmButtonText: "Ir al perfil",
          confirmButtonColor: "#4a2c2a",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/profile";
          }
        });
        return;
      }
      const session = await createCheckout(priceId);
      window.location.href = session.url;
    } catch (err) {
      if (err.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Inicia sesión",
          text: "Debes iniciar sesión para comprar.",
          confirmButtonText: "Iniciar sesión",
        }).then(() => openAuthModal());
        return;
      }

      logger.error("❌ Error Stripe:", err.message);
      Swal.fire("Error", "No se pudo iniciar el pago", "error");
    }
  };

  // 🔹 Polling para nuevos productos
  useEffect(() => {
    let lastProductCount = 0;

    const startPollingForNewProducts = () => {
      const interval = setInterval(async () => {
        try {
          const data = await getProducts();
          const currentProducts = data.products;
          const currentPrices = data.prices;

          const currentActiveCount = currentPrices.filter((el) => {
            const product = currentProducts.find((p) => p.id === el.product);
            return el.active && product?.active;
          }).length;

          if (currentActiveCount > lastProductCount && lastProductCount > 0) {
            Swal.fire({
              icon: "info",
              title: "¡Nuevos productos disponibles!",
              text: "¿Deseas recargar la página para verlos?",
              showCancelButton: true,
              confirmButtonText: "Recargar",
              cancelButtonText: "Cancelar",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          }
          lastProductCount = currentActiveCount;
        } catch (err) {
          logger.warn("❌ Error al verificar productos nuevos:", err.message);
        }
      }, 60000);

      return () => clearInterval(interval);
    };

    if (!loading) {
      startPollingForNewProducts();
    }
  }, [loading]);

  // 🔹 Filtrar productos y precios activos
  const activePrices = prices.filter((price) => {
    const product = products.find((p) => p.id === price.product);
    return price.active && product?.active;
  });

  const features = [
    {
      title: "100% Colombiano",
      description:
        "Granos de café cultivados en las mejores tierras de Aguachica, con calidad premium.",
      icon: "coffee",
    },
    {
      title: "Tostado Artesanal",
      description:
        "Proceso cuidadoso y tradicional que resalta los mejores sabores de cada grano.",
      icon: "fire",
    },
    {
      title: "Envío Rápido",
      description: "Recibe tu café fresco en la puerta de tu casa.",
      icon: "truck",
    },
    {
      title: "Calidad Garantizada",
      description:
        "Seleccionamos cada grano para asegurar la mejor experiencia de sabor.",
      icon: "award",
    },
  ];

  const roastTypes = [
    {
      id: 1,
      title: "Tostado Claro",
      description:
        "Suave y ligero, ideal para quienes disfrutan notas más delicadas y cítricas.",
      color: "#D4A574",
      intensity: 1,
      notes: ["Cítricos", "Floral", "Té"],
    },
    {
      id: 2,
      title: "Tostado Medio",
      description:
        "Perfecto equilibrio entre acidez y dulzura, con un sabor redondo y aromático.",
      color: "#B8895F",
      intensity: 2,
      notes: ["Caramelo", "Nueces", "Frutal"],
    },
    {
      id: 3,
      title: "Tostado Medio-Oscuro",
      description: "Intensidad moderada con un toque de chocolate y caramelo.",
      color: "#8B6F47",
      intensity: 3,
      notes: ["Chocolate", "Caramelo", "Especias"],
    },
    {
      id: 4,
      title: "Tostado Oscuro",
      description:
        "Robusto y con carácter, para quienes aman el sabor fuerte y ahumado.",
      color: "#6B4423",
      intensity: 4,
      notes: ["Ahumado", "Cacao", "Robusto"],
    },
  ];

  const renderIcon = (iconName) => {
    const icons = {
      coffee: <FileText strokeWidth="2.8px" color="orange" size={30} />,
      fire: <Flame strokeWidth="2.8px" color="orange" size={30} />,
      truck: <Truck strokeWidth="2.8px" color="orange" size={30} />,
      award: <ShieldCheck strokeWidth="3px" color="orange" size={30} />,
    };
    return icons[iconName] || null;
  };

  return (
    <>
      {/* HERO */}
      <HeroSection />
      {/* PRODUCTOS DESTACADOS */}
      <section className="products-section" id="products">
        <div className="products-container">
          <div className="products-header">
            <h2 className="products-title">Productos Destacados</h2>
            <p className="products-subtitle">
              Nuestros cafés más populares y mejor valorados
            </p>
          </div>

          {loading ? (
            <div className="loading-products">
              <div className="loading-content">
                <div className="spinner"></div>
                <h3>Cargando productos...</h3>
              </div>
            </div>
          ) : activePrices.length === 0 ? (
            <div className="no-products">
              <div className="no-products-content">
                <img
                  src={logoCafe}
                  alt="Sin productos"
                  className="no-products-img"
                />
                <h3>¡Ups! No hay productos disponibles</h3>
                <p>
                  Vuelve pronto, estamos preparando nuevos aromas para ti ☕
                </p>
              </div>
            </div>
          ) : (
            <div className="products-grid">
              {activePrices.map((price, index) => {
                const product = products.find((p) => p.id === price.product);
                if (!product) return null;

                const amount = price.unit_amount / 100;
                const formattedPrice = new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: price.currency.toUpperCase(),
                }).format(amount);

                return (
                  <div
                    key={price.id}
                    className="product-card-modern"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="product-image-container">
                      <img
                        src={product.images?.[0] || bolsaCafe}
                        alt={product.name || "Producto sin nombre"}
                        className="product-image"
                      />
                    </div>
                    <div className="product-content">
                      <h3 className="product-name">
                        {product.name || "Sin nombre"}
                      </h3>
                      <p className="product-description">
                        {product.description ||
                          "Café premium 100% colombiano con notas únicas de sabor."}
                      </p>
                      <div className="product-footer">
                        <span className="product-price">{formattedPrice}</span>
                        <button
                          className="btn-buy-product"
                          onClick={() => handleCheckout(price.id)}
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="why-choose-section">
        <div className="why-choose-container">
          <div className="why-choose-header">
            <h2 className="why-choose-title">
              ¿Por qué elegir Café Aroma de la serranía?
            </h2>
            <p className="why-choose-subtitle">
              Nos dedicamos a ofrecerte la mejor experiencia de café, desde la
              selección de granos hasta la entrega en tu hogar.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon-container">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIPOS DE TOSTADO */}
      <section className="roasting-section">
        <div className="roasting-header">
          <div className="roasting-title-container">
            <h2 className="roasting-title">Tipos de Tostado</h2>
            <p className="roasting-description">
              En café Aroma de la Serrania tenemos varios tipos de tostados
              según tu tipo de preferencia. Cada nivel revela diferentes
              características y matices de nuestros granos selectos.
            </p>
          </div>

          <div className="roasting-image-container">
            <div className="image-wrapper">
              <img
                src={tostado}
                alt="Proceso de Tostado"
                className="roasting-image"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <ShoppingCart strokeWidth="3px" />
                  <span>Granos de alta calidad</span>
                </div>
              </div>
            </div>
            <div className="floating-bean bean-1"></div>
            <div className="floating-bean bean-2"></div>
            <div className="floating-bean bean-3"></div>
          </div>
        </div>

        <div className="roasting-grid">
          {roastTypes.map((roast, index) => (
            <div
              key={roast.id}
              className="roast-card"
              style={{
                "--card-color": roast.color,
                "--animation-delay": `${index * 0.1}s`,
              }}
            >
              <div className="intensity-indicator">
                <div className="intensity-bars">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`intensity-bar ${
                        bar <= roast.intensity ? "active" : ""
                      }`}
                      style={{
                        backgroundColor:
                          bar <= roast.intensity ? roast.color : "#e5e7eb",
                      }}
                    ></div>
                  ))}
                </div>
                <span className="intensity-label">
                  Intensidad {roast.intensity}/4
                </span>
              </div>
              <div className="roast-content">
                <div
                  className="roast-icon"
                  style={{ backgroundColor: roast.color }}
                >
                  <Coffee strokeWidth="3px" color="white" />
                </div>

                <h3 className="roast-title-card">{roast.title}</h3>
                <p className="roast-description-card">{roast.description}</p>
                <div className="flavor-notes">
                  <span className="notes-label">Notas características:</span>
                  <div className="notes-tags">
                    {roast.notes.map((note, i) => (
                      <span
                        key={i}
                        className="note-tag"
                        style={{ borderColor: roast.color }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="coffee-beans-display">
                  {[1, 2, 3].map((bean) => (
                    <Egg
                      strokeWidth="4px"
                      key={bean}
                      color={roast.color}
                      fill={roast.color}
                    />
                  ))}
                </div>
              </div>
              <div
                className="card-glow"
                style={{ backgroundColor: roast.color }}
              ></div>
            </div>
          ))}
        </div>

        <div className="roasting-footer">
          <p className="footer-text-roasting">
            <Info strokeWidth="2.8px" color="orange" size={20} />
            Cada tostado es cuidadosamente supervisado para garantizar la máxima
            calidad
          </p>
        </div>
      </section>

      {/* UBICACIONES */}
      <section className="locations">
        <h2>Centros de Experiencia</h2>
        <div className="location-grid">
          <div className="location-card">
            <img src={logoCafe} alt="Punto de venta oficial" />
            <div className="location-card-content">
              <h3>Tienda donde Melo</h3>
              <p>Cra. 39 # 10N - 10</p>
              <Link to="/ubicaciones" className="btn">
                MÁS INFORMACIÓN
              </Link>
            </div>
          </div>
          <div className="location-card">
            <img src={logoCafe} alt="Lugar de Procesamiento" />
            <div className="location-card-content">
              <h3>Lugar de Procesamiento</h3>
              <p>Cra. 39B # 11N - 15</p>
              <Link to="/ubicaciones" className="btn">
                MÁS INFORMACIÓN
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection />
    </>
  );
}

export default App;
