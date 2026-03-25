import { useState, useEffect } from "react";
import styles from "../../assets/css/GestionUsuarios.module.css";

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [ordenar, setOrdenar] = useState("Más recientes");
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(false);

    const [modalDetalles, setModalDetalles] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [turnosUsuario, setTurnosUsuario] = useState([]);
    const [loadingTurnos, setLoadingTurnos] = useState(false);

    const [pagina, setPagina] = useState(1);
    const [porPagina, setPorPagina] = useState(10);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        const API_KEY = import.meta.env.VITE_API_KEY;
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/user/getall", {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY }
            });
            const result = await response.json();
            setUsuarios(result.users || []);
        } catch (error) {
            console.error("Error al obtener ciudadanos:", error);
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    };

    const abrirModalDetalles = async (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModalDetalles(true);
        await obtenerTurnosUsuario(usuario.id_user);
    };

    const obtenerTurnosUsuario = async (id_user) => {
        const API_KEY = import.meta.env.VITE_API_KEY;
        try {
            setLoadingTurnos(true);
            const response = await fetch(`http://localhost:3000/turnos/getById/${id_user}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY }
            });
            const result = await response.json();
            setTurnosUsuario(result.user || []);
        } catch (error) {
            setTurnosUsuario([]);
        } finally {
            setLoadingTurnos(false);
        }
    };

    const abrirModalAcciones = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModalAcciones(true);
    };

    const cerrarModales = () => {
        setModalDetalles(false);
        setModalAcciones(false);
        setUsuarioSeleccionado(null);
        setTurnosUsuario([]);
    };

    const handleToggleAdmin = async () => {
        if (!usuarioSeleccionado) return;
        try {
            const API_KEY = import.meta.env.VITE_API_KEY;
            const token = localStorage.getItem('token');
            const currentType = Number(usuarioSeleccionado.type);
            const newType = currentType === 0 ? 1 : 0;
            const response = await fetch(`http://localhost:3000/user/update/${usuarioSeleccionado.id_user}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                    "Authorization": token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify({
                    name: usuarioSeleccionado.name,
                    lastname: usuarioSeleccionado.lastname,
                    email: usuarioSeleccionado.email,
                    type: newType === 0 ? 'admin' : 'user'
                })
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok && data.user) {
                const action = newType === 0 ? 'otorgado' : 'revocado';
                alert(`Rol de administrador ${action} a ${data.user.name || usuarioSeleccionado.name}`);
                await obtenerUsuarios();
                cerrarModales();
            } else {
                alert(data.message || 'No se pudo actualizar el rol del ciudadano');
            }
        } catch (error) {
            alert('Error al cambiar rol del ciudadano');
        }
    };

    const handleEliminar = async () => {
        if (!usuarioSeleccionado) return;
        if (!window.confirm(`¿Estás seguro de eliminar a ${usuarioSeleccionado.name} ${usuarioSeleccionado.lastname}?`)) return;
        try {
            const API_KEY = import.meta.env.VITE_API_KEY;
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/user/delete/${usuarioSeleccionado.id_user}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                    "Authorization": token ? `Bearer ${token}` : undefined
                }
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                alert(data.message || `Ciudadano ${usuarioSeleccionado.name} eliminado`);
                await obtenerUsuarios();
                cerrarModales();
            } else {
                alert(data.message || 'Error al eliminar ciudadano');
            }
        } catch (error) {
            alert("Error al eliminar ciudadano");
        }
    };

    const usuariosFiltrados = usuarios
        .filter((u) => {
            const tipo = Number(u.type);
            const estadoCoincide =
                filtroEstado === "Todos" ||
                (filtroEstado === "admin" && tipo === 0) ||
                (filtroEstado === "users" && tipo === 1);
            const texto = `${u.name || ""} ${u.lastname || ""} ${u.email || ""}`.toLowerCase();
            const busquedaCoincide = texto.includes(busqueda.toLowerCase());
            return estadoCoincide && busquedaCoincide;
        })
        .sort((a, b) => {
            if (ordenar.includes("Más recientes")) return b.id_user - a.id_user;
            if (ordenar.includes("A-Z")) return a.name.localeCompare(b.name);
            return 0;
        });

    const totalPaginas = Math.ceil(usuariosFiltrados.length / porPagina);
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    const usuariosPaginados = usuariosFiltrados.slice(inicio, fin);

    const cambiarPagina = (nueva) => {
        if (nueva >= 1 && nueva <= totalPaginas) setPagina(nueva);
    };

    const generarPaginas = () => {
        const paginas = [];
        const maxPaginasVisibles = 5;
        if (totalPaginas <= maxPaginasVisibles) {
            for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
        } else {
            if (pagina <= 3) {
                for (let i = 1; i <= 4; i++) paginas.push(i);
                paginas.push('...'); paginas.push(totalPaginas);
            } else if (pagina >= totalPaginas - 2) {
                paginas.push(1); paginas.push('...');
                for (let i = totalPaginas - 3; i <= totalPaginas; i++) paginas.push(i);
            } else {
                paginas.push(1); paginas.push('...');
                for (let i = pagina - 1; i <= pagina + 1; i++) paginas.push(i);
                paginas.push('...'); paginas.push(totalPaginas);
            }
        }
        return paginas;
    };

    const totalAdmins = usuarios.filter(u => Number(u.type) === 0).length;
    const totalCiudadanos = usuarios.filter(u => Number(u.type) === 1).length;
    const turnosCompletados = turnosUsuario.filter(t => t.status === 'completado').length;
    const turnosPendientes = turnosUsuario.filter(t => t.status === 'pendiente' || t.status === 'en_proceso').length;
    const totalTurnos = turnosUsuario.length;

    const formatearFecha = (fecha) => {
        if (!fecha) return "No disponible";
        return new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <main className={styles.mainContent}>
            {/* Header */}
            <div className={styles.contentHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <h1 className={styles.pageTitle}>👥 Gestión de Ciudadanos</h1>
                        <p className={styles.breadcrumb}>Dashboard / Ciudadanos / Lista</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statTop}>
                        <span className={styles.statLabel}>Total Ciudadanos</span>
                        <span className={styles.statIcon}>👥</span>
                    </div>
                    <h3 className={styles.statValue}>{usuarios.length}</h3>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTop}>
                        <span className={styles.statLabel}>Operadores</span>
                        <span className={styles.statIcon}>👔</span>
                    </div>
                    <h3 className={styles.statValue}>{totalAdmins}</h3>
                </div>
            </div>

            {/* Búsqueda y filtros */}
            <div className={styles.searchFilterBar}>
                <div className={styles.searchSection}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Buscar por nombre, email…"
                            value={busqueda}
                            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
                        />
                    </div>
                </div>
                <div className={styles.filterSection}>
                    <select className={styles.filterSelect} value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }}>
                        <option>Todos</option>
                        <option value="admin">Administradores</option>
                        <option value="users">Ciudadanos</option>
                    </select>
                    <select className={styles.filterSelect} value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
                        <option>↓ Más recientes</option>
                        <option>A-Z Alfabético</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className={styles.dataTableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableHeaderLeft}>
                        <h2 className={styles.tableTitle}>Lista de Ciudadanos</h2>
                        <span className={styles.tableCount}>{usuariosFiltrados.length} ciudadanos encontrados</span>
                    </div>
                    <div className={styles.perPageSelector}>
                        <span className={styles.perPageLabel}>Mostrar:</span>
                        <select className={styles.perPageSelect} value={porPagina} onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span className={styles.perPageLabel}>por página</span>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Cargando ciudadanos...</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ciudadano</th>
                                    <th>Contacto</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosPaginados.map((u) => (
                                    <tr key={u.id_user} className={styles.tableRow}>
                                        <td className={styles.idCell}>#{String(u.id_user).padStart(4, "0")}</td>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.userAvatar}>
                                                    {u.name?.[0] || "?"}{u.lastname?.[0] || "?"}
                                                </div>
                                                <div className={styles.userInfo}>
                                                    <span className={styles.userName}>{u.name} {u.lastname}</span>
                                                    <span className={styles.userEmail}>{u.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>📧 {u.email}</td>
                                        <td>
                                            <span className={`${styles.typeBadge} ${Number(u.type) === 0 ? styles.typeAdmin : styles.typeEmpleado}`}>
                                                {Number(u.type) === 0 ? "Operador" : "Ciudadano"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.btnAction} title="Ver detalles" onClick={() => abrirModalDetalles(u)}>👁️</button>
                                                <button className={`${styles.btnAction} ${styles.btnActionDanger}`} title="Acciones administrativas" onClick={() => abrirModalAcciones(u)}>⚙️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Paginación */}
                        <div className={styles.pagination}>
                            <div className={styles.paginationInfo}>
                                Mostrando {inicio + 1} - {Math.min(fin, usuariosFiltrados.length)} de {usuariosFiltrados.length} ciudadanos
                            </div>
                            <div className={styles.paginationControls}>
                                <button className={styles.paginationBtn} disabled={pagina === 1} onClick={() => cambiarPagina(pagina - 1)}>◀ Anterior</button>
                                <div className={styles.paginationNumbers}>
                                    {generarPaginas().map((num, idx) => (
                                        num === '...'
                                            ? <span key={`dots-${idx}`} className={styles.paginationDots}>...</span>
                                            : <button key={num} className={`${styles.paginationNumber} ${pagina === num ? styles.paginationActive : ''}`} onClick={() => cambiarPagina(num)}>{num}</button>
                                    ))}
                                </div>
                                <button className={styles.paginationBtn} disabled={pagina === totalPaginas} onClick={() => cambiarPagina(pagina + 1)}>Siguiente ▶</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DETALLES */}
            {modalDetalles && usuarioSeleccionado && (
                <div className={styles.modalOverlay} onClick={cerrarModales}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>👤 Detalles del Ciudadano</h2>
                            <button className={styles.modalClose} onClick={cerrarModales}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.userDetailCard}>
                                <div className={styles.userDetailHeader}>
                                    <div className={styles.userDetailAvatar}>
                                        {usuarioSeleccionado.name?.[0]}{usuarioSeleccionado.lastname?.[0]}
                                    </div>
                                    <div>
                                        <h3 className={styles.userDetailName}>{usuarioSeleccionado.name} {usuarioSeleccionado.lastname}</h3>
                                        <span className={`${styles.typeBadge} ${Number(usuarioSeleccionado.type) === 0 ? styles.typeAdmin : styles.typeEmpleado}`}>
                                            {Number(usuarioSeleccionado.type) === 0 ? "Operador" : "Ciudadano"}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.userDetailInfo}>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>📧 Email:</span>
                                        <span className={styles.infoValue}>{usuarioSeleccionado.email}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>🆔 ID:</span>
                                        <span className={styles.infoValue}>#{String(usuarioSeleccionado.id_user).padStart(4, "0")}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>📅 Fecha de registro:</span>
                                        <span className={styles.infoValue}>Diciembre 2024</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.sectionCard}>
                                <h4 className={styles.sectionTitle}>📋 Historial de Trámites</h4>
                                {loadingTurnos ? (
                                    <div style={{ textAlign: 'center', padding: '20px' }}><p>Cargando trámites...</p></div>
                                ) : (
                                    <>
                                        <div className={styles.turnosResumen}>
                                            <div className={styles.turnoStat}><span className={styles.turnoStatLabel}>Total</span><span className={styles.turnoStatValue}>{totalTurnos}</span></div>
                                            <div className={styles.turnoStat}><span className={styles.turnoStatLabel}>Completados</span><span className={styles.turnoStatValue}>{turnosCompletados}</span></div>
                                            <div className={styles.turnoStat}><span className={styles.turnoStatLabel}>Pendientes</span><span className={styles.turnoStatValue}>{turnosPendientes}</span></div>
                                        </div>
                                        <div className={styles.turnosLista}>
                                            {turnosUsuario.length === 0 ? (
                                                <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No hay trámites registrados para este ciudadano</p>
                                            ) : (
                                                turnosUsuario.slice(0, 5).map((turno) => (
                                                    <div key={turno.id_ticket} className={styles.turnoItem}>
                                                        <span>{turno.description} - {formatearFecha(turno.dateCreated)}</span>
                                                        <span className={turno.status === 'completado' ? styles.statusCompleted : styles.statusPending}>
                                                            {turno.status === 'completado' ? 'Completado' : turno.status === 'pendiente' ? 'Pendiente' : turno.status === 'en_proceso' ? 'En Proceso' : 'Cancelado'}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                            {turnosUsuario.length > 5 && (
                                                <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '10px' }}>
                                                    ... y {turnosUsuario.length - 5} trámites más
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnModalSecondary} onClick={cerrarModales}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ACCIONES */}
            {modalAcciones && usuarioSeleccionado && (
                <div className={styles.modalOverlay} onClick={cerrarModales}>
                    <div className={`${styles.modalContent} ${styles.modalDanger}`} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>⚠️ Acciones Administrativas</h2>
                            <button className={styles.modalClose} onClick={cerrarModales}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.warningBox}>
                                <span className={styles.warningIcon}>⚠️</span>
                                <p>Estás a punto de realizar acciones sobre el ciudadano:</p>
                                <strong>{usuarioSeleccionado.name} {usuarioSeleccionado.lastname}</strong>
                            </div>
                            <div className={styles.actionsGrid}>
                                <button className={styles.btnAction} onClick={handleToggleAdmin}>
                                    <span className={styles.actionIcon}>🛡️</span>
                                    <div className={styles.actionContent}>
                                        <h4>{Number(usuarioSeleccionado.type) === 0 ? 'Revocar Acceso Operador' : 'Dar Acceso Operador'}</h4>
                                        <p>{Number(usuarioSeleccionado.type) === 0 ? 'Quitar privilegios de operador' : 'Conceder privilegios de operador'}</p>
                                    </div>
                                </button>
                                <button className={`${styles.btnDelete} ${styles.btnAction}`} onClick={handleEliminar}>
                                    <span className={styles.actionIcon}>🗑️</span>
                                    <div className={styles.actionContent}>
                                        <h4>Eliminar Ciudadano</h4>
                                        <p>Eliminar permanentemente la cuenta</p>
                                    </div>
                                </button>
                            </div>
                            <div className={styles.dangerNote}>
                                <strong>⚠️ Nota importante:</strong> Estas acciones pueden ser irreversibles. Asegúrate de tener la autorización necesaria antes de proceder.
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnModalSecondary} onClick={cerrarModales}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default GestionUsuarios;