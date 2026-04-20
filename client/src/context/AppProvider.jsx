import React from "react";
import AuthProvider from "./Auth";
import { UIProvider } from "./UIContext";

const AppProvider = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>{children}</AuthProvider>
    </UIProvider>
  );
};

export default AppProvider;
