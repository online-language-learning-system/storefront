import React, { useState } from "react";
//import { useAuth } from "@/context/AuthContext";
import styles from "./auth.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
export default function Auth({ context }) {
  const [isActive, setIsActive] = useState(false);
  //const { login } = useAuth();

  /*useEffect(() => {
    if (context?.authenticatedUser) {
      // Giả sử Keycloak gắn sẵn thông tin user vào context
      login({
        username: context.authenticatedUser,
        token: context.token, // nếu có
      });
    }
  }, [context, login]);*/
  const handleLogin = (e) => {
    console.log("Login form submitted");

    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    
    const form = document.createElement("form");
    form.method = "POST";
    form.action = window.__KEYCLOAK_CONTEXT__.actionUrl;

    const userInput = document.createElement("input");
    userInput.type = "hidden";
    userInput.name = "username";
    userInput.value = username;
    form.appendChild(userInput);

    const passInput = document.createElement("input");
    passInput.type = "hidden";
    passInput.name = "password";
    passInput.value = password;
    form.appendChild(passInput);

    document.body.appendChild(form);
    form.submit();
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Register form submitted");

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordconfirm.value;

    try {
      // Nếu bạn cần token từ backend thì mở comment 2 dòng dưới
      const tokenRes = await axios.get("http://localhost:8000/get-token");
      const accessToken = tokenRes.data.accessToken;

      const res = await axios.post(
        "http://localhost:8000/storefront/users",
        { username, email, password, passwordConfirm },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("Đăng ký thành công! Hãy đăng nhập.");
      console.log(res.data);

      setIsActive(false);
      e.target.reset();
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className={`${styles.container} ${isActive ? styles.active : ""}`}>
      {/* Login Form */}
      <div className={`${styles["form-box"]} ${styles.login}`}>
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className={styles["input-box"]}>
            <input type="text" name="username" placeholder="Username" required />
            <i className="fas fa-user"></i>
          </div>
          <div className={styles["input-box"]}>
            <input type="password" name="password" placeholder="Password" required />
            <i className="fas fa-lock"></i>
          </div>
          <div className={styles["remember-forgot"]}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className={styles.btn}>
            Login
          </button>
          <p>or login with social platforms</p>
          <div className={styles["social-icons"]}>
            <a href="#"><i className="fab fa-google"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
          </div>
        </form>
      </div>

      {/* Register Form */}
      <div className={`${styles["form-box"]} ${styles.register}`}>
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <div className={styles["input-box"]}>
            <input type="text" name="username" placeholder="Username" required />
            <i className="fas fa-user"></i>
          </div>
          <div className={styles["input-box"]}>
            <input type="email" name="email" placeholder="Email" required />
            <i className="fas fa-envelope"></i>
          </div>
          <div className={styles["input-box"]}>
            <input type="password" name="password" placeholder="Password" required />
            <i className="fas fa-lock"></i>
          </div>
          <div className={styles["input-box"]}>
            <input type="password" name="passwordconfirm" placeholder="Confirm Password" required />
            <i className="fas fa-lock"></i>
          </div>
          <button type="submit" className={styles.btn}>
            Register
          </button>
          <p>or register with social platforms</p>
          <div className={styles["social-icons"]}>
            <a href="#"><i className="fab fa-google"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
          </div>
        </form>
      </div>

      {/* Toggle Box */}
      <div className={styles["toggle-box"]}>
        <div className={`${styles["toggle-panel"]} ${styles["toggle-left"]}`}>
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setIsActive(true)}
          >
            Register
          </button>
        </div>

        <div className={`${styles["toggle-panel"]} ${styles["toggle-right"]}`}>
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setIsActive(false)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
