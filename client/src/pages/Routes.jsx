import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "@/components/NotFound";
import Frontend from "./Frontend";
import Auth from "./Auth";
import { useAuth } from "@/context/Auth";
import { Navigate } from "react-router-dom";
import Setting from "./Setting";

const Index = () => {
  const { isAuth } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            isAuth ? <Frontend /> : <Navigate to="/auth/login" replace />
          }
        />
        <Route
          path="/auth/*"
          element={isAuth ? <Navigate to="/" replace /> : <Auth />}
        />
        <Route
          path="/setting/*"
          element={isAuth ? <Setting /> : <Navigate to="/auth/login" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Index;
