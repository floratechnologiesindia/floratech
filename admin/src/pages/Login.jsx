import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await loginAdmin({ email, password });
      localStorage.setItem('flora_admin_token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="admin-shell">
      <div className="login-card glass-card">
        <h1>Flora Admin</h1>
        <p>Secure admin access for managing services, portfolio, blog posts, and leads.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="button button-primary">Login</button>
        </form>
      </div>
    </div>
  );
}
