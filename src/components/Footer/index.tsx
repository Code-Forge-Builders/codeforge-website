import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <div className="footer-section-title">
                    <h2>About Us</h2>
                    </div>
                    <div className="footer-section-content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec.</p>
                    </div>
                </div>
                <div className="footer-section">
                    <div className="footer-section-title">
                        <h2>Quick Links</h2>
                    </div>
                    <div className="footer-section-content">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    </div>
                </div>
                <div className="footer-section">
                    <div className='footer-section-title'>
                        <h2>Contact Us</h2>
                    </div>
                    <div className='footer-section-content'>
                        <p>Email: contact@mywebsite.com</p>
                        <p>Phone: +1 (234) 567-890</p>
                    </div>
                </div>
                <div className="footer-section">
                    <div className='footer-section-title'>
                        <h2>Follow Us</h2>
                    </div>
                    <div className='footer-section-content'>                      
                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 My Website. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
