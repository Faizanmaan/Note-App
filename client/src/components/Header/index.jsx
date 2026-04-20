import React from "react";
import Navbar from "./Navbar";

const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="sticky-top">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </header>
  );
};

export default Header;
