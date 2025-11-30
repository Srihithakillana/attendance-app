import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const History = () => {
  const { user } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('calendar'); // 'calendar' or 'table'

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/attendance/my-history', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setHistory(data);
      } catch (err) { console.error(err); }
    };
    fetchHistory();
  }, [user]);

  // --- LOGIC ---
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Adjust date string format to match your DB (assuming YYYY-MM-DD)
      const dateStr = date.toLocaleDateString('en-CA'); 
      const record = history.find(h => h.date === dateStr);
      
      if (record) {
        if (record.status === 'present') return 'tile-present';
        if (record.status === 'absent') return 'tile-absent';
        if (record.status === 'late') return 'tile-late';
      }
    }
    return null;
  };

  // --- STYLES ---
  const styles = {
    container: {
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Matches Login Theme
      fontFamily: "'Segoe UI', sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    card: {
      background: 'white',
      width: '100%',
      maxWidth: '900px', // Wider for the table
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '20px',
    },
    title: {
      margin: 0,
      color: '#333',
      fontSize: '28px',
      fontWeight: 'bold',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      background: '#f3f4f6',
      padding: '5px',
      borderRadius: '8px',
    },
    toggleBtn: (isActive) => ({
      padding: '8px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
      background: isActive ? '#667eea' : 'transparent',
      color: isActive ? 'white' : '#666',
      boxShadow: isActive ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
    }),
    calendarWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    tableContainer: {
      overflowX: 'auto',
      marginTop: '10px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '600px',
    },
    th: {
      textAlign: 'left',
      padding: '16px',
      background: '#f9fafb',
      color: '#6b7280',
      fontWeight: '600',
      borderBottom: '2px solid #e5e7eb',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      color: '#374151',
    },
    statusBadge: (status) => {
      const colors = {
        present: { bg: '#d1fae5', text: '#065f46' },
        absent: { bg: '#fee2e2', text: '#991b1b' },
        late: { bg: '#fef3c7', text: '#92400e' },
      };
      const style = colors[status] || { bg: '#f3f4f6', text: '#374151' };
      return {
        background: style.bg,
        color: style.text,
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        display: 'inline-block',
      };
    }
  };

  // --- CSS OVERRIDES (For React-Calendar & Hover Effects) ---
  const cssOverrides = `
    /* Remove default ugly calendar borders */
    .react-calendar { 
      border: none !important; 
      font-family: 'Segoe UI', sans-serif;
      width: 100% !important;
      max-width: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    /* Style the Navigation (Month/Year) */
    .react-calendar__navigation button {
      color: #667eea;
      min-width: 44px;
      background: none;
      font-size: 16px;
      font-weight: bold;
    }
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: #f3f4f6;
      border-radius: 8px;
    }

    /* Style the Tiles (Days) */
    .react-calendar__tile {
      padding: 15px 0;
      font-weight: 500;
      font-size: 14px;
      border-radius: 8px;
    }
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background-color: #f3f4f6;
      color: #667eea;
    }
    
    /* Highlight Today */
    .react-calendar__tile--now {
      background: #eff6ff !important;
      color: #3b82f6 !important;
    }

    /* Custom Status Colors for Attendance */
    .tile-present { background-color: #d1fae5 !important; color: #065f46 !important; font-weight: bold; }
    .tile-absent { background-color: #fee2e2 !important; color: #991b1b !important; font-weight: bold; }
    .tile-late { background-color: #fef3c7 !important; color: #92400e !important; font-weight: bold; }
  `;

  return (
    <div style={styles.container}>
      {/* Inject CSS Overrides */}
      <style>{cssOverrides}</style>

      <div style={styles.card}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>My Attendance History</h1>
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => setView('calendar')} 
              style={styles.toggleBtn(view === 'calendar')}
            >
              Calendar
            </button>
            <button 
              onClick={() => setView('table')} 
              style={styles.toggleBtn(view === 'table')}
            >
              Table
            </button>
          </div>
        </div>

        {/* Content Section */}
        {view === 'calendar' ? (
          <div style={styles.calendarWrapper}>
            <Calendar 
              tileClassName={getTileClassName}
            />
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Check In</th>
                  <th style={styles.th}>Check Out</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {history.map(rec => (
                  <tr key={rec._id}>
                    <td style={styles.td}>{rec.date}</td>
                    <td style={styles.td}>{new Date(rec.checkInTime).toLocaleTimeString()}</td>
                    <td style={styles.td}>{rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString() : '-'}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(rec.status)}>
                        {rec.status}
                      </span>
                    </td>
                    <td style={styles.td}>{rec.totalHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && (
              <p style={{textAlign: 'center', padding: '20px', color: '#888'}}>No records found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;