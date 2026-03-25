import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/NuevoTurno.module.css";

function NuevoTurno() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [selectedService, setSelectedService] = useState("");
    const formRef = useRef(null);

    const [horariosOcupados, setHorariosOcupados] = useState([]);

    const [formData, setFormData] = useState({
        servicio: "",
        descripcion: "",
        fecha: "",
        hora: ""
    });

    const tramites = [
        {
            id: "dni-documentacion",
            icon: "🪪",
            title: "DNI y Documentación",
            description: "Solicitud, renovación y correcciones de documentos de identidad"
        },
        {
            id: "habilitaciones-comerciales",
            icon: "🏪",
            title: "Habilitaciones Comerciales",
            description: "Alta, renovación y modificación de habilitaciones para comercios"
        },
        {
            id: "registro-civil",
            icon: "📜",
            title: "Registro Civil",
            description: "Actas de nacimiento, matrimonio, defunción y otros registros"
        },
        {
            id: "infracciones-multas",
            icon: "⚠️",
            title: "Infracciones y Multas",
            description: "Consulta, impugnación y pago de infracciones municipales"
        },
        {
            id: "servicios-sociales",
            icon: "🤝",
            title: "Servicios Sociales",
            description: "Subsidios, asistencia y programas de bienestar social"
        },
        {
            id: "obras-permisos",
            icon: "🏗️",
            title: "Obras y Permisos",
            description: "Permisos de construcción, refacción y habilitación de obras"
        }
    ];

    const fetchHorariosOcupados = async (fecha) => {
        if (!fecha) return;
        try {
            const API_KEY = import.meta.env.VITE_API_KEY;
            const response = await fetch(`http://localhost:3000/turnos/horarios-ocupados/${fecha}`, {
                headers: { 'x-api-key': API_KEY }
            });
            const data = await response.json();
            setHorariosOcupados(data.horariosOcupados || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleServiceClick = (serviceId) => {
        setSelectedService(serviceId);
        setFormData({ ...formData, servicio: serviceId });
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'servicio') setSelectedService(value);
            if (name === 'fecha') {
        fetchHorariosOcupados(value);
        setFormData(prev => ({ ...prev, fecha: value, hora: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) throw new Error('No se encontró la información de autenticación');

            const now = new Date();
            const dateCreated = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:00`;
            const deliveryDateTime = `${formData.fecha}T${formData.hora}:00`;

            const API_KEY = import.meta.env.VITE_API_KEY;
            const response = await fetch('http://localhost:3000/turnos/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_user: parseInt(userId),
                    dateCreated,
                    deliveryTime: deliveryDateTime,
                    status: "pendiente",
                    service: formData.servicio,
                    description: formData.descripcion
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al crear el trámite');

            setMessage({ text: '¡Turno solicitado exitosamente! Redirigiendo...', type: 'success' });
            setTimeout(() => navigate('/user/mis-turnos'), 2000);

        } catch (error) {
            setMessage({ text: error.message || 'Error al procesar la solicitud', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const hoy = new Date();
    const maxDate = new Date();
    maxDate.setDate(hoy.getDate() + 60);

    return (
        <main className={styles.mainContent}>
            {/* Header */}
            <div className={styles.contentHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>➕ Solicitar Nuevo Trámite</h1>
                    <p className={styles.pageSubtitle}>Seleccioná el tipo de trámite y completá el formulario</p>
                </div>
            </div>

            <div className={styles.formContainer}>
                {/* Trámites Disponibles */}
                <div className={styles.serviciosSection}>
                    <h2 className={styles.sectionTitle}>📁 Trámites Disponibles</h2>
                    <p className={styles.serviciosHint}>Seleccioná el trámite que necesitás iniciar</p>

                    <div className={styles.serviciosGrid}>
                        {tramites.map((tramite) => (
                            <div
                                key={tramite.id}
                                className={`${styles.servicioCard} ${selectedService === tramite.id ? styles.servicioCardSelected : ''}`}
                                onClick={() => handleServiceClick(tramite.id)}
                            >
                                {selectedService === tramite.id && (
                                    <div className={styles.checkMark}>✓</div>
                                )}
                                <div className={styles.servicioIcon}>{tramite.icon}</div>
                                <h3 className={styles.servicioTitle}>{tramite.title}</h3>
                                <p className={styles.servicioDescription}>{tramite.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Formulario */}
                <div ref={formRef} className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>📋 Detalles del Turno</h2>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>📁 Tipo de Trámite *</label>
                            <select
                                name="servicio"
                                className={styles.formSelect}
                                value={formData.servicio}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccioná un trámite</option>
                                {tramites.map((tramite) => (
                                    <option key={tramite.id} value={tramite.id}>{tramite.title}</option>
                                ))}
                            </select>
                            <span className={styles.formHint}>También podés seleccionar una tarjeta arriba ☝️</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>📝 Descripción del Requerimiento *</label>
                            <textarea
                                name="descripcion"
                                className={styles.formTextarea}
                                placeholder="Describí detalladamente el motivo de tu trámite y la documentación que tenés disponible..."
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="5"
                                required
                            ></textarea>
                            <span className={styles.formHint}>Cuanto más detallada sea la descripción, mejor podremos asistirte</span>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>📆 Fecha Preferida *</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    className={styles.formInput}
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    required
                                    min={hoy.toISOString().split("T")[0]}
                                    max={maxDate.toISOString().split("T")[0]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>⏰ Horario de Atención *</label>
                                <select
                                    name="hora"
                                    className={styles.formSelect}
                                    value={formData.hora}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccioná un horario</option>
                                    {[
                                        { value: "08:00", label: "08:00 AM" },
                                        { value: "09:00", label: "09:00 AM" },
                                        { value: "10:00", label: "10:00 AM" },
                                        { value: "11:00", label: "11:00 AM" },
                                        { value: "12:00", label: "12:00 PM" },
                                        { value: "13:00", label: "01:00 PM" },
                                        { value: "14:00", label: "02:00 PM" },
                                    ].map(({ value, label }) => (
                                        <option 
                                            key={value} 
                                            value={value} 
                                            disabled={horariosOcupados.includes(value)}
                                        >
                                            {horariosOcupados.includes(value) ? `${label} — Ocupado` : label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className={styles.infoBox}>
                            <div className={styles.infoIcon}>💡</div>
                            <div className={styles.infoContent}>
                                <h4 className={styles.infoTitle}>Información Importante</h4>
                                <ul className={styles.infoList}>
                                    <li>Presentate con DNI original y fotocopia</li>
                                    <li>Los turnos son sujetos a disponibilidad horaria</li>
                                    <li>Podés cancelar hasta 24 hs antes de la fecha</li>
                                    <li>Horario de atención: Lunes a Viernes de 8:00 a 14:00 hs</li>
                                </ul>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`${styles.message} ${message.type === 'error' ? styles.error : styles.success}`}>
                                {message.text}
                            </div>
                        )}

                        <div className={styles.formActions}>
                            <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                                {isSubmitting ? '⏳ Procesando...' : '✓ Solicitar Turno'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default NuevoTurno;