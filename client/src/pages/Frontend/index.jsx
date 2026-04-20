import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Headers from "@/components/Header";
import Footer from "@/components/Footer";

const Frontend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Headers searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
      </Routes>
      <Footer />
    </>
  );
};

export default Frontend;
