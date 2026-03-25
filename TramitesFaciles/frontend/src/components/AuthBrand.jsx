import React from 'react'
import { motion } from "framer-motion"; 
import styles from "../assets/css/Login.module.css";

export default function AuthBrand({side = "left"}) {
  const variants = {
    hidden: {
      x: side === "left" ? -80 : 80,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    },
    exit: {
      x: side === "left" ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <motion.div
      className={styles.authBrand}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >

    <div className={styles.authBrand}>
      <div className={styles.logo}>
        <img src="/tramitesfacil-logo-dark.svg" alt="Tramites-logo" />
      </div>
      <p>Sistema oficial de gestión de trámites municipales en línea</p>

      <div className={styles.brandFeatures}>
        <div className={styles.brandFeature}>
          <div className={styles.featureCheck}>
            <img src="/src/assets/img/icons/features-icon-tick.svg" alt="tick" />
          </div>
          <span>Atención oficial avalada</span>
        </div>

        <div className={styles.brandFeature}>
          <div className={styles.featureCheck}>
            <img src="/src/assets/img/icons/features-icon-tick.svg" alt="tick" />
          </div>
          <span>Turnos sin filas</span>
        </div>

        <div className={styles.brandFeature}>
          <div className={styles.featureCheck}>
            <img src="/src/assets/img/icons/features-icon-tick.svg" alt="tick" />
          </div>
          <span>Seguimiento en tiempo real</span>
        </div>

        <div className={styles.brandFeature}>
          <div className={styles.featureCheck}>
            <img src="/src/assets/img/icons/features-icon-tick.svg" alt="tick" />
          </div>
          <span>Datos protegidos</span>
        </div>
      </div>
    </div>

    </motion.div>
  )
}