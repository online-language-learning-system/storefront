import React from "react";
import styles from "../pages/registerRole.module.css";

export default function RegisterRole() {
  console.log(styles); 

  return (
    <div className={styles.container}>
      <div className={styles["form-box"]}>
        <form>
          <h1 className={styles.title}>Register Role</h1>
          <p className={styles.subtitle}>Please fill in the information below</p>

          <div className={styles["input-box"]}>
            <input type="text" placeholder="First Name" required />
          </div>

          <div className={styles["input-box"]}>
            <input type="text" placeholder="Last Name" required />
          </div>

          <div className={styles["input-box"]}>
            <input type="tel" placeholder="Phone Number" required />
          </div>

          <div className={styles["role-wrapper"]}>
            <label className={styles["role-option"]}>
              <input type="radio" name="role" value="STUDENT" defaultChecked />
              <span> Student</span>
            </label>
            <label className={styles["role-option"]}>
              <input type="radio" name="role" value="LECTURER" />
              <span> Lecturer</span>
            </label>
          </div>

          <button type="submit" className={styles.btn}>Register</button>
        </form>
      </div>
    </div>
  );
}
