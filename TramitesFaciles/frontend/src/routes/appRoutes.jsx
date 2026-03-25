import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";

// Páginas públicas
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Layouts
import AdminLayout from '../pages/layouts/AdminLayout';
import UserLayout from '../pages/layouts/UserLayout';

// Secciones admin
import DashboardAdmin from '../pages/admin/dashboardAdmin';
import GestionTurnos from '../pages/admin/GestionTurnos';
import GestionUsuarios from '../pages/admin/GestionUsuarios';

// secciones User
import DashboardUser from '../pages/user/DashboardUser';
import MisTurnos from '../pages/user/MisTurnos';
import NuevoTurno from '../pages/user/NuevoTurno';
import Perfil from '../pages/user/Perfil';


export default function AppRouter() {
    const location = useLocation();

    function AdminRoute({ children }) {
        const type = localStorage.getItem("userType");
        const token = localStorage.getItem("token");
        return token && type === "0" ? children : <Navigate to="/login" replace />;
    }

    function UserRoute({ children }) {
        const type = localStorage.getItem("userType");
        const token = localStorage.getItem("token");
        return token && type === "1" ? children : <Navigate to="/login" replace />;
    }

    function AuthRoute({ children }) {
        const token = localStorage.getItem("token");
        if (token) {
            const type = localStorage.getItem("userType");
            return type === "0" ? <Navigate to="/admin" replace /> : <Navigate to="/user" replace />;
        }
        return children;
    }



    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                {/* Públicas */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

                {/* Admin */}
                <Route path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<DashboardAdmin />} />
                    <Route path="turnos" element={<GestionTurnos />} />
                    <Route path="usuarios" element={<GestionUsuarios />} />
                </Route>


                {/* User */}
                <Route path="/user" element={<UserRoute><UserLayout /></UserRoute>}>
                    {/* dashboard */}
                    <Route index element={<DashboardUser />} />

                    {/* mis turnos */}
                    <Route path="mis-turnos" element={<MisTurnos />} />

                    {/* nuevo turno */}
                    <Route path="nuevo-turno" element={<NuevoTurno />} />

                    {/* Perfil de usuario */}
                    <Route path="mi-perfil" element={<Perfil />} />

                </Route>
            </Routes>
        </AnimatePresence>
    );
}
