// src/pages/Login.tsx
import React from 'react';
import LoginForm from '../../components/LoginForm';
import './Login.css'
import MainHeader from '../../components/MainHeader';

const Login: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    // Lógica de autenticação aqui
    console.log('Login attempt:', { username, password });
  };

  return (
      <>
      <MainHeader/>
      <LoginForm onLogin={handleLogin} />
      </>
    
  );
};

export default Login;
