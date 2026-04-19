import React, { useState } from "react";
import "../auth-pages.css";
import "./Login.css";
import { FaEye } from "react-icons/fa";
import api from "../../api/client";
import { useAuth } from "../Authcontext";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../../Components/Toast/ToastProvider";
import { getApiErrorMessage } from "../../utils/apiErrorMessage";

const Login = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { login, isauth, setRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const loginuser = async (e) => {
    e.preventDefault();
    const data = {
      username: name.trim(),
      password: password,
    };

    try {
      const res = await api.post("/user/login", data);
      const newToken = res.data.token;
      if (!newToken) {
        showToast("Login did not return a token. Please try again.", "error");
        return;
      }

      localStorage.setItem("token", newToken);
      try {
        const decoded = jwtDecode(newToken);
        if (decoded?.role) setRole(decoded.role);
      } catch {
        /* ignore decode issues */
      }

      showToast(res.data.message || "Welcome back!", "success");
      login();
    } catch (err) {
      const status = err.response?.status;
      const msg = getApiErrorMessage(err, "Login failed.");

      if (status === 403) {
        showToast(msg, "error");
        navigate("/block");
        return;
      }

      showToast(msg, "error");
    }
  };

  if (isauth) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          <p className="auth-kicker">Chronic</p>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-lede">
            Sign in with your <strong>username</strong> or{" "}
            <strong>email</strong> and password.
          </p>

          <form className="auth-form" onSubmit={loginuser} noValidate>
            <div className="auth-field">
              <FaUserAlt className="auth-field__icon" aria-hidden />
              <input
                type="text"
                name="loginId"
                placeholder="Username or email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-field__input"
                autoComplete="username"
                aria-label="Username or email address"
                required
              />
            </div>

            <div className="auth-field auth-field--password">
              <RiLockPasswordFill className="auth-field__icon" aria-hidden />
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-field__input"
                autoComplete="current-password"
                aria-label="Password"
                required
              />
              <button
                type="button"
                className="auth-field__toggle"
                onClick={() => setShow((prev) => !prev)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                <FaEye size={18} aria-hidden />
              </button>
            </div>

            <button type="submit" className="auth-submit">
              Sign in
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link className="auth-link" to="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
