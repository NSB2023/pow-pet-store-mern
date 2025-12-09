import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const API_BASE_URL = 'http://localhost:5050';

function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration OK
      setSuccessMsg('Registration successful! Logging you in...');

      // Auto login new user
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>
        <p className="register-sub">
          Join PetStore to shop and manage your pet accessories.
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="register-error">{error}</p>}
          {successMsg && <p className="register-success">{successMsg}</p>}

          <button className="btn-primary register-btn" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="register-extra">
          Already have an account?{' '}
          <Link to="/login" className="register-link">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
