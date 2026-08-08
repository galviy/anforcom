import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTeam from './pages/CreateTeam';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CompetitionDetail from './pages/CompetitionDetail'; // <==============
import VerifySuccess from './pages/VerifySuccess';
import RequireAuth from './components/RequireAuth';
import ToastHost from './components/Toast';
import SessionHeartbeat from './components/SessionHeartbeat';

function App() {
  return (
    <BrowserRouter>
      <ToastHost />
      <SessionHeartbeat />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/competition/:slug" element={<CompetitionDetail />} /> {/*// <============== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-success" element={<VerifySuccess />} />

        {/* Endpoint yang wajib login -> kalau belum login, RequireAuth
            lempar ke landing page ("/"). Tambah route protected baru
            tinggal taruh di sini. */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-team" element={<CreateTeam />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;