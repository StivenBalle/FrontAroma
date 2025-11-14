import React, { useState } from "react";
import {
  Coffee,
  Sparkles,
  ChevronRight,
  Clock,
  Users,
  BookOpen,
} from "lucide-react";
import "../styles/preparacion.css";
import cafeteraDomestica from "../assets/CafeteraDoméstica.png";
import cafeteraElectrica from "../assets/CafeteraEléctrica.png";
import cafeteraItaliana from "../assets/CafeteraItaliana.png";
import prensaFrancesa from "../assets/PrensaFrancesa.png";
import maquinaExpreso from "../assets/MáquinaExpresso.png";
import sifonjapones from "../assets/SifónJaponés.png";
import V60 from "../assets/V60.png";
import chemex from "../assets/Chemex.png";

const Preparacion = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const metodosTradicionales = [
    {
      title: "Cafetera Doméstica",
      image: cafeteraDomestica,
      alt: "Método con cafetera doméstica",
      difficulty: "Fácil",
      time: "5-7 min",
      servings: "4-6 tazas",
      description: "El método más clásico y popular en hogares colombianos",
      category: "tradicional",
    },
    {
      title: "Cafetera Italiana",
      image: cafeteraItaliana,
      alt: "Método con cafetera Italiana",
      difficulty: "Fácil",
      time: "5-8 min",
      servings: "3-6 tazas",
      description: "Café intenso y aromático al estilo italiano",
      category: "tradicional",
    },
    {
      title: "Cafetera Eléctrica",
      image: cafeteraElectrica,
      alt: "Método con cafetera eléctrica",
      difficulty: "Muy Fácil",
      time: "8-10 min",
      servings: "6-12 tazas",
      description: "Práctica y perfecta para preparar varias tazas",
      category: "tradicional",
    },
  ];

  const otrosMetodos = [
    {
      title: "Prensa Francesa",
      image: prensaFrancesa,
      alt: "Método con prensa francesa",
      difficulty: "Fácil",
      time: "4-5 min",
      servings: "2-4 tazas",
      description: "Café con cuerpo completo y aceites naturales",
      category: "moderno",
    },
    {
      title: "Máquina de Espresso",
      image: maquinaExpreso,
      alt: "Método con máquina de expresso",
      difficulty: "Media",
      time: "2-3 min",
      servings: "1-2 tazas",
      description: "Café concentrado y cremoso profesional",
      category: "moderno",
    },
    {
      title: "Sifón Japonés",
      image: sifonjapones,
      alt: "Método con sifón japonés",
      difficulty: "Avanzada",
      time: "8-10 min",
      servings: "2-3 tazas",
      description: "Arte y ciencia en cada preparación",
      category: "especialidad",
    },
    {
      title: "V60",
      image: V60,
      alt: "Método en V60",
      difficulty: "Media",
      time: "3-4 min",
      servings: "1-2 tazas",
      description: "Método de goteo que resalta sabores únicos",
      category: "especialidad",
    },
    {
      title: "Chemex",
      image: chemex,
      alt: "Método en chemex",
      difficulty: "Media",
      time: "4-5 min",
      servings: "3-4 tazas",
      description: "Café limpio y brillante con filtros especiales",
      category: "especialidad",
    },
  ];

  const allMetodos = [...metodosTradicionales, ...otrosMetodos];

  const filteredMetodos =
    activeCategory === "all"
      ? allMetodos
      : allMetodos.filter((m) => m.category === activeCategory);

  const categories = [
    { id: "all", name: "Todos", icon: "☕" },
    { id: "tradicional", name: "Tradicionales", icon: "🏠" },
    { id: "moderno", name: "Modernos", icon: "⚡" },
    { id: "especialidad", name: "Especialidad", icon: "✨" },
  ];

  return (
    <section className="metodos-preparacion">
      <div className="prep-hero">
        <div className="prep-hero-content">
          <div className="prep-hero-badge">
            <Sparkles size={16} />
            <span>Guía de Preparación</span>
          </div>

          <h1 className="prep-hero-title">
            Descubre el Arte de Preparar
            <span className="prep-hero-highlight"> Café Perfecto</span>
          </h1>

          <p className="prep-hero-description">
            No solo te ofrecemos un café de calidad, también queremos enseñarte
            a prepararlo como un verdadero barista. Descubre los distintos
            métodos tradicionales y modernos para preparar un café delicioso
            desde casa.
          </p>

          {/* Stats */}
          <div className="prep-stats">
            <div className="prep-stat">
              <Coffee className="prep-stat-icon" />
              <div className="prep-stat-info">
                <span className="prep-stat-number">8+</span>
                <span className="prep-stat-label">Métodos</span>
              </div>
            </div>
            <div className="prep-stat">
              <Clock className="prep-stat-icon" />
              <div className="prep-stat-info">
                <span className="prep-stat-number">2-10</span>
                <span className="prep-stat-label">Minutos</span>
              </div>
            </div>
            <div className="prep-stat">
              <Users className="prep-stat-icon" />
              <div className="prep-stat-info">
                <span className="prep-stat-number">1-12</span>
                <span className="prep-stat-label">Tazas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loader con espacio para 3 imágenes */}
        <div className="prep-hero-visual">
          <div className="prep-images-grid">
            <div className="prep-image-card prep-image-1">
              <img src={cafeteraDomestica} alt="Cafetera tradicional" />
              <div className="prep-image-overlay">
                <span className="prep-image-label">Tradicional</span>
              </div>
            </div>
            <div className="prep-image-card prep-image-2">
              <img src={maquinaExpreso} alt="Máquina de espresso" />
              <div className="prep-image-overlay">
                <span className="prep-image-label">Moderno</span>
              </div>
            </div>
            <div className="prep-image-card prep-image-3">
              <img src={V60} alt="Método V60" />
              <div className="prep-image-overlay">
                <span className="prep-image-label">Especialidad</span>
              </div>
            </div>
          </div>

          <div className="prep-decoration prep-decoration-1">☕</div>
          <div className="prep-decoration prep-decoration-2">✨</div>
          <div className="prep-decoration prep-decoration-3">🫘</div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="prep-filters">
        <div className="prep-filters-container">
          <div className="prep-filters-header">
            <BookOpen className="prep-filters-icon" />
            <h3 className="prep-filters-title">Explora por Categoría</h3>
          </div>

          <div className="prep-filters-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`prep-filter-btn ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="prep-filter-icon">{category.icon}</span>
                <span className="prep-filter-name">{category.name}</span>
                <span className="prep-filter-count">
                  {category.id === "all"
                    ? allMetodos.length
                    : allMetodos.filter((m) => m.category === category.id)
                        .length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Methods Grid */}
      <div className="prep-methods-section">
        <div className="prep-methods-header">
          <h2 className="prep-methods-title">
            {activeCategory === "all" && "Todos los Métodos"}
            {activeCategory === "tradicional" && "Métodos Tradicionales"}
            {activeCategory === "moderno" && "Métodos Modernos"}
            {activeCategory === "especialidad" && "Métodos de Especialidad"}
          </h2>
          <p className="prep-methods-subtitle">
            {filteredMetodos.length} método
            {filteredMetodos.length !== 1 ? "s" : ""} disponible
            {filteredMetodos.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="metodos-grid-enhanced">
          {filteredMetodos.map((metodo, index) => (
            <div
              key={index}
              className="prep-method-card"
              style={{ "--animation-delay": `${index * 0.1}s` }}
            >
              <div className="prep-method-image-wrapper">
                <img
                  src={metodo.image}
                  alt={metodo.alt}
                  className="prep-method-image"
                />
                <div className="prep-method-badge">{metodo.difficulty}</div>
              </div>

              <div className="prep-method-content">
                <h3 className="prep-method-title">{metodo.title}</h3>
                <p className="prep-method-description">{metodo.description}</p>

                <div className="prep-method-stats">
                  <div className="prep-method-stat">
                    <Clock size={16} />
                    <span>{metodo.time}</span>
                  </div>
                  <div className="prep-method-stat">
                    <Coffee size={16} />
                    <span>{metodo.servings}</span>
                  </div>
                </div>

                <button className="prep-method-btn">
                  <span>Ver Receta</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="prep-method-glow"></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="prep-cta">
        <div className="prep-cta-content">
          <div className="prep-cta-icon">
            <Coffee size={48} />
          </div>
          <h2 className="prep-cta-title">
            ¿Listo para Preparar tu Café Perfecto?
          </h2>
          <p className="prep-cta-description">
            Selecciona tu método favorito y descubre paso a paso cómo preparar
            un café excepcional desde la comodidad de tu hogar.
          </p>
          <button className="prep-cta-btn">
            <span>Explorar Recetas Detalladas</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Preparacion;
