import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../components_css/Login.css";

function Login() {
  const [customer, setCustomerDetails] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customer, [name]: value });
  };

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/login/", customer);
      const data = await res.data;
      console.log(data);

      if (data.success) {
        // Redirect on success
        navigate('/add_booking');
      } else {
        // Show error messages
        setMessage(data);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSignin}>
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              value={customer.email}
            />
            <p className="error-message">{message.email}</p>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              value={customer.password}
            />
            <p className="error-message">{message.password}</p>
          </div>
          <button
            type="submit"
            className="btn"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
