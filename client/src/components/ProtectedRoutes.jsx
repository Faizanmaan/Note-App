import React from "react";
import { useAuth } from "@/context/Auth";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ Component }) => {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Component />;
};

export default ProtectedRoutes;
