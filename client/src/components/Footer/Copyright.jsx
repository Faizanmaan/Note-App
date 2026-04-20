import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const Copyright = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="d-flex flex-column flex-md-row justify-content-between align-items-center py-4 border-top"
    >
      <p className="mb-3 mb-md-0 text-muted" style={{ fontSize: "14px" }}>
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
      <div className="d-flex gap-4 text-muted" style={{ fontSize: "14px" }}>
        <Link to="/" className="text-muted text-decoration-none" style={{ transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="#9333ea"} onMouseOut={e=>e.target.style.color=""}>Terms</Link>
        <Link to="/" className="text-muted text-de© 2026 coration-none" style={{ transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="#9333ea"} onMouseOut={e=>e.target.style.color=""}>Privacy Policy</Link>
        <Link to="/" className="text-muted text-decoration-none" style={{ transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="#9333ea"} onMouseOut={e=>e.target.style.color=""}>Cookies</Link>
      </div>
    </motion.div>
  );
};

export default Copyright;
