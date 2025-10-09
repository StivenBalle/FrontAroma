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
      try {
        // Obtener la clave pública de Stripe
        const config = await getConfig();

        // Inicializar Stripe
        const stripeInstance = window.Stripe(config.publishableKey);
        setStripe(stripeInstance);

        // Obtener productos y precios
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
      // Verificar sesión
      await getProfile();

      // Crear sesión de checkout
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

      <section className="products" id="products">
        <h2>Nuestros Productos</h2>
        {loading ? (
          <div className="loading-products">
            <div className="loading-content">
              <div className="spinner"></div>
              <h3>Cargando productos...</h3>
            </div>
          </div>
        ) : activePrices.length === 0 ? (
          <div id="no-products" className="no-products">
            <div className="no-products-content">
              <img
                src={logoCafe}
                alt="Sin productos"
                className="no-products-img"
              />
              <h3>¡Ups! No hay productos disponibles</h3>
              <p>Vuelve pronto, estamos preparando nuevos aromas para ti ☕</p>
            </div>
          </div>
        ) : (
          <div className="product-grid" id="bolsas">
            {activePrices.map((price) => {
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
                  className="product-card bolsa"
                  data-price={price.id}
                  onClick={() => handleCheckout(price.id)}
                >
                  <figure>
                    <img
                      src={product.images?.[0] || bolsaCafe}
                      alt={product.name || "Producto sin nombre"}
                    />
                    <figcaption>
                      {product.name || "Sin nombre"} <br /> {formattedPrice}
                    </figcaption>
                  </figure>
                </div>
              );
            })}
          </div>
        )}
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
        <h2>CENTROS DE EXPERIENCIA</h2>
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
    </>
  );
}

export default App;
