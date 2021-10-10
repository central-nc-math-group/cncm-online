import React, { Component } from 'react'
import { NextComponentType } from 'next'
import styles from "./contestTile.module.css";


function ContestTile(props) {
    return (
        <>
            {/* <div className={styles["clipped-wrap"]}>
                <div className={styles["clipped"]}>
                    <img className={styles["navbarLogo"]} width="50" height="50" src="/images/cncm-logo.png"/> <span>CNCM</span>
                </div>
            </div>
            <div className={styles["navbar-back"]}></div> */}
            <div className = {styles["tile-container"]}>
                <div className = {styles["tile-container-2"]}>
                    <div className = {styles["tile-container-3"]}>
                        <div className = {styles["left-center"]}>
                            {/* CNCM Online Fall 2021 */}
                            {props.title}
                        </div>
                    </div>
                </div>

                <div className = {styles["right-center"]}>
                    {/* August 23rd, 2021 <br></br>
                    2:00 - 3:00 PM ET */}
                    {props.date} <br></br>
                    {props.time}
                </div>
            </div>
        </>
    );

}

export default ContestTile