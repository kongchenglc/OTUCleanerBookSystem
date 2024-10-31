// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";  

const Header = () => {
  return (
    <div className="header">
      <img src={logo} alt="Logo" className="header-logo" />
      <div className="nav-bar">
        <Link to="/schedule">Schedule</Link>
        <Link to="/review">Review</Link>
        <Link to="/my-job">My Job</Link>
        <Link to="/account-setting">Account Setting</Link>
      </div>
    </div>
  );
};

export default Header;
