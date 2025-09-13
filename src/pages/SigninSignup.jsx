import React, { useState } from "react";
import { login, register } from "../services/auth";   // API

function SignInSignUp() {
  const [isActive, setIsActive] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  // Register state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = validateLogin(loginData);
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await login(loginData);
      localStorage.setItem("token", res.data.token);
      alert("Đăng nhập thành công!");
    } catch (err) {
      console.error(err);
      alert("Sai thông tin đăng nhập!");
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateRegister(registerData);
    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await register(registerData);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      setIsActive(false); // chuyển về form login
      setRegisterData({ username: "", email: "", password: "", passwordConfirm: "" });
    } catch (err) {
      console.error(err);
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <i className="bx bxs-user"></i>
          </div>
          {loginErrors.username && <p className="error">{loginErrors.username}</p>}

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          {loginErrors.password && <p className="error">{loginErrors.password}</p>}

          {/* Remember me + Forgot password */}
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="btn">Login</button>

          {/* Social login */}
          <p>or login with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
          </div>
        </form>
      </div>

      {/* Register Form */}
      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            />
            <i className="bx bxs-user"></i>
          </div>
          {registerErrors.username && <p className="error">{registerErrors.username}</p>}

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <i className="bx bxs-envelope"></i>
          </div>
          {registerErrors.email && <p className="error">{registerErrors.email}</p>}

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          {registerErrors.password && <p className="error">{registerErrors.password}</p>}

          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={registerData.passwordConfirm}
              onChange={(e) =>
                setRegisterData({ ...registerData, passwordConfirm: e.target.value })
              }
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          {registerErrors.passwordConfirm && (
            <p className="error">{registerErrors.passwordConfirm}</p>
          )}

          <button type="submit" className="btn">Register</button>
        </form>
      </div>

      {/* Toggle Box */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={() => setIsActive(true)}>
            Register
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={() => setIsActive(false)}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignInSignUp;
