


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Authcontext';
import './Signup.css'
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";


const Signup = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    if (!username || !phone || !email || !password) {
      alert('All fields are required');
      return;
    }

    const data = {
      username,
      phone,
      email,
      password,
    };

    axios
      .post('http://localhost:8000/user/signup', data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        const tok = res.data.token;

        console.log("token", tok);
        console.log('Signup response:', res);
        login();
        navigate('/layout/home');
      })
      .catch((err) => {
        console.error('Signup error:', err);
        alert('Signup failed. Please try again.');
      });
  };

  return (
    <div className=" sec-signup ">
      <form
        className=" signup-form "
        onSubmit={handleSubmit}
        
      >
        <h2 className=" text-black " >Sign Up</h2>

        <div className="signup-name">
        <FaUser  className='signup-user-icon' />

          <input
            type="text"
            id="username"
            className="signup-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="signup-email">
        <MdEmail className='signup-email-icon' />

          <input
            type="email"
            id="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="signup-number">
        <FaPhone className='signup-number-icon' />

          <input
            type="text"
            id="phone"
            className="signup-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your number"
          />
        </div>

        <div className="signup-password">

        <RiLockPasswordFill className='signup-password-icon' />

          <input
            type="password"
            id="password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="singup-submit  ">Signup</button>
      </form>
    </div>
  );
};

export default Signup;

