import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Check,
  X,
  Navigation,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import cafeteraDomestica from "../assets/CafeteraDoméstica.png";
import cafeteraElectrica from "../assets/CafeteraEléctrica.png";
import cafeteraItaliana from "../assets/CafeteraItaliana.png";
import fondoHero from "../assets/ImageHistoriaFondo.jpeg";
import "../App.css";

const LocationsPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [imageModal, setImageModal] = useState(null);

  const locations = [
    {
      id: 1,
      type: "processing",
      name: "Planta de Procesamiento",
      address: "Vereda Bombeadero, Aguachica, Cesar",
      description:
        "Aquí procesamos y tostamos nuestro café con métodos artesanales, garantizando la máxima calidad en cada grano.",
      coordinates: { lat: 8.3167, lng: -73.6167 },
      phone: "+57 300 123 4567",
      email: "procesamiento@aromaserrania.com",
      hours: "Lunes a Sábado: 7:00 AM - 5:00 PM",
      image: "🏭",
      color: "#8B6F47",
      features: [
        "Tostado artesanal",
        "Control de calidad",
        "Tours disponibles",
      ],
      photos: [cafeteraDomestica, cafeteraElectrica, cafeteraItaliana],
    },
    {
      id: 2,
      type: "store",
      name: "Tienda Principal donde Melo - Aguachica",
      address: "Calle 5 #10-45, Centro, Aguachica",
      description:
        "Nuestra tienda principal donde puedes encontrar toda nuestra línea de productos y disfrutar de una taza de café recién preparado.",
      coordinates: { lat: 8.31, lng: -73.62 },
      phone: "+57 300 234 5678",
      email: "tienda@aromaserrania.com",
      hours: "Lunes a Domingo: 8:00 AM - 7:00 PM",
      image: "☕",
      color: "#6B4423",
      features: ["Degustación gratuita", "Wifi gratis", "Zona de lectura"],
      photos: [cafeteraDomestica, cafeteraElectrica, cafeteraItaliana],
    },
    {
      id: 3,
      type: "point",
      name: "Punto de Venta y Distribución",
      address: "Plaza Principal, Local 3, Aguachica",
      description:
        "Punto de venta estratégico en el corazón de la ciudad. Encuentra nuestros productos frescos y de temporada.",
      coordinates: { lat: 8.308, lng: -73.615 },
      phone: "+57 300 345 6789",
      email: "plaza@aromaserrania.com",
      hours: "Lunes a Domingo: 7:00 AM - 8:00 PM",
      image: "🏪",
      color: "#A0826D",
      features: [
        "Pedidos para llevar",
        "Empaque al vacío",
        "Ofertas especiales",
      ],
      photos: [cafeteraDomestica, cafeteraElectrica, cafeteraItaliana],
    },
    {
      id: 4,
      type: "point",
      name: "Punto de Venta - Mercado Municipal",
      address: "Mercado Municipal, Stand 12, Aguachica",
      description:
        "Visítanos en el mercado local para adquirir café recién tostado y conocer más sobre nuestro proceso.",
      coordinates: { lat: 8.312, lng: -73.618 },
      phone: "+57 300 456 7890",
      email: "mercado@aromaserrania.com",
      hours: "Martes a Domingo: 6:00 AM - 4:00 PM",
      image: "🏬",
      color: "#5D4E37",
      features: [
        "Productos frescos",
        "Precios especiales",
        "Café para empresas",
      ],
      photos: [cafeteraDomestica, cafeteraElectrica, cafeteraItaliana],
    },
  ];

  const filterCategories = [
    { id: "all", name: "Todas", icon: "📍" },
    { id: "processing", name: "Procesamiento", icon: "🏭" },
    { id: "store", name: "Tiendas", icon: "☕" },
    { id: "point", name: "Puntos de Venta", icon: "🏪" },
  ];

  const filteredLocations =
    activeFilter === "all"
      ? locations
      : locations.filter((loc) => loc.type === activeFilter);

  const openInMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="locations-page">
      <section
        className="locations-hero"
        style={{
          backgroundImage: `url(${fondoHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Nuestras Ubicaciones</h1>
            <p className="hero-subtitle">
              Encuéntranos en Aguachica y conoce dónde procesamos nuestro café
            </p>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon processing-stat">
                  <span className="stat-emoji">🏭</span>
                </div>
                <div className="stat-info">
                  <div className="stat-number">1</div>
                  <div className="stat-label">Planta de Procesamiento</div>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon store-stat">
                  <span className="stat-emoji">☕</span>
                </div>
                <div className="stat-info">
                  <div className="stat-number">
                    {locations.filter((l) => l.type === "store").length}
                  </div>
                  <div className="stat-label">Tiendas</div>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon point-stat">
                  <span className="stat-emoji">🏪</span>
                </div>
                <div className="stat-info">
                  <div className="stat-number">
                    {locations.filter((l) => l.type === "point").length}
                  </div>
                  <div className="stat-label">Puntos de Venta</div>
                </div>
              </div>
            </div>

            <div className="contact-box">
              <p className="contact-title-location">
                ¿Tienes preguntas? Contáctanos:
              </p>
              <a href="tel:+573185818424" className="contact-link">
                <Phone size={18} />
                <span>+57 318 581 8424</span>
              </a>
              <a
                href="mailto:cafearomadelaserrania2013@gmail.com"
                className="contact-link"
              >
                <Mail size={18} />
                <span>cafearomadelaserrania2013@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="filters-section">
        <div className="filters-container">
          <h3 className="filters-title">Filtrar por categoría:</h3>
          <div className="filter-buttons">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${
                  activeFilter === category.id ? "active" : ""
                }`}
                onClick={() => setActiveFilter(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-name">{category.name}</span>
                <span className="filter-count">
                  {category.id === "all"
                    ? locations.length
                    : locations.filter((l) => l.type === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-section">
        <div className="locations-grid">
          {filteredLocations.map((location, index) => (
            <div
              key={location.id}
              className="location-card"
              style={{
                "--card-color": location.color,
                "--animation-delay": `${index * 0.1}s`,
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <div className="photo-gallery">
                <img
                  src={location.photos[0]}
                  alt={location.name}
                  className="main-photo"
                />
                <div className="photo-overlay">
                  <ImageIcon size={20} />
                  <span className="photo-count">
                    {location.photos.length} fotos
                  </span>
                </div>
                <div className="photo-badge">
                  {location.type === "processing" && "Procesamiento"}
                  {location.type === "store" && "Tienda"}
                  {location.type === "point" && "Punto de Venta"}
                </div>
              </div>

              <div className="card-body">
                <div className="card-header">
                  <div
                    className="card-emoji"
                    style={{ background: location.color }}
                  >
                    {location.image}
                  </div>
                  <h3 className="location-name">{location.name}</h3>
                </div>

                <p className="location-description">{location.description}</p>

                <div className="location-details">
                  <div className="detail-item">
                    <MapPin size={18} color={location.color} />
                    <span>{location.address}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={18} color={location.color} />
                    <span>{location.hours}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={18} color={location.color} />
                    <span>{location.phone}</span>
                  </div>
                </div>

                <div className="features-list">
                  {location.features.map((feature, i) => (
                    <span
                      key={i}
                      className="feature-tag"
                      style={{ borderColor: location.color }}
                    >
                      <Check size={14} color={location.color} />
                      {feature}
                    </span>
                  ))}
                </div>

                <div class="loader-location"></div>
                <button
                  className="map-btn"
                  style={{ background: location.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openInMaps(location);
                  }}
                >
                  <Navigation size={20} />
                  <span>Abrir en Google Maps</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedLocation && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedLocation(null)}
        >
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setSelectedLocation(null)}
            >
              <X size={24} />
            </button>

            <div className="modal-gallery">
              <img
                src={selectedLocation.photos[0]}
                alt={selectedLocation.name}
                className="modal-main-photo"
              />
              {selectedLocation.photos.length > 1 && (
                <div className="modal-photo-grid">
                  {selectedLocation.photos.slice(1).map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`${selectedLocation.name} ${i + 2}`}
                      className="modal-thumb"
                      onClick={() => setImageModal(photo)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              className="modal-header"
              style={{ background: selectedLocation.color }}
            >
              <div className="modal-emoji">{selectedLocation.image}</div>
              <h2 className="modal-title">{selectedLocation.name}</h2>
              <p className="modal-subtitle">{selectedLocation.address}</p>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3 className="section-title">Descripción</h3>
                <p className="modal-description">
                  {selectedLocation.description}
                </p>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Información de Contacto</h3>
                <div className="contact-grid">
                  <a
                    href={`tel:${selectedLocation.phone}`}
                    className="contact-item"
                  >
                    <Phone size={20} />
                    <span>{selectedLocation.phone}</span>
                  </a>
                  <a
                    href={`mailto:${selectedLocation.email}`}
                    className="contact-item"
                  >
                    <Mail size={20} />
                    <span>{selectedLocation.email}</span>
                  </a>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Horario de Atención</h3>
                <div className="hours-box">
                  <Clock size={24} color={selectedLocation.color} />
                  <span>{selectedLocation.hours}</span>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Características</h3>
                <div className="modal-features">
                  {selectedLocation.features.map((feature, i) => (
                    <div
                      key={i}
                      className="modal-feature-item"
                      style={{ borderColor: selectedLocation.color }}
                    >
                      <Check size={20} color={selectedLocation.color} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="modal-map-btn"
                style={{ background: selectedLocation.color }}
                onClick={() => openInMaps(selectedLocation)}
              >
                <ExternalLink size={24} />
                <span>Ver Ubicación en Google Maps</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {imageModal && (
        <div
          className="image-modal-overlay"
          onClick={() => setImageModal(null)}
        >
          <button
            className="image-close-btn"
            onClick={() => setImageModal(null)}
          >
            <X size={32} />
          </button>
          <img
            src={imageModal}
            alt="Vista ampliada"
            className="image-modal-photo"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
