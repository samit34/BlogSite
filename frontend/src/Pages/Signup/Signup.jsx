import React, { useState } from "react";
import api from "../../api/client";
import { useAuth } from "../Authcontext";
import "../auth-pages.css";
import "./Signup.css";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import { Link, Navigate } from "react-router-dom";
import { useToast } from "../../Components/Toast/ToastProvider";
import { getApiErrorMessage } from "../../utils/apiErrorMessage";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, setRole, isauth } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !phone || !email || !password) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    const data = {
      username,
      phone,
      email,
      password,
    };

    try {
      const res = await api.post("/user/signup", data);
      const token = res.data.token;
      if (!token) {
        showToast("Signup succeeded but no token was returned.", "error");
        return;
      }

      localStorage.setItem("token", token);
      try {
        const decoded = jwtDecode(token);
        if (decoded?.role) setRole(decoded.role);
      } catch {
        /* ignore */
      }

      showToast(res.data.message || "Account created successfully.", "success");
      login();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Signup failed. Please try again.");
      showToast(msg, "error");
    }
  };

  if (isauth) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="auth-page">
      <div className="auth-shell auth-shell--wide">
        <div className="auth-card">
          <p className="auth-kicker">Chronic</p>
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-lede">
            Join <strong>Chronic</strong> to read and share stories.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <FaUser className="auth-field__icon" aria-hidden />
              <input
                type="text"
                id="username"
                className="auth-field__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                aria-label="Username"
                required
              />
            </div>

            <div className="auth-field">
              <MdEmail className="auth-field__icon" aria-hidden />
              <input
                type="email"
                id="email"
                className="auth-field__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                aria-label="Email"
                required
              />
            </div>

            <div className="auth-field">
              <FaPhone className="auth-field__icon" aria-hidden />
              <input
                type="tel"
                id="phone"
                className="auth-field__input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                autoComplete="tel"
                aria-label="Phone number"
                required
              />
            </div>

            <div className="auth-field auth-field--password">
              <RiLockPasswordFill className="auth-field__icon" aria-hidden />
              <input
                type="password"
                id="password"
                className="auth-field__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                aria-label="Password"
                required
              />
            </div>

            <button type="submit" className="auth-submit">
              Create account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link className="auth-link" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
