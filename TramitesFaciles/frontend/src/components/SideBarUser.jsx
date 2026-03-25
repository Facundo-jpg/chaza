import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/css/SideBar.css";

function SideBar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = async () => {
        try {
            const API_KEY = import.meta.env.VITE_API_KEY;
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:3000/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                    'Authorization': `Bearer ${token}`
                }
            });
            let result = null;
            try {
                result = await response.json();
            } catch (err) {
                result = { error: 'Respuesta no JSON del servidor' };
            }

            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                localStorage.removeItem('userId');
                navigate('/login');
            } else {
                console.error('Error al cerrar sesión:', result?.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('userId');
            navigate('/login');
        }
    };

    return (
        <>
            <div className={`overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>

            <div className="mobileHeader">
                <button className="menuBtn" onClick={toggleSidebar}>☰</button>
                <div className="mobileLogo">Tramites</div>
                <div style={{ width: '40px' }}></div>
            </div>

            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebarHeader">
                    <div className="sidebarLogo">Tramites</div>
                    <div className="sidebarRole">Panel del Ciudadano</div>
                </div>

                <nav className="sidebarNav">
                    <NavLink
                        to="/user"
                        end
                        className={({ isActive }) => "navItem" + (isActive ? " active" : "")}
                        onClick={closeSidebar}
                    >
                        <span className="navIcon">📊</span>
                        <span>Inicio</span>
                    </NavLink>

                    <NavLink
                        to="/user/mis-turnos"
                        className={({ isActive }) => "navItem" + (isActive ? " active" : "")}
                        onClick={closeSidebar}
                    >
                        <span className="navIcon">📋</span>
                        <span>Mis Trámites</span>
                    </NavLink>

                    <NavLink
                        to="/user/nuevo-turno"
                        className={({ isActive }) => "navItem" + (isActive ? " active" : "")}
                        onClick={closeSidebar}
                    >
                        <span className="navIcon">➕</span>
                        <span>Nuevo Trámite</span>
                    </NavLink>

                    <NavLink
                        to="/user/mi-perfil"
                        className={({ isActive }) => "navItem" + (isActive ? " active" : "")}
                        onClick={closeSidebar}
                    >
                        <span className="navIcon">👤</span>
                        <span>Mi Perfil</span>
                    </NavLink>
                </nav>

                <div className="sidebarFooter">
                    <button className="logoutBtn" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </aside>
        </>
    );
}

export default SideBar;