import './Home.css'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero-container">
        <div className="hero-section" id="hero-content">
          <div className="hero-text">
            Criamos o seu
            <strong> sistema, site ou aplicativo</strong> com as melhores
            tecnologias disponíveis
          </div>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/contact')}
            >
              Fale conosco
            </button>
          </div>
        </div>
        <div className="hero-section" id="hero-image">
          <img src="../../public/assets/hero-image.png" alt="Hero Image" />
        </div>
      </section>
    </>
  )
}

export default Home
