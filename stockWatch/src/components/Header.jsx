import React from "react";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a className="navbar-brand d-flex align-items-center" href="/">
        <img
          src="/stockWatch-icon.png"
          alt="Logo"
          width="40"
          height="40"
          className="d-inline-block align-top me-2"
        />
        <span>StockWatch</span>
      </a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/watchlist ">
              Watchlist
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/portfolio">
              Portfolio
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/chat">
              Chat
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
