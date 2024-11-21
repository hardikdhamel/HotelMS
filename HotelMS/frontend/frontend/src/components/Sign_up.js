import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../components_css/Sign_up.css"

function Sign_up() {
  const [message, setmessage] = useState({});

  const [customer, setcustomerDetails] = useState({
    fname: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setcustomerDetails({ ...customer, [name]: value });
  };

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/sign_up/",
        customer,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = res.data;
      console.log(data);

      if (data.success) {
        navigate('/add_booking');
      } else {
        setmessage(data);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      // setmessage({ message: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <form onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <input
            type="text"
            name="fname"
            id="fname"
            placeholder="First Name"
            className="signup-input"
            onChange={handleChange}
            value={customer.fname}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="signup-input"
            onChange={handleChange}
            value={customer.email}
          />
          <p className="error-message">{message.email}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="signup-input"
            onChange={handleChange}
            value={customer.password}
          />
          {/* <p className="error-message">{message.password}</p> */}
          <input
            type="password"
            name="cpassword"
            id="cpassword"
            placeholder="Confirm Password"
            className="signup-input"
            onChange={handleChange}
            value={customer.cpassword}
          />
          <p className="error-message">{message.pass}</p>
          <button type="submit" className="signup-button">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default Sign_up;
