import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <nav className="nav-left">
        <NavLink
          to="/garage"
          className={({ isActive }) => `nav-link one${isActive ? ' active' : ''}`}
        >
          GARAGE
        </NavLink>
        <NavLink
          to="/winners"
          className={({ isActive }) => `nav-link two${isActive ? ' active' : ''}`}
        >
          WINNERS
        </NavLink>
      </nav>

      <h1 className="app-title">
        <span className="title-async">ASYNC</span>
        <span className="title-race">RACE</span>
      </h1>
      <div className="right" />
    </header>
  );
};

export default Header;
