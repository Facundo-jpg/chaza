import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/css/Dashboard.module.css";
import userStyles from "../../assets/css/DashboardUser.module.css";

function DashboardAdmin() {
    const [turnos, setTurnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const API_KEY = import.meta.env.VITE_API_KEY;
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:3000/turnos/getall", {
                    headers: {
                        "x-api-key": API_KEY,
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });

                if (!res.ok) throw new Error("Error al obtener trámites");

                const data = await res.json();
                setTurnos(Array.isArray(data.turno) ? data.turno : []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTurnos();
    }, []);

    const normalizeStatus = (s) => (s || "").toString().replace(/_/g, " ").toLowerCase().trim();

    const getCountByStatus = (status) => {
        return turnos.filter(t => normalizeStatus(t.status) === normalizeStatus(status)).length;
    };

    const pendientesCount = getCountByStatus('pendiente');
    const enProcesoCount = getCountByStatus('en proceso') || getCountByStatus('en_proceso');
    const completadosCount = getCountByStatus('finalizado');

    const enProcesoTurnos = turnos.filter(t => normalizeStatus(t.status) === 'en proceso').slice(0, 5);

    const formatDate = (dateString) => {
        try {
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        } catch {
            return '-';
        }
    };

    const formatTime = (dateString) => {
        try {
            const options = { hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleTimeString('es-ES', options);
        } catch {
            return '-';
        }
    };

    // Ícono según tipo de trámite
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

    return (
        <>
            <div className={styles.contentHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>📊 Panel de Control</h1>
                    <p className={styles.pageSubtitle}>Resumen general de trámites y gestión municipal</p>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)" }}>
                        ⏳
                    </div>
                    <div className={styles.statContent}>
                        <h3 className={styles.statNumber}>{isLoading ? '—' : pendientesCount}</h3>
                        <p className={styles.statLabel}>Trámites Pendientes</p>
                        <span className={styles.statTrend}>→ En espera de atención</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.15)" }}>
                        🔄
                    </div>
                    <div className={styles.statContent}>
                        <h3 className={styles.statNumber}>{isLoading ? '—' : enProcesoCount}</h3>
                        <p className={styles.statLabel}>En Proceso</p>
                        <span className={styles.statTrend}>→ Siendo gestionados</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)" }}>
                        ✓
                    </div>
                    <div className={styles.statContent}>
                        <h3 className={styles.statNumber}>{isLoading ? '—' : completadosCount}</h3>
                        <p className={styles.statLabel}>Finalizados</p>
                        <span className={styles.statTrend}>→ Este mes</span>
                    </div>
                </div>
            </div>

            {/* Trámites en proceso */}
            <div className={userStyles.sectionCard}>
                <div className={userStyles.sectionHeader}>
                    <h2 className={userStyles.sectionTitle}>🔄 Trámites en Proceso</h2>
                    <Link to="/admin/turnos" className={userStyles.sectionLink}>Ir a Gestión de Turnos →</Link>
                </div>

                {isLoading ? (
                    <div>Cargando trámites...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <div className={userStyles.turnosList}>
                        {enProcesoTurnos.length > 0 ? (
                            enProcesoTurnos.map(turno => (
                                <div key={turno.id_ticket} className={userStyles.turnoItem}>
                                    <div className={userStyles.turnoLeft}>
                                        <div className={userStyles.turnoIcon}>
                                            {getIconByTramite(turno.description)}
                                        </div>
                                        <div className={userStyles.turnoInfo}>
                                            <h3 className={userStyles.turnoTitle}>
                                                {turno.description ? turno.description.split('-')[0].trim() : `Trámite #${turno.id_ticket}`}
                                            </h3>
                                            <p className={userStyles.turnoDescription}>
                                                {turno.description ? turno.description.split('-').slice(1).join('-').trim() : 'Sin descripción adicional'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={userStyles.turnoRight}>
                                        <div className={userStyles.turnoDate}>
                                            <span className={userStyles.dateLabel}>📆 Fecha</span>
                                            <span className={userStyles.dateValue}>{formatDate(turno.deliveryTime)}</span>
                                        </div>
                                        <div className={userStyles.turnoTime}>
                                            <span className={userStyles.timeLabel}>⏰ Hora</span>
                                            <span className={userStyles.timeValue}>{formatTime(turno.deliveryTime)}</span>
                                        </div>
                                        <span className={`${userStyles.statusBadge} ${userStyles.proceso}`}>En Proceso</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={userStyles.emptyState}>
                                <div className={userStyles.emptyIcon}>📂</div>
                                <h3 className={userStyles.emptyTitle}>No hay trámites en proceso</h3>
                                <p className={userStyles.emptyDescription}>Actualmente no hay trámites siendo gestionados.</p>
                                <Link to="/admin/turnos" className={userStyles.btnEmpty}>Ver Turnos</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function AdminDashboard() {
    return (
        <div className={styles.mainContent}>
            <DashboardAdmin />
        </div>
    );
}

export default AdminDashboard;