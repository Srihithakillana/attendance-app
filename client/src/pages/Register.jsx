import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'employee', employeeId: '', department: 'Engineering' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const departments = ['Engineering', 'Sales', 'HR', 'Marketing', 'Support', 'Management'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering user');
    } finally {
      setIsLoading(false);
    }
  };

  // --- STYLES ---
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px',
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
    title: { margin: '0 0 10px 0', color: '#333', fontSize: '28px', fontWeight: 'bold' },
    subtitle: { margin: '0 0 30px 0', color: '#666', fontSize: '14px' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', fontSize: '13px', color: '#333', fontWeight: '600' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box', outline: 'none' },
    select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', cursor: 'pointer' },
    button: { width: '100%', padding: '14px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '10px' },
    error: { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #ef9a9a' },
    link: { marginTop: '20px', fontSize: '14px', color: '#666' },
    linkAnchor: { color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join the team as a new employee</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} placeholder="john@company.com" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Employee ID</label>
            <input style={styles.input} placeholder="e.g. EMP001" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} required />
          </div>

          {/* NEW: Department Selector */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Department</label>
            <select style={styles.select} value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="Create a password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          <button style={styles.button} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login" style={styles.linkAnchor}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;