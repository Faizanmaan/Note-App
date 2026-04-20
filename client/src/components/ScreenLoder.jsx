import React from "react";
import logo from "@/assets/logo.svg";

const ScreenLoder = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
      }}
    >
      <div className="position-relative">
        <div
          className="spinner-border text-primary"
          style={{ width: "4rem", height: "4rem", borderWidth: "0.2rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h5 className="fw-bold mb-1 text-dark" style={{ letterSpacing: "1px" }}>
          <img
            src={logo}
            alt="logo"
            className="animate-pulse w-100"
          />{" "}
        </h5>
        <div className="d-flex justify-content-center gap-1 mt-4">
          <div className="dot animate-bounce-slow"></div>
          <div className="dot animate-bounce-slow delay-100"></div>
          <div className="dot animate-bounce-slow delay-200"></div>
        </div>
      </div>

      <style>{`
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(0.9); }
        }
        .animate-bounce-slow {
          width: 6px;
          height: 6px;
          background-color: #9333ea;
          border-radius: 50%;
          animation: bounce 1s infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default ScreenLoder;
