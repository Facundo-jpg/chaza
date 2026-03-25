import styles from "../assets/css/Landing.module.css";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#tramites">Trámites</a></li>
            <li><a href="#como-funciona">Cómo Funciona</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
          <Link to="/login" className={styles.ctaButton}>
            Iniciar Sesión
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Gestión de Trámites Municipales en Línea</h1>
          <p>
            Realizá tus trámites de forma rápida, segura y transparente. Sin filas, sin esperas innecesarias.
          </p>
          <div className={styles.heroButtons}>
            <a href="#" className={styles.btnPrimary}>
              Iniciar Trámite
            </a>
            <a href="#tramites" className={styles.btnSecondary}>
              Ver Trámites
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services} id="tramites">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nuestros Trámites</h2>
          <p className={styles.sectionSubtitle}>
            Soluciones digitales para todos tus trámites municipales
          </p>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <img src="/src/assets/img/icons/service-icon-dni.svg" alt="dni-documentacion" />
              </div>
              <h3>DNI y Documentación</h3>
              <p>Solicitud, renovación y correcciones de documentos de identidad.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <img src="/src/assets/img/icons/service-icon-habilitacion.svg" alt="habilitaciones-comerciales" />
              </div>
              <h3>Habilitaciones Comerciales</h3>
              <p>Alta, renovación y modificación de habilitaciones para comercios y empresas.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <img src="/src/assets/img/icons/service-icon-registro-civil.svg" alt="registro-civil" />
              </div>
              <h3>Registro Civil</h3>
              <p>Actas de nacimiento, matrimonio, defunción y otros registros civiles.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <img src="/src/assets/img/icons/service-icon-infraccion.svg" alt="infracciones-multas" />
              </div>
              <h3>Infracciones y Multas</h3>
              <p>Consulta, impugnación y pago de infracciones de tránsito y multas municipales.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <img src="/src/assets/img/icons/service-icon-social.svg" alt="servicios-sociales" />
              </div>
              <h3>Servicios Sociales</h3>
              <p>Subsidios, asistencia y programas de bienestar social para vecinos.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <img src="/src/assets/img/icons/service-icon-obras.svg" alt="obras-permisos" />
              </div>
              <h3>Obras y Permisos</h3>
              <p>Permisos de construcción, refacción y habilitación de obras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>¿Por Qué Usar Tramites?</h2>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <img src="/src/assets/img/icons/features-icon-tick.svg" alt="tick" />
              </div>
              <div className={styles.featureContent}>
                <h4>Atención Oficial</h4>
                <p>Servicio avalado por el municipio con validez legal</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <img src="/src/assets/img/icons/features-icon-clock.svg" alt="clock" />
              </div>
              <div className={styles.featureContent}>
                <h4>Turnos Programados</h4>
                <p>Reservá tu turno online y evitá las filas</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <img src="/src/assets/img/icons/features-icon-shield.svg" alt="shield" />
              </div>
              <div className={styles.featureContent}>
                <h4>Datos Seguros</h4>
                <p>Tu información personal está protegida y encriptada</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <img src="/src/assets/img/icons/features-icon-seguimiento.svg" alt="seguimiento" />
              </div>
              <div className={styles.featureContent}>
                <h4>Seguimiento Online</h4>
                <p>Consultá el estado de tu trámite en tiempo real</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <img src="/src/assets/img/icons/features-icon-money.svg" alt="money" />
              </div>
              <div className={styles.featureContent}>
                <h4>Sin Costo Adicional</h4>
                <p>El servicio digital no tiene cargos extra</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <img src="/src/assets/img/icons/features-icon-thunder.svg" alt="thunder" />
              </div>
              <div className={styles.featureContent}>
                <h4>Resolución Rápida</h4>
                <p>La mayoría de los trámites se resuelven en 48/72 hs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks} id="como-funciona">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Cómo Funciona</h2>
          <p className={styles.sectionSubtitle}>Realizá tu trámite en 4 pasos simples</p>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h4>Registrate</h4>
              <p>Creá tu cuenta con tu DNI en pocos minutos</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h4>Elegí el Trámite</h4>
              <p>Seleccioná el tipo de trámite que necesitás</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h4>Solicitá Turno</h4>
              <p>Reservá fecha y horario de atención</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h4>Presentate</h4>
              <p>Concurrí a la oficina con la documentación requerida</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>¿Listo para Iniciar tu Trámite?</h2>
          <p>Registrate ahora y gestioná tus trámites desde cualquier lugar</p>
          <a href="#" className={styles.btnPrimary}>
            Solicitar Turno Ahora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer} id="contacto">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>Tramites</h3>
            <p>Sistema oficial de gestión de trámites municipales en línea.</p>
          </div>

          <div className={styles.footerSection}>
            <h3>Contacto</h3>
            <p className={styles.footerItem}>
              <img src="/src/assets/img/icons/footer-icon-mail.svg" alt="Email" className={styles.footerIcon} />
              tramitesfaciles@municipio.gob.ar
            </p>
            <p className={styles.footerItem}>
              <img src="/src/assets/img/icons/footer-icon-telefono.svg" alt="Teléfono" className={styles.footerIcon} />
              0800-333-TRAMITES
            </p>
            <p className={styles.footerItem}>
              <img src="/src/assets/img/icons/footer-icon-ubicacion.svg" alt="Ubicación" className={styles.footerIcon} />
              Buenos Aires, Argentina
            </p>
          </div>

          <div className={styles.footerSection}>
            <h3>Trámites</h3>
            <a href="#tramites">Ver todos los trámites</a>
            <a href="#como-funciona">Cómo Funciona</a>
          </div>

          <div className={styles.footerSection}>
            <h3>Horarios de Atención</h3>
            <p>Lunes a Viernes</p>
            <p>8:00 - 15:00 hs</p>
            <p>Sistema Online</p>
            <p>24 hs / 7 días</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2025 Tramites — Municipalidad. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;