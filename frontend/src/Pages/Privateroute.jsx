import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext";

const Privateroute = ({ children, requiredrole }) => {
  const { isauth, loading, role } = useAuth();
  console.log("this is a role in private rute", role);
  console.log(
    "this is a value of a requiredrole in private rute ",
    requiredrole
  );
  if (loading) {
    return <div>Loading...</div>; // Show a loading message or spinner
  }
  if (requiredrole && requiredrole !== role) {
    return <Navigate to="/" replace />;
  }

  console.log("this is a privatge");
  return isauth ? children : <Navigate to="/login" replace />;
};

export default Privateroute;
