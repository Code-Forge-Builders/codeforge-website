import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer px-5">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-section-title">
            <h2>About Us</h2>
          </div>
          <div className="footer-section-content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              non urna nec.
            </p>
          </div>
        </div>
        <div className="footer-section">
          <div className="footer-section-title" id="footer-quick-links">
            <h2>Quick Links</h2>
          </div>
          <div className="footer-section-content">
            <ul>
              <li>
                <a href="">Home</a>
              </li>
              <li>
                <a href="products">Products</a>
              </li>
              <li>
                <a href="about">About</a>
              </li>
              <li>
                <a href="pricing">Pricing</a>
              </li>
              <li>
                <a href="contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-section">
          <div className="footer-section-title">
            <h2>Contact Us</h2>
          </div>
          <div className="footer-section-content">
            <p>Email: contact@mywebsite.com</p>
            <p>
              Phone: <a href="tel:+5571989380393">+55 (71) 98938-0393</a>
            </p>
          </div>
        </div>
        <div className="footer-section">
          <div className="footer-section-title">
            <h2>Follow Us</h2>
          </div>
          <div className="footer-section-content">
            <div className="social-links d-flex justify-content-around p-2 align-items-center align-middle">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=5571989380393&text=Ol%C3%A1%2C%20tenho%20interesse%20em%20conhecer%20suas%20solu%C3%A7%C3%B5es"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Codeforge Builders. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
