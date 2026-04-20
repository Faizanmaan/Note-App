import React from "react";
import Navbar from "./Navbar";

const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="bg-transparent border-0 shadow-none">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </header>
  );
};

export default Header;
