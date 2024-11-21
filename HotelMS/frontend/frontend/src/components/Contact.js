import React, { useState } from 'react';
import axios from 'axios';
import '../components_css/Contact.css'; // Include your CSS

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent page reload

    // Send data to the Django backend
    axios.post('http://localhost:8000/api/contact/', formData)
      .then((response) => {
        setSuccessMessage(response.data.message);  // Success message from backend
        setErrorMessage('');  // Clear error
        setFormData({ name: '', email: '', message: '' });  // Clear form
      })
      .catch((error) => {
        setErrorMessage('Error sending message. Please try again.');
        setSuccessMessage('');  // Clear success message
      });
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="contact-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="contact-input"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="contact-textarea"
          required
        />
        <button type="submit" className="contact-button">Send Message</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Contact;
