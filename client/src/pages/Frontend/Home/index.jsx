import React, { useState } from "react";
import { Drawer } from "antd";
import Sidebar from "./Sidebar";
import Hero from "./Hero";
import { useUI } from "../../../context/UIContext";

const Home = ({ searchTerm, activeCategory, setActiveCategory }) => {
  const { closeSidebar } = useUI();

  return (
    <main className="d-flex">
      {/* Desktop Sidebar */}
      <div
        className="d-none d-lg-block position-sticky"
        style={{ top: "140px", height: "fit-content", zIndex: 10, width: '280px' }}
      >
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 w-100">
        <Hero activeCategory={activeCategory} searchTerm={searchTerm} />
      </div>
    </main>
  );
};

export default Home;
