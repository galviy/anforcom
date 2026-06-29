import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Nanti di sini kamu panggil GET /api/user/me
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard ANFORCOM</h1>
      {user && <p>Selamat datang, {user.username}!</p>}
      <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
        Logout
      </button>
    </div>
  );
}