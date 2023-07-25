import React from "react";
import styles from "./loader1.module.css";

const Loader1 = () => {
  return (
    <div class={styles.newtons_cradle}>
      <div class={styles.newtons_cradle__dot}></div>
      <div class={styles.newtons_cradle__dot}></div>
      <div class={styles.newtons_cradle__dot}></div>
      <div class={styles.newtons_cradle__dot}></div>
    </div>
  );
};

export default Loader1;
