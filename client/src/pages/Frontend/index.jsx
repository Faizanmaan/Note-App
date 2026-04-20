import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import Home from "./Home";
import Setting from "../Setting";
import Headers from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "./Home/Sidebar";
import { useUI } from "../../context/UIContext";

const Frontend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { isSidebarVisible, closeSidebar } = useUI();
  const navigate = useNavigate();

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    closeSidebar();
    navigate("/");
  };

  return (
    <div className="futuristic-bg min-vh-100">
      <Headers searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {/* Universal Mobile Sidebar Drawer */}
      <Drawer
        title={
          <span className="fw-bold fs-5 text-dark" style={{ fontFamily: "cursive" }}>
            Notes App
          </span>
        }
        placement="left"
        onClose={closeSidebar}
        open={isSidebarVisible}
        styles={{ body: { padding: 0 } }}
        size="default"
      >
        <Sidebar 
          activeCategory={activeCategory} 
          setActiveCategory={handleCategoryChange} 
        />
      </Drawer>

      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />} />
        <Route path="/setting/*" element={<Setting />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Frontend;
