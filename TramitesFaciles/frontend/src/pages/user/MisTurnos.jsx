import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/MisTurnos.module.css";

function MisTurnos() {
    const navigate = useNavigate();
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [busqueda, setBusqueda] = useState("");
    const [turnos, setTurnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [modalEliminar, setModalEliminar] = useState(false);
    const [turnoAEliminar, setTurnoAEliminar] = useState(null);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString('es-ES', options);
    };

    const getEstadoClass = (status) => {
        const statusLower = status.toLowerCase().trim();
        if (statusLower === "pendiente") return "pendiente";
        if (statusLower === "en proceso" || statusLower === "en_proceso") return "en-proceso";
        if (statusLower === "finalizado") return "finalizado";
        if (statusLower === "cancelado") return "cancelado";
        return "";
    };

    const abrirModalEliminar = (turno) => {
        setTurnoAEliminar(turno);
        setModalEliminar(true);
    };

    const cerrarModalEliminar = () => {
        setModalEliminar(false);
        setTurnoAEliminar(null);
    };

    const confirmarEliminar = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_KEY = import.meta.env.VITE_API_KEY;
            const response = await fetch(`http://localhost:3000/turnos/update/${turnoAEliminar.id_ticket}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'cancelado' })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cancelar el trámite');
            }
            setMessage({ text: 'Trámite cancelado correctamente', type: 'success' });
            await fetchTurnos();
            cerrarModalEliminar();
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        } catch (error) {
            setMessage({ text: error.message || 'Error al cancelar el trámite', type: 'error' });
            cerrarModalEliminar();
        }
    };

    const fetchTurnos = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) throw new Error('No se encontró la información de autenticación');
            const API_KEY = import.meta.env.VITE_API_KEY;
            const response = await fetch(`http://localhost:3000/turnos/getById/${userId}`, {
                headers: { 'x-api-key': API_KEY, 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener los trámites');
            const data = await response.json();
            setTurnos(data.turno || []);
        } catch (err) {
            setError(err.message || 'Error al cargar los trámites');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchTurnos(); }, []);

    const filteredTurnos = turnos.filter(turno => {
        const matchesEstado = filtroEstado === "Todos" || turno.status.toLowerCase() === filtroEstado.toLowerCase();
        const matchesSearch = turno.description.toLowerCase().includes(busqueda.toLowerCase()) ||
            turno.id_ticket.toString().includes(busqueda);
        return matchesEstado && matchesSearch;
    });

    const normalize = s => s?.toLowerCase().trim() ?? "";
    const stats = {
        total: turnos.length,
        pendientes: turnos.filter(t => normalize(t.status) === 'pendiente').length,
        enProceso: turnos.filter(t => normalize(t.status) === 'en proceso' || normalize(t.status) === 'en_proceso').length,
        finalizados: turnos.filter(t => normalize(t.status) === 'finalizado').length
    };

    const getEstadoMostrar = (estado) => {
        const estados = {
            'pendiente': 'Pendiente',
            'en_proceso': 'En Proceso',
            'en proceso': 'En Proceso',
            'finalizado': 'Finalizado',
            'cancelado': 'Cancelado'
        };
        return estados[estado.toLowerCase()] || estado;
    };

    const getIconoPorTramite = (descripcion) => {
        const desc = (descripcion || '').toLowerCase();
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

    if (isLoading) {
        return (
            <main className={styles.mainContent}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando tus trámites...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className={styles.mainContent}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h3>Error al cargar los trámites</h3>
                    <p>{error}</p>
                    <button className={styles.btnPrimary} onClick={fetchTurnos}>Reintentar</button>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.mainContent}>
            {/* Header */}
            <div className={styles.contentHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>📋 Mis Trámites</h1>
                    <p className={styles.pageSubtitle}>Seguí el estado de tus trámites y solicitudes</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.btnPrimary} onClick={() => navigate('/user/nuevo-turno')}>
                        <span>+</span>
                        <span>Nuevo Trámite</span>
                    </button>
                </div>
            </div>

            {/* Mensaje */}
            {message.text && (
                <div className={`${styles.messageAlert} ${styles[message.type]}`}>{message.text}</div>
            )}

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statPending}`}>
                    <div className={styles.statIcon}>⏳</div>
                    <div className={styles.statContent}><h3>{stats.pendientes}</h3><p>Pendientes</p></div>
                </div>
                <div className={`${styles.statCard} ${styles.statProcess}`}>
                    <div className={styles.statIcon}>🔄</div>
                    <div className={styles.statContent}><h3>{stats.enProceso}</h3><p>En Proceso</p></div>
                </div>
                <div className={`${styles.statCard} ${styles.statCompleted}`}>
                    <div className={styles.statIcon}>✓</div>
                    <div className={styles.statContent}><h3>{stats.finalizados}</h3><p>Finalizados</p></div>
                </div>
                <div className={`${styles.statCard} ${styles.statTotal}`}>
                    <div className={styles.statIcon}>📋</div>
                    <div className={styles.statContent}><h3>{stats.total}</h3><p>Total</p></div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersBar}>
                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar por trámite o ID..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <select className={styles.filterSelect} value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="Todos">Todos los Estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en proceso">En Proceso</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>
            </div>

            {/* Lista */}
            <div className={styles.turnosContainer}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📁 Lista de Trámites</h2>
                    <span className={styles.totalCount}>
                        {filteredTurnos.length} {filteredTurnos.length === 1 ? 'trámite' : 'trámites'} mostrados
                    </span>
                </div>

                {filteredTurnos.length > 0 ? (
                    <div className={styles.turnosGrid}>
                        {filteredTurnos.map((turno) => {
                            const fechaFormateada = formatDate(turno.deliveryTime);
                            const horaFormateada = formatTime(turno.deliveryTime);
                            const estadoMostrar = getEstadoMostrar(turno.status);
                            const icono = getIconoPorTramite(turno.description);

                            return (
                                <div key={turno.id_ticket} className={styles.turnoCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardIcon}>{icono}</div>
                                        <span className={`${styles.statusBadge} ${styles[getEstadoClass(turno.status)]}`}>
                                            {estadoMostrar}
                                        </span>
                                    </div>
                                    <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>
                                        {serviceIdToTitle[turno.service] || turno.service || 'Trámite'}
                                    </h3>
                                    <p className={styles.cardDescription}>
                                        {turno.description || 'Sin descripción adicional'}
                                    </p>
                                        <div className={styles.cardDetails}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>🆔</span>
                                                <span className={styles.detailText}>#{turno.id_ticket}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>📆</span>
                                                <span className={styles.detailText}>{fechaFormateada}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>⏰</span>
                                                <span className={styles.detailText}>{horaFormateada}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        {(turno.status.toLowerCase() === 'pendiente') && (
                                            <button className={`${styles.btnAction} ${styles.btnCancel}`} onClick={() => abrirModalEliminar(turno)}>
                                                ❌ Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📭</div>
                        <h3 className={styles.emptyTitle}>
                            {busqueda || filtroEstado !== "Todos" ? "No se encontraron trámites" : "No tenés trámites registrados"}
                        </h3>
                        <p className={styles.emptyDescription}>
                            {busqueda || filtroEstado !== "Todos"
                                ? "Probá con otros términos de búsqueda o filtros"
                                : "Iniciá tu primer trámite para comenzar"}
                        </p>
                        {(busqueda || filtroEstado !== "Todos") ? (
                            <button className={styles.btnEmpty} onClick={() => { setBusqueda(""); setFiltroEstado("Todos"); }}>
                                Limpiar filtros
                            </button>
                        ) : (
                            <button className={styles.btnEmpty} onClick={() => navigate('/user/nuevo-turno')}>
                                Iniciar Trámite
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal cancelación */}
            {modalEliminar && turnoAEliminar && (
                <div className={styles.modalOverlay} onClick={cerrarModalEliminar}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>⚠️ Confirmar Cancelación</h2>
                            <button className={styles.modalClose} onClick={cerrarModalEliminar}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.warningBox}>
                                <div className={styles.warningIcon}>📋</div>
                                <p className={styles.warningText}>¿Estás seguro de que deseas cancelar este trámite?</p>
                            </div>
                            <div className={styles.turnoInfo}>
                                <p><strong>ID Trámite:</strong> #{turnoAEliminar.id_ticket}</p>
                                <p><strong>Descripción:</strong> {turnoAEliminar.description}</p>
                                <p><strong>Fecha:</strong> {formatDate(turnoAEliminar.deliveryTime)}</p>
                                <p><strong>Hora:</strong> {formatTime(turnoAEliminar.deliveryTime)}</p>
                                <p><strong>Estado:</strong>
                                    <span className={`${styles.statusBadge} ${styles[getEstadoClass(turnoAEliminar.status)]}`}>
                                        {getEstadoMostrar(turnoAEliminar.status)}
                                    </span>
                                </p>
                            </div>
                            <div className={styles.alertMessage}>
                                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer.
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancelar} onClick={cerrarModalEliminar}>No, mantener trámite</button>
                            <button className={styles.btnEliminar} onClick={confirmarEliminar}>Sí, cancelar trámite</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default MisTurnos;