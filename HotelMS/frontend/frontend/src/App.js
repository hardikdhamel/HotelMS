import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home.js";
import SignUp from "./components/Sign_up.js";
import Login from "./components/Login.js";
import Contact from "./components/Contact.js";
import Footer from "./components/Footer.js";
import Booking from "./components/Booking.js";
import './App.css';

function App() {
  const navigate = useNavigate(); // Hook to handle navigation
  return (
    <div className="App">
      <nav>
        <ul className="navbar">
          <li>
            <button onClick={() => navigate("/")}>Home</button>
          </li>
          <li>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </li>
          <li>
            <button onClick={() => navigate("/login")}>Login</button>
          </li>
          <li>
            <button onClick={() => navigate("/contact")}>Contact</button>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add_booking" element={<Booking />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer/>
    </div>
  );
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;
