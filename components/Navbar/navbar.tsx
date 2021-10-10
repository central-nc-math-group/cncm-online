import React, { Component } from 'react'
import { NextComponentType } from 'next'
import styles from "./navbar.module.css";


function Navbar({}) {
    return (
        <>
            <div className={styles["clipped-wrap"]}>
                <div className={styles["clipped"]}>
                    <img className={styles["navbarLogo"]} width="50" height="50" src="/images/cncm-logo.png"/> <span>CNCM</span>
                </div>
            </div>
            <div className={styles["navbar-back"]}></div>
        </>
    );

}

export default Navbar