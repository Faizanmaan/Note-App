import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CiTwitter, CiLinkedin, CiFacebook, CiInstagram } from "react-icons/ci";
import Copyright from "./Copyright";
import Subscribe from "./Subscribe";
import logo from "@/assets/logo.svg";

const Footer = () => {
  return (
    <footer
      className="bg-white pt-5 pb-2 border-top position-relative"
      style={{ overflow: "hidden" }}
    >
      {/* Subtle background glow effect using CSS absolute */}
      <div
        className="position-absolute top-0 start-50 translate-middle-x"
        style={{
          width: "60%",
          height: "200px",
          background:
            "radial-gradient(ellipse at top, rgba(147, 51, 234, 0.08) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />

      <div className="container position-relative z-1 mt-4">
        <motion.div
          className="row gy-5 mb-5 justify-content-between"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="col-12 col-md-5 col-lg-4">
            <Link to="/" className="text-decoration-none d-block mb-4">
              <img
                src={logo}
                alt="logo"
                className="w-25"
              />
            </Link>
            <p
              className="text-muted mb-4"
              style={{ lineHeight: "1.8", fontSize: "15px" }}
            >
              A high-performance modern note-taking application designed to help
              you capture ideas, organize your workflows, and boost your daily
              productivity.
            </p>
            <div className="d-flex gap-3">
              {[CiTwitter, CiFacebook, CiLinkedin, CiInstagram].map(
                (Icon, idx) => (
                  <motion.a
                    href="#"
                    key={idx}
                    className="text-decoration-none d-flex align-items-center justify-content-center bg-light rounded-circle text-primary shadow-sm"
                    style={{ width: "42px", height: "42px" }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#9333ea",
                      color: "#ffffff",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="fs-5" />
                  </motion.a>
                ),
              )}
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6
              className="fw-bold mb-4 text-dark fs-6"
              style={{ letterSpacing: "0.5px" }}
            >
              Support
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li>
                <Link
                  to="/"
                  className="text-muted text-decoration-none d-inline-block hover-primary"
                  style={{ fontSize: "15px", transition: "color 0.2s" }}
                  onMouseOver={(e) => (e.target.style.color = "#9333ea")}
                  onMouseOut={(e) => (e.target.style.color = "")}
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <Subscribe />
        </motion.div>

        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
