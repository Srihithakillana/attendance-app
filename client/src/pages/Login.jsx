import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // --- STYLES (So you don't need Tailwind) ---
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Beautiful Purple Gradient
      fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    title: {
      margin: '0 0 10px 0',
      color: '#333',
      fontSize: '28px',
      fontWeight: 'bold',
    },
    subtitle: {
      margin: '0 0 30px 0',
      color: '#666',
      fontSize: '14px',
    },
    inputGroup: {
      marginBottom: '20px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333',
      fontWeight: '600',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      boxSizing: 'border-box',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      marginTop: '10px',
      opacity: isLoading ? 0.7 : 1,
    },
    error: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px',
      fontSize: '14px',
      border: '1px solid #ef9a9a',
    },
    link: {
      marginTop: '20px',
      fontSize: '14px',
      color: '#666',
    },
    linkAnchor: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: 'bold',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Please enter your details to sign in</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="admin@example.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={styles.input}
              required
            />
          </div>

          <button style={styles.button} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.link}>
          New Employee? <Link to="/register" style={styles.linkAnchor}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;