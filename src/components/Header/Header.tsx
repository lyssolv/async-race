import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className='app-header'>
            <nav className='nav-left'>
                <NavLink className="nav-link one" to="/garage">
                    GARAGE
                </NavLink>
                <NavLink className="nav-link two" to="/winners">
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