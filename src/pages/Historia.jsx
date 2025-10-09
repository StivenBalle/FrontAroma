import "../styles/historia.css";
import rolloFotos from "../assets/Rollo fotos.jpeg";

function Historia() {
  return (
    <>
      <div className="hero-tittle">
        <h1>Aroma de la Serrania</h1>
        <p>
          Gracias al amor y la dedicación de la familia Andrades Contreras
          podrás disfrutar de un café artesanal de alta calidad.
        </p>
      </div>

      <section className="section">
        <div className="historia">
          <div className="historia-text">
            <h2>Nuestra Historia</h2>
            <p>Edwin Andrades es el cultivador de nuestro icónico café...</p>
          </div>
          <img src={rolloFotos} alt="Historia Café" />
        </div>
      </section>

      <section className="section">
        <div className="territorio">
          <h2>Nuestra meta es poder llevarte un café puro y tradicional.</h2>
          <p>
            En las tierras colombianas se encuentra la esencia que da vida a un
            café puro y tradicional. Gracias a la riqueza de sus suelos
            volcánicos, la altitud de las montañas y el clima tropical, cada
            grano de café se nutre de condiciones únicas que realzan su aroma,
            sabor y cuerpo. Las lluvias constantes, la temperatura equilibrada y
            la dedicación de los caficultores permiten que el café colombiano
            conserve su autenticidad, ofreciendo una bebida que refleja el
            trabajo, la pasión y la tradición de una tierra que vive para el
            café. Cada taza es el resultado de un proceso cuidadoso, desde la
            siembra hasta la cosecha, que honra la herencia cafetera del país y
            mantiene intacto el sabor natural de nuestras montañas.
            <br /> Por eso, disfrutar un café con{" "}
            <strong>Aroma de la serranía</strong> es conectarse con la historia,
            la cultura y la pureza de una de las tierras más privilegiadas del
            mundo para cultivarlo.
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
