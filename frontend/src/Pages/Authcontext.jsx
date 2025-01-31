import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MyContext = createContext();

const AuthContext = ({ children }) => {
  const [isauth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const login = () => {
    // localStorage.setItem("token", "dummy_token");
    console.log("the login funcation trigger");
    setAuth(true);

    navigate("/");
  };

  const logout = () => {
    console.log("the logout funcation is running");
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/");
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log(decoded);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp < currentTime) {
            console.log("Token expired, logging out...");
            logout();
          } else {
            setAuth(true);
            setRole(decoded.role);
          }
        } catch (err) {
          console.log("Error decoding token:", err);
          logout(); // Logout if the token is invalid
        }
      } else {
        console.log("else run in authcontext");
        setAuth(false);
      }
      setLoading(false);
    };

    checkTokenExpiration();

    // // Optional: Set up an interval to regularly check token expiration
    // const interval = setInterval(checkTokenExpiration, 10000); // Check every 60 seconds
    // return () => clearInterval(interval); // Cleanup on unmount
  }, [logout]);

  console.log("the value of isAuth", isauth);

  return (
    <MyContext.Provider
      value={{ isauth, login, logout, loading, role, setRole }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useAuth = () => useContext(MyContext);

export default AuthContext;
