import React, { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  const openSidebar = () => setIsSidebarVisible(true);
  const closeSidebar = () => setIsSidebarVisible(false);

  return (
    <UIContext.Provider
      value={{ isSidebarVisible, toggleSidebar, openSidebar, closeSidebar }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
