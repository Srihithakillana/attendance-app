import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // --- STYLES ---
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px',
    },
    card: {
      background: 'white',
      width: '100%',
      maxWidth: '500px',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      textAlign: 'center',
    },
    avatar: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      margin: '0 auto 20px auto',
      boxShadow: '0 4px 10px rgba(118, 75, 162, 0.3)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
    roleBadge: {
      display: 'inline-block',
      marginTop: '10px',
      padding: '6px 14px',
      background: '#e0e7ff',
      color: '#4338ca',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    infoGrid: {
      marginTop: '30px',
      textAlign: 'left',
      display: 'grid',
      gap: '20px',
    },
    field: {
      borderBottom: '1px solid #f3f4f6',
      paddingBottom: '10px',
    },
    label: {
      display: 'block',
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: '4px',
    },
    value: {
      fontSize: '16px',
      color: '#111827',
      fontWeight: '500',
    },
    backBtn: {
      display: 'block',
      width: '100%',
      padding: '14px',
      background: '#1f2937',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '30px',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Avatar & Title */}
        <div style={styles.avatar}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 style={styles.title}>{user.name}</h1>
        <span style={styles.roleBadge}>{user.role}</span>

        {/* Info Fields */}
        <div style={styles.infoGrid}>
          <div style={styles.field}>
            <span style={styles.label}>Employee ID</span>
            <div style={styles.value}>{user.employeeId || 'N/A'}</div>
          </div>
          
          <div style={styles.field}>
            <span style={styles.label}>Email Address</span>
            <div style={styles.value}>{user.email}</div>
          </div>

          <div style={styles.field}>
            <span style={styles.label}>Department</span>
            <div style={styles.value}>{user.department || 'General'}</div>
          </div>
        </div>

        {/* Back Button */}
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Profile;