import React, {useState} from 'react';
import './LoginForm.css'
import Login from '../../pages/Login';

interface LoginFormProps {
    onLogin: (username: string, password: string) => void;
  }
  
  const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      onLogin(username, password);
    };
  
    return (
      <div className='form-container'>
        <div className='form-container-tittle'>
        <h2>Login</h2>
        </div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            placeholder='Usuário'
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            placeholder='Senha'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-container-buttons'>
          <div className='form-container-button'>
            <button type="submit" value="login">Login</button>
          </div>
          <div className='form-container-button'>
            <button type="submit" value="cadastrar">Cadastrar</button>
          </div>
        </div>
      </form>
      </div>
    );
  };
  
  export default LoginForm;
  