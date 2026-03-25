import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/DashboardUser.module.css";

function DashboardUser() {
    const [turnos, setTurnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || '';
    const userLastname = localStorage.getItem('userLastname') || '';
    const fullName = `${userName} ${userLastname}`.trim() || 'Ciudadano';

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const token = localStorage.getItem('token');
                const API_KEY = import.meta.env.VITE_API_KEY;
                const response = await fetch(`http://localhost:3000/turnos/getById/${userId}`, {
                    headers: { 'x-api-key': API_KEY, 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Error al cargar los trámites');
                const data = await response.json();
                setTurnos(Array.isArray(data.turno) ? data.turno : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (userId) fetchTurnos();
    }, [userId]);

    const getCountByStatus = (status) =>
        turnos.filter(turno => turno.status.toLowerCase() === status.toLowerCase()).length;

    const pendientesCount = getCountByStatus('pendiente');
    const enProcesoCount = getCountByStatus('en proceso');
    const completadosCount = getCountByStatus('completado');

    const getUpcomingTurnos = () => {
        const now = new Date();
        return turnos
            .filter(turno => turno.status.toLowerCase() !== 'completado' && new Date(turno.deliveryTime) > now)
            .sort((a, b) => new Date(a.deliveryTime) - new Date(b.deliveryTime))
            .slice(0, 3);
    };

    const upcomingTurnos = getUpcomingTurnos();

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString('es-ES', options);
    };

    const getIconByTramite = (description) => {
        const desc = (description || '').toLowerCase();
        if (desc.includes('dni') || desc.includes('document')) return '🪪';
        if (desc.includes('habilitaci') || desc.includes('comerci')) return '🏪';
        if (desc.includes('registro') || desc.includes('civil') || desc.includes('nacimiento')) return '📜';
        if (desc.includes('infracci') || desc.includes('multa')) return '⚠️';
        if (desc.includes('social') || desc.includes('subsidio')) return '🤝';
        if (desc.includes('obra') || desc.includes('permiso')) return '🏗️';
        return '📋';
    };

    const serviceIdToTitle = {
        'dni-documentacion': 'DNI y Documentación',
        'habilitaciones-comerciales': 'Habilitaciones Comerciales',
        'registro-civil': 'Registro Civil',
        'infracciones-multas': 'Infracciones y Multas',
        'servicios-sociales': 'Servicios Sociales',
        'obras-permisos': 'Obras y Permisos'
    };

    if (isLoading) return <div className={styles.loading}>Cargando...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.mainContent}>
            {/* Header */}
            <div className={styles.contentHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>👋 ¡Bienvenido/a, {fullName}!</h1>
                    <p className={styles.pageSubtitle}>Panel de gestión de trámites ciudadanos</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)" }}>⏳</div>
                    <div className={styles.statContent}>
                        <h3 className={styles.statNumber}>{pendientesCount}</h3>
                        <p className={styles.statLabel}>Trámites Pendientes</p>
                        <span className={styles.statTrend}>→ En espera de atención</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.15)" }}>🔄</div>
                    <div className={styles.statContent}>
                        <h3 className={styles.statNumber}>{enProcesoCount}</h3>
                        <p className={styles.statLabel}>En Proceso</p>
                        <span className={styles.statTrend}>→ Siendo gestionados</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)" }}>✓</div>
                    <div className={styles.statContent}>
                        <h3 className={styles.statNumber}>{completadosCount}</h3>
                        <p className={styles.statLabel}>Completados</p>
                        <span className={styles.statTrend}>→ Este mes</span>
                    </div>
                </div>
            </div>

            {/* Próximos Turnos */}
            <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📅 Próximos Turnos</h2>
                    <a href="/user/mis-turnos" className={styles.sectionLink}>Ver todos →</a>
                </div>

                <div className={styles.turnosList}>
                    {upcomingTurnos.length > 0 ? (
                        upcomingTurnos.map(turno => (
                            <div key={turno.id_ticket} className={styles.turnoItem}>
                                <div className={styles.turnoLeft}>
                                    <div className={styles.turnoIcon}>
                                        {getIconByTramite(turno.description)}
                                    </div>
                                    <div className={styles.turnoInfo}>
                                        <h3 className={styles.turnoTitle}>
                                            {serviceIdToTitle[turno.service] || turno.service || 'Trámite'}
                                        </h3>
                                        <p className={styles.turnoDescription}>
                                            {turno.description || 'Sin descripción adicional'}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.turnoRight}>
                                    <div className={styles.turnoDate}>
                                        <span className={styles.dateLabel}>📆 Fecha</span>
                                        <span className={styles.dateValue}>{formatDate(turno.deliveryTime)}</span>
                                    </div>
                                    <div className={styles.turnoTime}>
                                        <span className={styles.timeLabel}>⏰ Hora</span>
                                        <span className={styles.timeValue}>{formatTime(turno.deliveryTime)}</span>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles[turno.status.toLowerCase().replace(' ', '')]}`}>
                                        {turno.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noTurnos}>
                            <p>No tenés trámites programados próximamente.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardUser;