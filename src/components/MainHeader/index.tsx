import React from 'react';
import './MainHeader.css'

const MainHeader: React.FC = () => {
    return (
        <div className='main-header'>
            <a href="#" className='logo-link'><img className='logo-img' src="/assets/logo.svg" alt="logo" /></a>
            <ul className="main-menu">
                <li className="menu-item"><a href="products">Products</a></li>
                <li className="menu-item"><a href="company">Company</a></li>
                <li className="menu-item"><a href="pricing">Pricing</a></li>
                <li className="menu-item"><a href="contact">Contact</a></li>
                <li className="menu-item"><a href="support">Support</a></li>
            </ul>
            <div className="session-btns">
                <a href="login" id="login">Login</a>
                <a href="signup" id="signup">Sign Up</a>
            </div>
        </div>
    );
};

export default MainHeader;
