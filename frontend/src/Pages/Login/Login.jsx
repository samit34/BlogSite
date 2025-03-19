import React, { useState } from "react";
import "./Login.css";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../Authcontext";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { SiStudyverse } from "react-icons/si";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Login = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { login, isauth , setRole } = useAuth();

  const navigate = useNavigate();

  const loginuser = async (e) => {
    e.preventDefault();
    const data = {
      username: name,
      password: password,
    };

    try {
      const res = await axios.post("https://blogsite-208j.onrender.com/user/login", data); // Changed to POST
      console.log("Login response:", res.data.token);

      const newToken = res.data.token;
     
      localStorage.setItem("token", newToken);
      setRole(newToken.role)
      login();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        navigate("/block");
      }

      console.log("Login error:", err);
    }
  };

  const toggleShowPassword = () => setShow((prev) => !prev);

  if (isauth) {
    console.log("login funcationis trigger");
    return <Navigate to="/" />; // Redirect if already logged in
  }
  return (
    <>

         {/* <div className="login-con">
         <div class="header">
      <div class="logo">
        <div><SiStudyverse />
        </div>
      </div>
      <h2>Company<span class="highlight">Name</span></h2>

    </div>
    </div> */}




      <form>
        <div className="login-page">
          <h1 className="text-black">Login page</h1>

          <div className="name">
            <FaUserAlt className="login-name-icon" />

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-name-input"
            />
          </div>
          <div className="password">
            <RiLockPasswordFill className="password-icon-first" />
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-password-input"
            />

            <FaEye className="password-icon" onClick={toggleShowPassword} />
          </div>
          <button className="login-button" onClick={loginuser}>
            Login
          </button>
          <div className="text-black ">
            don"t have an account Signup now ?
            <Link className="login-button  ms-1 " to={"/signup"}>
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
