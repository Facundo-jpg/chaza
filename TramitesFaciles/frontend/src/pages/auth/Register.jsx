import { useState } from "react";
import styles from "../../assets/css/Register.module.css";
import { Link } from "react-router-dom";
import AuthBrand from '../../components/AuthBrand';
import { useNavigate } from "react-router-dom"

function Register() {
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type] = useState("user"); // default user

    const handleRegister = async (e) => {
        e.preventDefault();
        const API_KEY = import.meta.env.VITE_API_KEY;

        try {
            const res = await fetch('http://localhost:3000/user/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({ name, lastname, email, password, type, phone })
            });

            const result = await res.json();

            if (!res.ok) {
                setMsg(result.error || "Error al registrar");
                setMsgType("error");
                return;
            }

            setMsg("Usuario creado correctamente");
            setMsgType("success");

            setTimeout(() => {
                navigate("/login")
            }, 600);

        } catch (error) {
            setMsg("Error en el servidor");
            setMsgType("error");
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div className={styles.authContainer}>
                <div className={styles.authForm}>
                    <h2 className={styles.formTitle}>Crear cuenta</h2>
                    <p className={styles.formSubtitle}>Completa tus datos para comenzar</p>
                    {msg && (
                        <div
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "15px",
                                borderRadius: "8px",
                                textAlign: "center",
                                fontWeight: "600",
                                background: msgType === "error" ? "#ffb4b4" : "#b4ffd0",
                                color: msgType === "error" ? "#a70000" : "#006b2a"
                            }}
                        >
                            {msg}
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="phone">Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            className={styles.formInput}
                            placeholder="011-1234-5678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="name">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    className={styles.formInput}
                                    placeholder="Juan"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="lastname">Apellido</label>
                                <input
                                    type="text"
                                    id="lastname"
                                    className={styles.formInput}
                                    placeholder="Pérez"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="email">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                className={styles.formInput}
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                className={styles.formInput}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <p className={styles.formHelper}>Mínimo 8 caracteres</p>
                        </div>

                        <button type="submit" className="btn-primary">Crear Cuenta</button>

                        <div className={styles.formFooter}>
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                        </div>
                    </form>
                </div>

                <AuthBrand side="right" />
            </div>
        </div>
    );
}

export default Register;
