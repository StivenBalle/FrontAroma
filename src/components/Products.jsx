import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import logoCafe from "../assets/LogoCafe.png";
import bolsaCafe from "../assets/Bolsa_café.png";
import { useAuth } from "../context/AuthContext";
import { getConfig, getProducts, getProfile, createCheckout } from "../api.js";
import "../styles/header.css";

const Products = () => {
  const { openAuthModal } = useAuth();
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastProductCount, setLastProductCount] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("📡 Obteniendo configuración...");
        await getConfig();

        console.log("📦 Obteniendo productos...");
        const data = await getProducts();

        setProducts(data.products);
        setPrices(data.prices);

        const activeCount = data.prices.filter((el) => {
          const product = data.products.find((p) => p.id === el.product);
          return el.active && product?.active;
        }).length;
        setLastProductCount(activeCount);
      } catch (err) {
        console.error("❌ Error cargando productos:", err.message);
        Swal.fire("Error", "No se pudieron cargar los productos", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    // 🔹 Iniciar polling para nuevos productos
    const intervalId = setInterval(async () => {
      try {
        const data = await getProducts();
        const currentActiveCount = data.prices.filter((el) => {
          const product = data.products.find((p) => p.id === el.product);
          return el.active && product?.active;
        }).length;

        if (currentActiveCount > lastProductCount) {
          Swal.fire({
            icon: "info",
            title: "¡Nuevos productos disponibles!",
            text: "¿Deseas recargar la página para verlos?",
            showCancelButton: true,
            confirmButtonText: "Sí, recargar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
          setLastProductCount(currentActiveCount);
        }
      } catch (err) {
        console.warn("Error al verificar productos nuevos:", err.message);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [lastProductCount]);

  // 🔹 Verificar si el usuario está autenticado
  const isUserLoggedIn = async () => {
    try {
      const res = await getProfile();
      return !!res;
    } catch {
      return false;
    }
  };

  // 🔹 Manejar click en producto y checkout
  const handleCheckout = async (priceId) => {
    const loggedIn = await isUserLoggedIn();
    if (!loggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para comprar.",
        confirmButtonText: "Iniciar sesión",
      }).then(() => {
        openAuthModal();
      });
      return;
    }

    try {
      const session = await createCheckout(priceId);
      window.location.href = session.url;
    } catch (err) {
      console.error("❌ Error Stripe:", err.message);
      Swal.fire("Error", "No se pudo iniciar el pago", "error");
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  // 🔹 Filtrar precios activos y verificar si hay productos
  const activePrices = prices.filter((price) => {
    const product = products.find((p) => p.id === price.product);
    return price.active && product?.active;
  });

  if (!activePrices.length) {
    return (
      <div className="no-products">
        <div className="no-products-content">
          <img src={logoCafe} alt="Sin productos" />
          <h3>¡Ups! No hay productos disponibles</h3>
          <p>Vuelve pronto, estamos preparando nuevos aromas para ti ☕</p>
        </div>
      </div>
    );
  }

  return (
    <section className="products">
      <h2>Nuestros Productos</h2>
      <div className="product-grid" id="bolsas">
        {" "}
        {/* 🔹 Mantengo id="bolsas" para compatibilidad */}
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
              className="product-card bolsa" // 🔹 Clase "bolsa" para estilizar como en tu template
              data-price={price.id}
              onClick={() => handleCheckout(price.id)}
            >
              <figure>
                <img
                  src={product.images?.[0] || bolsaCafe}
                  alt={product.name}
                />
                <figcaption>
                  {product.name} <br /> {formattedPrice}
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;
