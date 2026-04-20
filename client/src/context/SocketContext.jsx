import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./Auth";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuth } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuth && user && user._id) {
      const newSocket = io(window.api || "http://localhost:8000");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("register", user._id);
      });

      return () => {
        if (newSocket) newSocket.disconnect();
      };
    }
  }, [isAuth, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
