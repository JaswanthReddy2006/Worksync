import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">WorkSync</div>
      </div>
      <div className="navbar-center">
        <input type="text" className="search-bar" placeholder="Search..." />
      </div>
      <div className="navbar-right">
        <button className="nav-btn">Notifications</button>
        <div className="avatar">69</div>
      </div>
    </nav>
  );
};

export default Navbar;
