import { useState, useEffect } from "react";
import styles from "../../assets/css/GestionTurnos.module.css";

function GestionTurnos() {
    const [turnos, setTurnos] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroServicio, setFiltroServicio] = useState("Todos los trámites");
    const [filtroFecha, setFiltroFecha] = useState("Todos");
    const [filtroDesde, setFiltroDesde] = useState("");
    const [filtroHasta, setFiltroHasta] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [turnoAEliminar, setTurnoAEliminar] = useState(null);

    async function handleGetAll() {
        const API_KEY = import.meta.env.VITE_API_KEY;
        try {
            const res = await fetch('http://localhost:3000/turnos/getall', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
            });
            const result = await res.json();
            setTurnos(result.turno);
        } catch (error) {
            console.log(error);
        }
    }

    const abrirModalEliminar = (e, turno) => {
        e.preventDefault();
        setTurnoAEliminar(turno);
        setModalEliminar(true);
    };

    const cerrarModalEliminar = () => {
        setModalEliminar(false);
        setTurnoAEliminar(null);
    };

    const confirmarEliminar = async () => {
        const API_KEY = import.meta.env.VITE_API_KEY;
        try {
            await fetch(`http://localhost:3000/turnos/delete/${turnoAEliminar.id_ticket}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
            });
            setTurnos(turnos.filter(t => t.id_ticket !== turnoAEliminar.id_ticket));
            cerrarModalEliminar();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (e, turno) => {
        e.preventDefault();
        setTurnoSeleccionado(turno);
        setModalAbierto(true);
    };

    const handleCambiarEstado = async (nuevoEstado) => {
        const API_KEY = import.meta.env.VITE_API_KEY;
        try {
            const dbStatus = displayToDb(nuevoEstado);
            const res = await fetch(`http://localhost:3000/turnos/update/${turnoSeleccionado.id_ticket}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({ status: dbStatus })
            });
            const result = await res.json();
            if (result.ok) {
                setTurnos(turnos.map(t =>
                    t.id_ticket === turnoSeleccionado.id_ticket
                        ? { ...t, status: dbStatus }
                        : t
                ));
                setTurnoSeleccionado({ ...turnoSeleccionado, status: dbStatus });
                setTimeout(() => {
                    setModalAbierto(false);
                    setTurnoSeleccionado(null);
                }, 500);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setTurnoSeleccionado(null);
    };

    const getEstadoClass = (status) => {
        const statusLower = (status || '').toString().toLowerCase().trim();
        if (statusLower === "pendiente") return "pendiente";
        if (statusLower === "en proceso" || statusLower === "en_proceso") return "en_proceso";
        if (statusLower === "finalizado") return "finalizado";
        if (statusLower === "cancelado") return "cancelado";
        return "";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('es-ES', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getEstadoMostrar = (estado) => {
        const key = (estado || '').toString().toLowerCase().replace(/_/g, ' ').trim();
        const map = {
            'pendiente': 'Pendiente',
            'en proceso': 'En Proceso',
            'finalizado': 'Finalizado',
            'cancelado': 'Cancelado'
        };
        return map[key] || (estado || '');
    };

    const parseServiceAndDescription = (t) => {
        if (t.service) {
            return { service: t.service, description: t.description || "" };
        }
        const raw = (t.description || "").toString();
        const idx = raw.indexOf(":");
        if (idx !== -1) {
            const service = raw.slice(0, idx).replace(/-/g, ' ').trim();
            const desc = raw.slice(idx + 1).trim();
            return { service, description: desc };
        }
        return { service: "", description: raw };
    };

    const serviceIdToTitle = {
        'dni-documentacion': 'DNI y Documentación',
        'habilitaciones-comerciales': 'Habilitaciones Comerciales',
        'registro-civil': 'Registro Civil',
        'infracciones-multas': 'Infracciones y Multas',
        'servicios-sociales': 'Servicios Sociales',
        'obras-permisos': 'Obras y Permisos'
    };

    const mapServiceToTitle = (serviceValue) => {
        if (!serviceValue) return '';
        const key = serviceValue.toString().trim();
        return serviceIdToTitle[key] || serviceValue;
    };

    const displayToDb = (display) => {
        return (display || '').toString().toLowerCase().replace(/ /g, '_').trim();
    };

    useEffect(() => {
        handleGetAll();
    }, []);

    const normalize = s => s?.toLowerCase().trim() ?? "";
    const normalizeExt = s => s?.toString().toLowerCase().replace(/_/g, ' ').trim() ?? "";

    const pendientes = turnos.filter(t => normalize(t.status) === "pendiente").length;
    const proceso = turnos.filter(t => normalize(t.status) === "en proceso" || normalize(t.status) === "en_proceso").length;
    const finalizados = turnos.filter(t => normalize(t.status) === "finalizado").length;
    const cancelados = turnos.filter(t => normalize(t.status) === "cancelado").length;

    const hoy = new Date();
    const inicioSemana = new Date();
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());

    const turnosFiltrados = turnos.filter(t => {
        if (filtroEstado !== "Todos") {
            if (normalizeExt(t.status) !== normalizeExt(filtroEstado)) return false;
        }
        if (filtroServicio && filtroServicio !== "Todos los trámites") {
            const parsed = parseServiceAndDescription(t);
            const strip = (s) => (s || '').toString()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[_-]/g, ' ').toLowerCase().trim();
            const sel = strip(filtroServicio);
            const serv = strip(mapServiceToTitle(parsed.service) || parsed.description || '');
            const desc = strip(parsed.description || '');
            if (!serv.includes(sel) && !desc.includes(sel)) return false;
        }
        const fechaTurno = new Date(t.dateCreated);
        switch (filtroFecha) {
            case "Todos": break;
            case "Hoy":
                const fechaDelivery = new Date(t.deliveryTime);
                if (fechaDelivery.toDateString() !== hoy.toDateString()) return false;
                break;
            case "Esta semana":
                if (fechaTurno < inicioSemana) return false;
                break;
            case "Personalizado":
                if (filtroDesde) {
                    const desde = new Date(filtroDesde); desde.setHours(0,0,0,0);
                    const f = new Date(fechaTurno); f.setHours(0,0,0,0);
                    if (f < desde) return false;
                }
                if (filtroHasta) {
                    const hasta = new Date(filtroHasta); hasta.setHours(23,59,59,999);
                    if (new Date(fechaTurno) > hasta) return false;
                }
                break;
            default: break;
        }
        const search = (busqueda || "").toLowerCase().trim();
        if (search) {
            const desc = (t.description || "").toLowerCase();
            if (!desc.includes(search) && !String(t.id_user).includes(search) && !String(t.id_ticket).includes(search)) return false;
        }
        return true;
    });

    return (
        <main className={styles.mainContent}>
            {/* Header */}
            <div className={styles.contentHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>📋 Gestión de Turnos</h1>
                    <p className={styles.pageSubtitle}>Administrá y organizá todos los trámites ciudadanos</p>
                </div>
                <div className={styles.headerActions}></div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statPending}`}>
                    <div className={styles.statIcon}>⏳</div>
                    <div className={styles.statContent}>
                        <h3>{pendientes}</h3>
                        <p>Pendientes</p>
                        <span className={styles.statTrend}>→ Actualizado</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statProcess}`}>
                    <div className={styles.statIcon}>🔄</div>
                    <div className={styles.statContent}>
                        <h3>{proceso}</h3>
                        <p>En Proceso</p>
                        <span className={styles.statTrend}>→ Actualizado</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statCompleted}`}>
                    <div className={styles.statIcon}>✓</div>
                    <div className={styles.statContent}>
                        <h3>{finalizados}</h3>
                        <p>Finalizados</p>
                        <span className={styles.statTrend}>→ Actualizado</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statRevenue}`}>
                    <div className={styles.statIcon}>❌</div>
                    <div className={styles.statContent}>
                        <h3>{cancelados}</h3>
                        <p>Cancelados</p>
                        <span className={styles.statTrend}>→ Actualizado</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersBar}>
                <div className={styles.filterGroup} style={{flex: '1 1 200px'}}>
                    <label className={styles.filterLabel}>🔎 Buscar</label>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar por ID, ciudadano o descripción..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>📊 Estado</label>
                    <select className={styles.filterSelect} value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option>Todos</option>
                        <option>Pendiente</option>
                        <option>En Proceso</option>
                        <option>Finalizado</option>
                        <option>Cancelado</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>📁 Trámite</label>
                    <select className={styles.filterSelect} value={filtroServicio} onChange={(e) => setFiltroServicio(e.target.value)}>
                        <option>Todos los trámites</option>
                        <option>DNI y Documentación</option>
                        <option>Habilitaciones Comerciales</option>
                        <option>Registro Civil</option>
                        <option>Infracciones y Multas</option>
                        <option>Servicios Sociales</option>
                        <option>Obras y Permisos</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>📆 Fecha</label>
                    <select className={styles.filterSelect} value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)}>
                        <option>Todos</option>
                        <option>Hoy</option>
                        <option>Esta semana</option>
                        <option>Personalizado</option>
                    </select>
                    {filtroFecha === 'Personalizado' && (
                        <div style={{marginTop: '8px', display: 'flex', gap: '8px'}}>
                            <input type="date" className={styles.filterSelect} value={filtroDesde} onChange={(e) => setFiltroDesde(e.target.value)} />
                            <input type="date" className={styles.filterSelect} value={filtroHasta} onChange={(e) => setFiltroHasta(e.target.value)} />
                        </div>
                    )}
                </div>
            </div>

            {/* Tabla */}
            <div className={styles.dataTableContainer}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>📋 Lista de Turnos</h2>
                </div>
                <div className={styles.desktopView}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>ID del Ciudadano</th>
                                    <th>Tipo de Trámite</th>
                                    <th>Descripción</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnosFiltrados.map((t) => {
                                    const parsed = parseServiceAndDescription(t);
                                    return (
                                    <tr key={t.id_ticket}>
                                        <td>{t.id_ticket}</td>
                                        <td>{t.id_user}</td>
                                        <td>{mapServiceToTitle(parsed.service) || parsed.description}</td>
                                        <td>{parsed.description}</td>
                                        <td>{new Date(t.dateCreated).toLocaleDateString()}</td>
                                        <td>{new Date(t.deliveryTime).toLocaleTimeString()}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[getEstadoClass(t.status)]}`}>
                                                {getEstadoMostrar(t.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={`${styles.btnAction} ${styles.btnEdit}`} title="Editar" onClick={(e) => handleEdit(e, t)}>✏️</button>
                                                <button className={`${styles.btnAction} ${styles.btnDelete}`} title="Eliminar" onClick={(e) => abrirModalEliminar(e, t)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile */}
                <div className={styles.mobileView}>
                    {turnosFiltrados.map((t) => {
                        const parsed = parseServiceAndDescription(t);
                        return (
                        <div key={t.id_ticket} className={styles.turnoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardHeaderLeft}>
                                    <div className={styles.avatar}>{t.id_user}</div>
                                    <div className={styles.cardInfo}>
                                        <h3 className={styles.cardCliente}>{mapServiceToTitle(parsed.service) || parsed.description}</h3>
                                        <span className={styles.cardId}>{t.id_ticket}</span>
                                        {parsed.description && <div className={styles.cardSubtitle}>{parsed.description}</div>}
                                    </div>
                                </div>
                                <span className={`${styles.statusBadge} ${styles[getEstadoClass(t.status)]}`}>
                                    {getEstadoMostrar(t.status)}
                                </span>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.cardDetail}>
                                    <span className={styles.cardLabel}>📆 Fecha:</span>
                                    <span className={styles.cardValue}>{new Date(t.dateCreated).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.cardDetail}>
                                    <span className={styles.cardLabel}>⏰ Hora:</span>
                                    <span className={styles.cardValue}>{new Date(t.deliveryTime).toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <div className={styles.cardFooter}>
                                <button className={`${styles.btnAction} ${styles.btnEdit}`} onClick={(e) => handleEdit(e, t)}>✏️ Editar</button>
                                <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={(e) => abrirModalEliminar(e, t)}>🗑️ Eliminar</button>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>

            {/* Modal cambio de estado */}
            {modalAbierto && turnoSeleccionado && (
                <div className={styles.modalOverlay} onClick={cerrarModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>✏️ Cambiar Estado del Trámite</h2>
                            <button className={styles.modalClose} onClick={cerrarModal}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.turnoInfo}>
                                <p><strong>ID Turno:</strong> {turnoSeleccionado.id_ticket}</p>
                                <p><strong>Ciudadano:</strong> {turnoSeleccionado.id_user}</p>
                                {(() => {
                                    const parsed = parseServiceAndDescription(turnoSeleccionado);
                                    return (
                                        <>
                                            <p><strong>Trámite:</strong> {mapServiceToTitle(parsed.service) || turnoSeleccionado.description}</p>
                                            {parsed.description && <p><strong>Descripción:</strong> {parsed.description}</p>}
                                        </>
                                    )
                                })()}
                                <p><strong>Estado actual:</strong>
                                    <span className={`${styles.statusBadge} ${styles[getEstadoClass(turnoSeleccionado.status)]}`}>
                                        {getEstadoMostrar(turnoSeleccionado.status)}
                                    </span>
                                </p>
                            </div>
                            <div className={styles.estadosGrid}>
                                <button className={`${styles.estadoBtn} ${styles.estadoPendiente}`} onClick={() => handleCambiarEstado('Pendiente')} disabled={getEstadoMostrar(turnoSeleccionado.status) === 'Pendiente'}>
                                    <span className={styles.estadoIcon}>⏳</span>
                                    <span className={styles.estadoTexto}>Pendiente</span>
                                </button>
                                <button className={`${styles.estadoBtn} ${styles.estadoProceso}`} onClick={() => handleCambiarEstado('En Proceso')} disabled={getEstadoMostrar(turnoSeleccionado.status) === 'En Proceso'}>
                                    <span className={styles.estadoIcon}>🔄</span>
                                    <span className={styles.estadoTexto}>En Proceso</span>
                                </button>
                                <button className={`${styles.estadoBtn} ${styles.estadoFinalizado}`} onClick={() => handleCambiarEstado('Finalizado')} disabled={getEstadoMostrar(turnoSeleccionado.status) === 'Finalizado'}>
                                    <span className={styles.estadoIcon}>✓</span>
                                    <span className={styles.estadoTexto}>Finalizado</span>
                                </button>
                                <button className={`${styles.estadoBtn} ${styles.estadoCancelado}`} onClick={() => handleCambiarEstado('Cancelado')} disabled={getEstadoMostrar(turnoSeleccionado.status) === 'Cancelado'}>
                                    <span className={styles.estadoIcon}>✕</span>
                                    <span className={styles.estadoTexto}>Cancelado</span>
                                </button>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancelar} onClick={cerrarModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal eliminar */}
            {modalEliminar && turnoAEliminar && (
                <div className={styles.modalOverlay} onClick={cerrarModalEliminar}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>⚠️ Confirmar Eliminación</h2>
                            <button className={styles.modalClose} onClick={cerrarModalEliminar}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.warningBox}>
                                <div className={styles.warningIcon}>🗑️</div>
                                <p className={styles.warningText}>¿Estás seguro de que deseas eliminar este turno?</p>
                            </div>
                            <div className={styles.turnoInfo}>
                                <p><strong>ID Turno:</strong> {turnoAEliminar.id_ticket}</p>
                                <p><strong>Ciudadano:</strong> {turnoAEliminar.id_user}</p>
                                {(() => {
                                    const parsed = parseServiceAndDescription(turnoAEliminar);
                                    return (
                                        <>
                                            <p><strong>Trámite:</strong> {mapServiceToTitle(parsed.service) || turnoAEliminar.description}</p>
                                            {parsed.description && <p><strong>Descripción:</strong> {parsed.description}</p>}
                                        </>
                                    )
                                })()}
                                <p><strong>Fecha:</strong> {formatDate(turnoAEliminar.dateCreated)}</p>
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
                            <button className={styles.btnCancelar} onClick={cerrarModalEliminar}>Cancelar</button>
                            <button className={styles.btnEliminar} onClick={confirmarEliminar}>Eliminar Turno</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default GestionTurnos;