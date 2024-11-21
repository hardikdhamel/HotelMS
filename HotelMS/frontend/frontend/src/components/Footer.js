// Footer.js
import React from "react";
import "../components_css/Footer.css"; // Assuming you'll add some styling

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy;The Paradise</p>
        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
