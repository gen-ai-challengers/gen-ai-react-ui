import * as React from "react";
import LanguageRounded from "@mui/icons-material/LanguageRounded";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "./AppBar.css";

const pages = ["Products", "Gallery", "Support", "Contact"];

function ResponsiveAppBar() {


  return (
    <div className="app-bar">
      <div className="logo">
        <img className="logo-img" src="/logo.png" alt="logo" />
        <img className="logo-text" src="/logo-text.png" alt="logo" />
      </div>
      <div className="page-links">
        {pages.map((page) => (
          <a className="page-link" href="/">{page}</a>
        ))}
      </div>
      <div className="right-menu">
        <div>
          <LanguageRounded />
        </div>
        <div>
          <AccountCircle />
        </div>
      </div>
    </div>
  );
}
export default ResponsiveAppBar;
