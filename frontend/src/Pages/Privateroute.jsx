import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext";
import PageLoader from "../Components/Loader/PageLoader";

const Privateroute = ({ children, requiredrole }) => {
  const { isauth, loading, role } = useAuth();
  console.log("this is a role in private rute", role);
  console.log(
    "this is a value of a requiredrole in private rute ",
    requiredrole
  );
  if (loading) {
    return <PageLoader message="Loading" fullScreen />;
  }
  if (requiredrole && requiredrole !== role) {
    return <Navigate to="/" replace />;
  }

  console.log("this is a privatge");
  return isauth ? children : <Navigate to="/login" replace />;
};

export default Privateroute;
