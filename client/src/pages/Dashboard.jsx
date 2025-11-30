import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [todayRecord, setTodayRecord] = useState(null);
  const [allRecords, setAllRecords] = useState([]);
  const [myHistory, setMyHistory] = useState([]);   
  const [stats, setStats] = useState(null);
  const [empStats, setEmpStats] = useState(null);
  
  const [view, setView] = useState('overview'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Reports
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  useEffect(() => {
    if (user.role === 'employee') {
      axios.get('http://localhost:5000/api/attendance/today', config).then(res => setTodayRecord(res.data)).catch(console.error);
      axios.get('http://localhost:5000/api/attendance/my-history', config).then(res => setMyHistory(res.data)).catch(console.error);
      axios.get('http://localhost:5000/api/dashboard/employee', config).then(res => setEmpStats(res.data)).catch(console.error);
    } else {
      axios.get('http://localhost:5000/api/attendance/all', config).then(res => setAllRecords(res.data));
      axios.get('http://localhost:5000/api/dashboard/manager', config).then(res => setStats(res.data));
    }
  }, [user]);

  const handleCheckIn = async () => { try { await axios.post('http://localhost:5000/api/attendance/checkin', {}, config); window.location.reload(); } catch (e) { alert(e.response?.data?.message); } };
  const handleCheckOut = async () => { try { await axios.post('http://localhost:5000/api/attendance/checkout', {}, config); window.location.reload(); } catch (e) { alert(e.response?.data?.message); } };

  const downloadReport = async () => {
     try {
       const params = { startDate, endDate, search: searchTerm };
       const response = await axios.get('http://localhost:5000/api/attendance/export', { ...config, params, responseType: 'blob' });
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url; link.setAttribute('download', 'attendance_report.csv');
       document.body.appendChild(link); link.click();
     } catch (e) { alert("Download failed"); }
  };

  const handleDelete = async (id) => { if (window.confirm('Delete this record?')) { try { await axios.delete(`http://localhost:5000/api/attendance/${id}`, config); const { data } = await axios.get('http://localhost:5000/api/attendance/all', config); setAllRecords(data); } catch (error) { alert('Failed'); } } };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month' && user.role === 'employee') {
        const dateStr = date.toLocaleDateString('en-CA'); 
        const record = myHistory.find(h => h.date === dateStr);
        if (record) return `tile-${record.status}`;
    }
    return null;
  };

  const filteredRecords = allRecords.filter(rec => 
    rec.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rec.userId?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const recordsOnSelectedDate = allRecords.filter(rec => rec.date === selectedDate.toLocaleDateString('en-CA'));

  // --- STYLES ---
  const styles = {
    container: { minHeight: '100vh', background: '#f3f4f6', padding: '30px', fontFamily: "'Segoe UI', sans-serif" },
    header: { background: 'white', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
    btnGroup: { display: 'flex', gap: '10px', alignItems: 'center' },
    profileBtn: { background: '#4f46e5', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
    logoutBtn: { background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
    historyBtn: { color: '#4f46e5', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', padding: '10px' },
    tabBar: { marginBottom: '20px', display: 'flex', gap: '10px' },
    tabBtn: (active) => ({ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: active ? '#4f46e5' : 'white', color: active ? 'white' : '#6b7280', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }),
    card: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    gridManager: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
    statCard: (color) => ({ background: 'white', padding: '20px', borderRadius: '12px', borderLeft: `5px solid ${color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }),
    statLabel: { color: '#6b7280', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' },
    statValue: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '5px' },
    inputGroup: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' },
    reportBox: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', background: '#f9fafb', marginBottom: '20px' },
    summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' },
    summaryCard: { background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    recentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
    actionBtn: (type) => ({ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', background: type === 'in' ? '#10b981' : '#f59e0b', marginTop: '15px' }),
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
    th: { textAlign: 'left', padding: '12px', background: '#f9fafb', borderBottom: '2px solid #e5e7eb', fontSize: '14px', color: '#6b7280' },
    td: { padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#374151' },
    badge: (status) => {
        const colors = { present: '#10b981', absent: '#ef4444', late: '#f59e0b', 'half-day': '#f97316' };
        return { color: colors[status] || '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' };
    },
    teamCalContainer: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }
  };

  const cssOverrides = `
    .react-calendar { width: 100% !important; border: none !important; font-family: 'Segoe UI', sans-serif !important; }
    .react-calendar__tile { padding: 10px 0; border-radius: 6px; font-weight: 600; font-size: 12px; }
    .tile-present { background: #ecfdf5; color: #047857; }
    .tile-absent { background: #fef2f2; color: #b91c1c; }
    .tile-late { background: #fffbeb; color: #b45309; }
    .tile-half-day { background: #ffedd5; color: #c2410c; }
    .react-calendar__tile--active { background: #4f46e5 !important; color: white !important; }
    @media (max-width: 1000px) {
        .gridManager, .summaryRow, .teamCalContainer, .recentGrid { grid-template-columns: 1fr !important; }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{cssOverrides}</style>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome, {user.name}</h1>
        <div style={styles.btnGroup}>
           {user.role === 'employee' && <button onClick={() => navigate('/my-history')} style={styles.historyBtn}>My History</button>}
           <button onClick={() => navigate('/profile')} style={styles.profileBtn}>Profile</button>
           <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {user.role === 'manager' && stats && (
        <>
            <div style={styles.tabBar}>
                <button onClick={() => setView('overview')} style={styles.tabBtn(view === 'overview')}>Overview</button>
                <button onClick={() => setView('list')} style={styles.tabBtn(view === 'list')}>Attendance List</button>
                <button onClick={() => setView('calendar')} style={styles.tabBtn(view === 'calendar')}>Team Calendar</button>
                <button onClick={() => setView('reports')} style={styles.tabBtn(view === 'reports')}>Reports</button>
            </div>

            {view === 'overview' && (
                <div>
                    <div style={styles.gridManager}>
                        <div style={styles.statCard('#3b82f6')}><div style={styles.statLabel}>Total Employees</div><div style={styles.statValue}>{stats.totalEmployees}</div></div>
                        <div style={styles.statCard('#10b981')}><div style={styles.statLabel}>Present Today</div><div style={styles.statValue}>{stats.presentToday}</div></div>
                        <div style={styles.statCard('#f59e0b')}><div style={styles.statLabel}>Late Today</div><div style={styles.statValue}>{stats.lateToday}</div></div>
                        <div style={styles.statCard('#ef4444')}><div style={styles.statLabel}>Absent Today</div><div style={styles.statValue}>{stats.absentToday}</div></div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px'}}>
                        <div style={styles.card}><h4>Weekly Trends</h4><BarChart width={500} height={250} data={stats.weeklyStats}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="checkins" fill="#8884d8"/></BarChart></div>
                        <div style={styles.card}><h4>Department Wise</h4><PieChart width={250} height={250}><Pie data={stats.departmentStats} cx="50%" cy="50%" outerRadius={70} fill="#8884d8" dataKey="value" label>{stats.departmentStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></div>
                    </div>
                    <div style={{...styles.card, marginTop: '20px'}}>
                        <h4 style={{color: '#ef4444', fontWeight: 'bold', marginBottom:'15px'}}>Absent Employees Today</h4>
                        {stats.absentEmployees && stats.absentEmployees.length > 0 ? (
                            stats.absentEmployees.map(emp => (
                                <div key={emp._id} style={{padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{fontWeight:'bold'}}>{emp.name}</span><span style={{color:'#666'}}>{emp.department}</span>
                                </div>
                            ))
                        ) : <p style={{color:'#10b981'}}>No absences today!</p>}
                    </div>
                </div>
            )}

            {view === 'list' && (
                <div style={styles.card}>
                     <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <input placeholder="Search employee..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={styles.input}/>
                     </div>
                     <table style={styles.table}>
                        {/* --- [UPDATED] Added Department Column --- */}
                        <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Department</th><th style={styles.th}>Date</th><th style={styles.th}>Status</th><th style={styles.th}>Hours</th><th style={styles.th}>Action</th></tr></thead>
                        <tbody>
                            {filteredRecords.map(rec => (
                                <tr key={rec._id}>
                                    <td style={styles.td}>{rec.userId?.name}</td>
                                    {/* --- [UPDATED] Show Department --- */}
                                    <td style={styles.td}>{rec.userId?.department || '-'}</td>
                                    <td style={styles.td}>{rec.date}</td>
                                    <td style={styles.td}><span style={styles.badge(rec.status)}>{rec.status}</span></td>
                                    <td style={styles.td}>{rec.totalHours}</td>
                                    <td style={styles.td}><button onClick={()=>handleDelete(rec._id)} style={{color:'red', border:'none', cursor:'pointer'}}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>
            )}

            {view === 'calendar' && (
                <div style={styles.teamCalContainer} className="teamCalContainer">
                    <div style={styles.card}><h3 style={{fontSize:'18px', fontWeight:'bold', marginBottom:'15px'}}>Select Date</h3><Calendar onChange={setSelectedDate} value={selectedDate} /></div>
                    <div style={styles.card}>
                        <h3 style={{fontSize:'18px', fontWeight:'bold', marginBottom:'15px'}}>Attendance for {selectedDate.toDateString()}</h3>
                        {recordsOnSelectedDate.length > 0 ? (
                            <table style={styles.table}>
                                <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Status</th><th style={styles.th}>Time</th></tr></thead>
                                <tbody>
                                    {recordsOnSelectedDate.map(rec => (
                                        <tr key={rec._id}>
                                            <td style={styles.td}><div style={{fontWeight:'bold'}}>{rec.userId?.name}</div><div style={{fontSize:'12px', color:'#888'}}>{rec.userId?.department}</div></td>
                                            <td style={styles.td}><span style={styles.badge(rec.status)}>{rec.status}</span></td>
                                            <td style={styles.td}>{rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <div style={{padding:'40px', textAlign:'center', color:'#888', background:'#f9fafb', borderRadius:'8px'}}>No records found.</div>}
                    </div>
                </div>
            )}

            {view === 'reports' && (
                <div style={styles.card}>
                    <h2 style={{fontSize:'20px', fontWeight:'bold', marginBottom:'20px'}}>Generate Reports</h2>
                    <div style={styles.reportBox}>
                        <div style={styles.inputGroup}>
                            <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', marginBottom:'5px'}}>Start Date</label><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={styles.input} /></div>
                            <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', marginBottom:'5px'}}>End Date</label><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={styles.input} /></div>
                            <div style={{flex:1}}><label style={{display:'block', fontSize:'12px', fontWeight:'bold', marginBottom:'5px'}}>Filter Name</label><input placeholder="Employee name..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{...styles.input, width:'95%'}} /></div>
                        </div>
                        <button onClick={downloadReport} style={{background:'#10b981', color:'white', padding:'12px 20px', borderRadius:'6px', border:'none', fontWeight:'bold', cursor:'pointer'}}>Download CSV</button>
                    </div>
                </div>
            )}
        </>
      )}

      {user.role === 'employee' && empStats && (
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#4b5563'}}>This Month's Summary</h2>
            <div style={styles.summaryRow} className="summaryRow">
                <div style={styles.summaryCard}><div style={{fontSize:'32px', color:'#10b981', fontWeight:'bold'}}>{empStats.present}</div><div style={{fontSize:'12px', color:'#666', fontWeight:'bold'}}>Days Present</div></div>
                <div style={styles.summaryCard}><div style={{fontSize:'32px', color:'#f59e0b', fontWeight:'bold'}}>{empStats.late}</div><div style={{fontSize:'12px', color:'#666', fontWeight:'bold'}}>Days Late</div></div>
                <div style={styles.summaryCard}><div style={{fontSize:'32px', color:'#ef4444', fontWeight:'bold'}}>{empStats.absent}</div><div style={{fontSize:'12px', color:'#666', fontWeight:'bold'}}>Days Absent</div></div>
                <div style={styles.summaryCard}><div style={{fontSize:'32px', color:'#3b82f6', fontWeight:'bold'}}>{empStats.totalHours}</div><div style={{fontSize:'12px', color:'#666', fontWeight:'bold'}}>Total Hours</div></div>
            </div>
            <div style={styles.recentGrid} className="recentGrid">
                <div style={styles.card}><h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '15px'}}>Recent Activity</h3><table style={styles.table}><thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Status</th><th style={styles.th}>Time</th></tr></thead><tbody>{myHistory.slice(0, 5).map(rec => (<tr key={rec._id}><td style={styles.td}>{rec.date}</td><td style={styles.td}><span style={styles.badge(rec.status)}>{rec.status}</span></td><td style={styles.td}>{new Date(rec.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td></tr>))}</tbody></table></div>
                <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                    <div style={{...styles.card, textAlign: 'center'}}><h3 style={{fontSize: '18px', fontWeight: 'bold'}}>Today's Action</h3><p style={{fontSize: '36px', fontWeight: 'bold', color: '#4f46e5', margin: '5px 0'}}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>{todayRecord ? (<div><div style={{background:'#f3f4f6', padding:'10px', borderRadius:'8px'}}><span style={styles.badge(todayRecord.status)}>{todayRecord.status}</span></div>{!todayRecord.checkOutTime ? <button onClick={handleCheckOut} style={styles.actionBtn('out')}>Check Out</button> : <div style={{marginTop:'10px', color:'#10b981', fontWeight:'bold'}}>Shift Completed</div>}</div>) : (<button onClick={handleCheckIn} style={styles.actionBtn('in')}>Check In Now</button>)}</div>
                    <div style={styles.card}><Calendar tileClassName={getTileClassName} /></div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;