import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import LogoCafe from "../assets/LogoCafe.png";
import { getReviews } from "../utils/api.js";
import logger from "../utils/logger.js";

const TestimonialSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchReviews();
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews();
      setReviews(data.reviews || []);
    } catch (error) {
      logger.error("Error al cargar reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  const shouldScroll =
    (!isMobile && reviews.length > 3) || (isMobile && reviews.length > 1);

  if (loading) {
    return (
      <div className="loading-products">
        <div className="loading-content">
          <div className="spinner"></div>
          <h3>Cargando testimonios...</h3>
        </div>
      </div>
    );
  }

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>Lo que dicen nuestros clientes</h2>
        <p>Testimonios reales de amantes del café como tú</p>
      </div>

      {/* Caso sin reseñas */}
      {reviews.length === 0 ? (
        <div className="no-products">
          <div className="no-products-content">
            <img
              src={LogoCafe}
              alt="sin comentarios"
              className="no-products-img"
            />
            <h3>¡Ups! Por ahora no hay ningún comentario</h3>
            <p>Sé el primero en comentar y ayúdanos a crecer ☕</p>
          </div>
        </div>
      ) : shouldScroll ? (
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          grabCursor={true}
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="testimonials-carousel"
        >
          {reviews.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
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
                <p className="testimonial-text">
                  "{testimonial.comment || testimonial.text}"
                </p>
                <p className="testimonial-name">
                  Testigo:{" "}
                  <span className="testimonial-author">{testimonial.name}</span>
                </p>
                {testimonial.created_at && (
                  <p className="testimonial-date">
                    {new Date(testimonial.created_at).toLocaleDateString(
                      "es-CO",
                      {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }
                    )}
                  </p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="testimonials-static">
          {reviews.map((testimonial, index) => (
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
              <p className="testimonial-text">
                "{testimonial.comment || testimonial.text}"
              </p>
              <p className="testimonial-name">
                Testigo:{" "}
                <span className="testimonial-author">{testimonial.name}</span>
              </p>
              {testimonial.created_at && (
                <p className="testimonial-date">
                  {new Date(testimonial.created_at).toLocaleDateString(
                    "es-CO",
                    {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TestimonialSection;
