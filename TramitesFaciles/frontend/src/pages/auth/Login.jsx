import React, { useState } from "react";
import styles from "../../assets/css/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import AuthBrand from '../../components/AuthBrand'


function Login() {
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const API_KEY = import.meta.env.VITE_API_KEY;

        try {
            const res = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({ email, password })
            });

            const result = await res.json();

            if (res.status === 200) {
                setMsg(result.message);
                setMsgType("success");

                console.log("Usuario recibido:", result.user);
                localStorage.setItem("token", result.token);
                localStorage.setItem("userType", result.user.type);
                localStorage.setItem("userId", result.user.id);
                localStorage.setItem("userName", result.user.name);
                localStorage.setItem("userLastname", result.user.lastname);
                console.log("Guardado en localStorage:", {
                    userName: localStorage.getItem("userName"),
                    userLastname: localStorage.getItem("userLastname")
                });
                
                setTimeout(() => {
                    if (result.user.type === 0) navigate("/admin");
                    if (result.user.type === 1) navigate("/user");
                }, 700);

            } else {
                setMsg(result.error);
                setMsgType("error");
            }

        } catch (error) {
            setMsg("Error en el servidor.");
            setMsgType("error");
            console.error("Error:", error);
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
                {/* Panel izquierdo */}
                <AuthBrand side="left" />

                {/* Panel derecho */}
                <div className={styles.authForm}>
                    <h2 className={styles.formTitle}>Bienvenido de vuelta</h2>
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
                    <p className={styles.formSubtitle}>
                        Ingresa tus datos para acceder a tu cuenta
                    </p>
                    <form onSubmit={handleLogin}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="email">
                                Correo electrónico
                            </label>
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
                            <label className={styles.formLabel} htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={styles.formInput}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary">Iniciar Sesión</button>

                        <div className={styles.formFooter}>
                            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;
