import React from 'react';
import './MainHeader.css'

const MainHeader: React.FC = () => {
    return (
        <div className='main-header'>
            <a href="#" className='logo-link'><img className='logo-img' src="/assets/logo.svg" alt="logo" /></a>
            <ul className="main-menu">
                <li className="menu-item"><a href="#">Products</a></li>
                <li className="menu-item"><a href="#">Company</a></li>
                <li className="menu-item"><a href="#">Pricing</a></li>
                <li className="menu-item"><a href="#">Contact</a></li>
                <li className="menu-item"><a href="#">Support</a></li>
            </ul>
            <div className="session-btns">
                <a href="#" id="login">Login</a>
                <a href="#" id="signup">Sign Up</a>
            </div>
        </div>
    );
};

export default MainHeader;
