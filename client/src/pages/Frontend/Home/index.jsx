import React, { useState } from "react";
import { Drawer, Button } from "antd";
import Sidebar from "./Sidebar";
import Hero from "./Hero";

const Home = ({ searchTerm }) => {
  const [mobileVisible, setMobileVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <main className="d-flex">
      {/* Desktop Sidebar */}
      <div
        className="d-none d-lg-block position-sticky"
        style={{ top: "76px", height: "calc(100vh - 76px)", zIndex: 1 }}
      >
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      {/* Mobile Drawer Trigger (Visible only on lg and down) */}
      <div
        className="d-lg-none position-fixed z-3"
        style={{ bottom: "20px", right: "20px" }}
      >
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={() => setMobileVisible(true)}
          className="shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "56px", height: "56px", backgroundColor: "#9333ea" }}
        >
          ☰
        </Button>
      </div>

      {/* Mobile Sidebar via Antd Drawer */}
      <Drawer
        title={
          <span
            className="fw-bold fs-5 text-dark"
            style={{ fontFamily: "cursive" }}
          >
            Notes App
          </span>
        }
        placement="left"
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        styles={{ body: { padding: 0 } }}
        size="default"
      >
        <Sidebar activeCategory={activeCategory} setActiveCategory={(c) => { setActiveCategory(c); setMobileVisible(false); }} />
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-grow-1 w-100">
        <Hero activeCategory={activeCategory} searchTerm={searchTerm} />
      </div>
    </main>
  );
};

export default Home;
