import "../styles/preparacion.css";
import cafeteraDomestica from "../assets/CafeteraDoméstica.png";
import cafeteraElectrica from "../assets/CafeteraEléctrica.png";
import cafeteraItaliana from "../assets/CafeteraItaliana.png";
import prensaFrancesa from "../assets/PrensaFrancesa.png";
import maquinaExpreso from "../assets/MáquinaExpresso.png";
import sifonjapones from "../assets/SifónJaponés.png";
import Cafetera from "../components/Cafetera";
import V60 from "../assets/V60.png";
import chemex from "../assets/Chemex.png";

const Preparacion = () => {
  return (
    <section className="metodos-preparacion">
      <div className="intro-preparacion">
        <h2>En Café Aroma de la Serranía</h2>
        <p>
          No solo te ofrecemos un café de calidad, también queremos enseñarte a
          prepararlo en las máquinas tradicionales como un verdadero barista.
          Descubre los distintos métodos tradicionales y modernos para preparar
          un café delicioso desde casa. ¡Elige tu método favorito y disfruta
          cada aroma!
        </p>
        <div className="loader">
          <Cafetera />
        </div>
      </div>

      <h2>Máquinas Tradicionales</h2>
      <div className="metodos-grid">
        <div className="metodos-card">
          <h3>En Cafetera Doméstica</h3>
          <img src={cafeteraDomestica} alt="" />
        </div>
        <div className="metodos-card">
          <h3>En Cafetera Italiana</h3>
          <img src={cafeteraItaliana} alt="" />
        </div>
        <div className="metodos-card">
          <h3>En Cafetera Eléctrica</h3>
          <img src={cafeteraElectrica} alt="" />
        </div>
      </div>

      <h2>Otras Máquinas</h2>
      <div className="metodos-grid">
        <div className="metodos-card">
          <h3>En Prensa Francesa</h3>
          <img src={prensaFrancesa} alt="" />
        </div>
        <div className="metodos-card">
          <h3>En Máquina de Expresso</h3>
          <img src={maquinaExpreso} alt="" />
        </div>
        <div className="metodos-card">
          <h3>En Sifón Japonés</h3>
          <img src={sifonjapones} alt="" />
        </div>
        <div className="metodos-card">
          <h3>En V60</h3>
          <img src={V60} alt="" />
        </div>
        <div className="metodos-card">
          <h3>En Chemex</h3>
          <img src={chemex} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Preparacion;
