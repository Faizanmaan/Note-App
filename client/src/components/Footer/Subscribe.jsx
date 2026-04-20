import React from "react";
import { motion } from "motion/react";
import { CiMail } from "react-icons/ci";

const Subscribe = () => {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <h6
        className="fw-bold mb-4 text-dark fs-6"
        style={{ letterSpacing: "0.5px" }}
      >
        Subscribe
      </h6>
      <p className="text-muted mb-3" style={{ fontSize: "15px" }}>
        Get the latest updates and tips directly in your inbox.
      </p>
      <form className="d-flex position-relative mt-2">
        <input
          type="email"
          className="form-control rounded-pill bg-light border-0 py-2 ps-4 pe-5 shadow-sm focus-ring focus-ring-primary"
          placeholder="Enter your email"
          style={{ fontSize: "15px" }}
        />
        <motion.button
          type="button"
          className="position-absolute border-0 shadow-sm rounded-circle d-flex align-items-center justify-content-center text-white"
          style={{
            top: "4px",
            right: "4px",
            height: "30px",
            width: "30px",
            backgroundColor: "#9333ea",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <CiMail className="fs-5" />
        </motion.button>
      </form>
    </div>
  );
};

export default Subscribe;
