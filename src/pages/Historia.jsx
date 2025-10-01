import "../styles/historia.css";
import rolloFotos from "../assets/Rollo fotos.jpeg";

function Historia() {
  return (
    <>
      <div className="hero-tittle">
        <h1>Aroma de la Serrania</h1>
        <p>
          Se construyó con el deseo de promover una cultura de café de la más
          alta calidad.
        </p>
      </div>

      <section className="section">
        <div className="historia">
          <div className="historia-text">
            <h2>Nuestra Historia</h2>
            <p>
              Edwin Andrades se enamoró con el tema del café por una
              casualidad...
            </p>
            <p>
              En su regreso a Bogotá, su esposa trae consigo algunas de estas
              cafeteras...
            </p>
          </div>
          <img src={rolloFotos} alt="Historia Café" />
        </div>
      </section>

      <section className="section">
        <div className="territorio">
          <h2>
            Nuestra Labor Es Explorar Cada Rincón Del Territorio Nacional Con El
            Fin De Descubrir Cafés Únicos.
          </h2>
          <p>
            La riqueza natural de Colombia y su biodiversidad son factores
            fundamentales para la calidad de nuestro café...
          </p>
          <div className="image-gallery">
            <img src="farm1.jpg" alt="Cultivo de café 1" />
            <img src="farm2.jpg" alt="Cultivo de café 2" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sostenibilidad">
          <h2>Informe De Sostenibilidad</h2>
          <a
            href="../Informe de Sostenibilidad/Informe_Sostenibilidad_Cafe_Aroma_de_la_Serrania.pdf"
            className="download-button"
            download="Informe_Sostenibilidad_Cafe_Aroma.pdf"
          >
            Descargar Informe
          </a>
        </div>
      </section>
    </>
  );
}

export default Historia;
