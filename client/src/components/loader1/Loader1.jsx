import React from 'react'
import styles from './loader1.module.css'

const Loader1 = () => {
  return (
    <div className={styles.ui_abstergo}>
      <div className={styles.abstergo_loader}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={styles.uitext}>
        Loading
        <div className={styles.uidot}></div>
        <div className={styles.uidot}></div>
        <div className={styles.uidot}></div>
      </div>
    </div>

  )
}

export default Loader1