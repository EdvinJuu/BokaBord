
import "./Hero.css";
import heroBanner from "../assets/images/herobanner.webp";

const Hero = () => {
  return (
    <section className="hero">
      <img className="hero-image" src={heroBanner} alt="Hero image" />
      <div className="hero-content">
        <h2 className="hero-title">Hitta lediga bord!</h2>
        <p className="hero-text">
          Välj mellan våra restauranger så hjälper vi dig hitta lediga bord.
        </p>
      </div>
    </section>
  );
};

export default Hero;