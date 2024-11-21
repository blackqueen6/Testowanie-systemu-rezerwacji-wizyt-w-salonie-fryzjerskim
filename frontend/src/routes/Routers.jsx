import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Reservation from '../pages/Reservation.jsx';
import MyAccount from '../Dashboard/user_account/MyAccount.jsx';
import HairdresserDashboard from '../Dashboard/hairdresser_account/Dashboard.jsx';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import CalendarPage from '../pages/CalendarPage.jsx';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Reservation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/users/profile/:id" element={<ProtectedRoute allowedRoles={['klient']}><MyAccount /></ProtectedRoute>} />
            <Route path="/hairdressers/profile/:id" element={<ProtectedRoute allowedRoles={['fryzjer']}><HairdresserDashboard /></ProtectedRoute>} />
            <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
    );
};

export default Routers;