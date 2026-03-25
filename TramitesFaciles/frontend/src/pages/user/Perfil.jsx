import { useState, useEffect } from "react";
import styles from "../../assets/css/MiPerfil.module.css";

const API_URL = "http://localhost:3000";

function MiPerfil() {
    const id = localStorage.getItem('userId');
    const [activeTab, setActiveTab] = useState("datos");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userData, setUserData] = useState({
        name: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        tickets: 0,
        ticketsPending: 0
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const API_KEY = import.meta.env.VITE_API_KEY;
                const res = await fetch(`${API_URL}/user/getById/${id}`, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json", "x-api-key": API_KEY }
                });
                const tickets = await fetch(`${API_URL}/turnos/getById/${id}`, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json", "x-api-key": API_KEY }
                });
                const data = await res.json();
                const ticketData = await tickets.json();
                const turnos = ticketData.turno || [];
                if (data.ok) {
                    setUserData({
                        name: data.user.name || "",
                        lastname: data.user.lastname || "",
                        email: data.user.email || "",
                        phone: data.user.phone || "",
                        address: data.user.address || "",
                        tickets: turnos.length,
                        ticketsPending: turnos.filter(t => t.status === "pendiente").length
                    });
                }
            } catch (error) {
                setError("Error al cargar los datos del perfil.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const handleUserDataChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const API_KEY = import.meta.env.VITE_API_KEY;
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/user/update/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: userData.name,
                    lastname: userData.lastname,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address
                })
            });
            const data = await response.json();
            if (response.ok) {
                setUserData(prev => ({
                    ...prev,
                    name: data.user.name || prev.name,
                    lastname: data.user.lastname || prev.lastname,
                    email: data.user.email || prev.email,
                    phone: data.user.phone || prev.phone,
                    address: data.user.address || prev.address
                }));
                alert("Datos actualizados correctamente");
            } else {
                throw new Error(data.message || "Error al actualizar los datos");
            }
        } catch (error) {
            alert(error.message || "Error al actualizar los datos");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        try {
            const API_KEY = import.meta.env.VITE_API_KEY;
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/user/changePsw/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            const data = await response.json();
            if (response.ok) {
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                alert("Contraseña actualizada correctamente");
            } else {
                throw new Error(data.message || "Error al cambiar la contraseña");
            }
        } catch (error) {
            alert(error.message || "Error al cambiar la contraseña");
        }
    };

    if (isLoading) return <div className={styles.loading}>Cargando datos del perfil...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <main className={styles.mainContent}>

            {/* HEADER */}
            <div className={styles.contentHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>👤 Mi Perfil</h1>
                    <p className={styles.pageSubtitle}>Administrá tus datos personales y de contacto</p>
                </div>
            </div>

            {/* PROFILE CARD */}
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            {userData.name.charAt(0)}{userData.lastname.charAt(0)}
                        </div>
                        <div className={styles.avatarInfo}>
                            <h2 className={styles.userName}>{userData.name} {userData.lastname}</h2>
                            <p className={styles.userEmail}>{userData.email}</p>
                        </div>
                    </div>
                    <div className={styles.userStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{userData.tickets}</span>
                            <span className={styles.statLabel}>Trámites</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{userData.ticketsPending}</span>
                            <span className={styles.statLabel}>Pendientes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === "datos" ? styles.active : ""}`}
                        onClick={() => setActiveTab("datos")}
                    >
                        📝 Datos Personales
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "seguridad" ? styles.active : ""}`}
                        onClick={() => setActiveTab("seguridad")}
                    >
                        🔒 Seguridad
                    </button>
                </div>

                {/* TAB DATOS */}
                {activeTab === "datos" && (
                    <div className={styles.tabContent}>
                        <form onSubmit={handleSaveProfile} className={styles.profileForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Nombre</label>
                                <input type="text" id="name" name="name" value={userData.name} onChange={handleUserDataChange} className={styles.formControl} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastname">Apellido</label>
                                <input type="text" id="lastname" name="lastname" value={userData.lastname} onChange={handleUserDataChange} className={styles.formControl} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" value={userData.email} className={styles.formControl} disabled />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Teléfono de Contacto</label>
                                <input type="tel" id="phone" name="phone" value={userData.phone} onChange={handleUserDataChange} className={styles.formControl} placeholder="Ej: 011-4444-5555" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="address">Domicilio</label>
                                <textarea id="address" name="address" value={userData.address} onChange={handleUserDataChange} className={styles.formControl} rows="3" placeholder="Calle, número, piso, localidad"></textarea>
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.btnPrimary}>Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB SEGURIDAD */}
                {activeTab === "seguridad" && (
                    <div className={styles.tabContent}>
                        <form onSubmit={handleChangePassword} className={styles.profileForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="currentPassword">Contraseña Actual</label>
                                <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className={styles.formControl} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword">Nueva Contraseña</label>
                                <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={styles.formControl} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={styles.formControl} required />
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.btnPrimary}>Cambiar Contraseña</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}

export default MiPerfil;