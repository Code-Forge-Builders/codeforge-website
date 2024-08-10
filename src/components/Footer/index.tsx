import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-body">
        <div className="dark-logo-container">
          <img className="logo-img" src="assets/logo-dark.svg" alt="logo" />
        </div>
        <div className="footer-listings">
          <div className="footer-section" id="footer-quick-links">
            <div className="footer-section-title">
              <h2>Links Úteis</h2>
            </div>
            <div className="footer-section-content">
              <ul>
                <li>
                  <a href="/#about">Quem Somos</a>
                </li>
                <li>
                  <a href="/#team">Nosso Time</a>
                </li>
                <li>
                  <a href="/#projects">Projetos</a>
                </li>
                <li>
                  <a href="/#contact">Fale Conosco</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-section">
            <div className="footer-section-title">
              <h2>Fale Conosco</h2>
            </div>
            <div className="footer-section-content">
              <p>Email: contact@mywebsite.com</p>
              <p>
                Telefone: <a href="tel:+5571989380393">+55 (71) 98938-0393</a>
              </p>
            </div>
          </div>
          <div className="footer-section">
            <div className="footer-section-title">
              <h2>Siga-nos</h2>
            </div>
            <div className="footer-section-content">
              <div className="social-links d-flex justify-content-around p-2 align-items-center align-middle">
                <a
                  href="https://facebook.com"
                  aria-label="Link do facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://twitter.com"
                  aria-label="Link do twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://instagram.com"
                  aria-label="Link do instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=5571989380393&text=Ol%C3%A1%2C%20tenho%20interesse%20em%20conhecer%20suas%20solu%C3%A7%C3%B5es"
                  aria-label="Link do whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Codeforge Builders. Todos os direitos reservados.</p>
        <p>Desenvolvido pelo time da Codeforge Builders</p>
      </div>
    </footer>
  )
}

export default Footer
