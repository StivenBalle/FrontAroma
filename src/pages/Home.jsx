import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import logoCafe from "../assets/LogoCafe.png";
import semillero from "../assets/Semillero.jpeg";
import bolsaCafe from "../assets/Bolsa_café.png";
import cafeRojo from "../assets/CaféRojo.jpeg";
import bolsaPresentacion from "../assets/BolsaPresentación.jpeg";
import tostado from "../assets/Tostado.jpeg";
import { getConfig, getProducts, getProfile, createCheckout } from "../api.js";
import "../App.css";

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
        console.log(
          "✅ Productos obtenidos:",
          data.products.length,
          "productos"
        );
        setProducts(data.products);
        setPrices(data.prices);
      } catch (err) {
        console.error("❌ Error inicializando:", err.message);
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
      await getProfile();
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

      console.error("❌ Error Stripe:", err.message);
      Swal.fire("Error", "No se pudo iniciar el pago", "error");
    }
  };

  const handleComprarClick = () => {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
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
          console.warn("❌ Error al verificar productos nuevos:", err.message);
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

  const renderIcon = (iconName) => {
    const icons = {
      coffee: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="feature-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      fire: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="feature-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
          />
        </svg>
      ),
      truck: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="feature-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      ),
      award: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="feature-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Café <br /> Aroma de la Serrania
            </h1>
            <p>Café 100% Aguachiquense.</p>
            <p>Tostado y molido artesanalmente.</p>
            <p>¡Disponible en nuestra página web!</p>
            <button className="btn-comprar" onClick={handleComprarClick}>
              Comprar
            </button>
          </div>

          <section className="carrusel">
            <img src={semillero} alt="Semillero" />
            <img src={cafeRojo} alt="Café Rojo" />
            <img src={bolsaPresentacion} alt="Bolsa Café" />
          </section>
        </div>
      </section>

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
      <section className="preparacion">
        <div className="tittle-tostado">
          <h2>Tipos de tostado</h2>
          <p>
            En café Aroma de la serrania tenemos varios tipos de tostados según
            tu tipo de preferencia.
          </p>
          <img src={tostado} alt="Tostado" />
        </div>

        <div className="footer-text-tostado-container">
          <div className="footer-text-tostado">
            <h3>Tostado Claro</h3>
            <p>
              Suave y ligero, ideal para quienes disfrutan notas más delicadas y
              cítricas.
            </p>
          </div>

          <div className="footer-text-tostado">
            <h3>Tostado Medio</h3>
            <p>
              Perfecto equilibrio entre acidez y dulzura, con un sabor redondo y
              aromático.
            </p>
          </div>

          <div className="footer-text-tostado">
            <h3>Tostado Medio-Oscuro</h3>
            <p>Intensidad moderada con un toque de chocolate y caramelo.</p>
          </div>

          <div className="footer-text-tostado">
            <h3>Tostado Oscuro</h3>
            <p>
              Robusto y con carácter, para quienes aman el sabor fuerte y
              ahumado.
            </p>
          </div>
        </div>
      </section>

      {/* UBICACIONES */}
      <section className="locations">
        <h2>Centros de Experiencia</h2>
        <div className="location-grid">
          <div className="location-card">
            <img src="/api/placeholder/300/200" alt="Punto de venta oficial" />
            <div className="location-card-content">
              <h3>Tienda donde Melo</h3>
              <p>Cra. 39 # 10N - 10</p>
              <a href="#" className="btn">
                MÁS INFORMACIÓN
              </a>
            </div>
          </div>
          <div className="location-card">
            <img src="/api/placeholder/300/200" alt="Lugar de procesamiento" />
            <div className="location-card-content">
              <h3>Lugar de procesamiento</h3>
              <p>Cra. 39B # 11N - 15</p>
              <a href="#" className="btn">
                MÁS INFORMACIÓN
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="testimonials-section">
        <div className="testimonials-header">
          <h2>Lo que dicen nuestros clientes</h2>
          <p>Testimonios reales de amantes del café como tú ☕</p>
        </div>
        <div className="testimonials-carousel">
          <div className="testimonials-track">
            {[
              {
                name: "Laura Gómez",
                rating: 5,
                text: "El mejor café que he probado. Su aroma y sabor son inigualables.",
              },
              {
                name: "Carlos Pérez",
                rating: 4,
                text: "Excelente calidad y presentación. Recomendadísimo para los amantes del café.",
              },
              {
                name: "Mariana Torres",
                rating: 5,
                text: "Me encanta su sabor suave y tostado. Se nota que es artesanal.",
              },
              {
                name: "Andrés Rojas",
                rating: 4,
                text: "Muy buen servicio y café delicioso. Volveré a comprar sin dudarlo.",
              },
              {
                name: "Sofía Hernández",
                rating: 5,
                text: "Perfecto para mis mañanas, el empaque es precioso y el sabor aún mejor.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="star"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-name">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
