import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components_css/Booking.css";

function AddBooking() {
    const [bookingDetails, setBookingDetails] = useState({
        customerName: "",
        roomType: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
    });

    const [message, setMessage] = useState({});
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]); // State to hold the bookings
    const [searchTerm, setSearchTerm] = useState(""); // State for search input

    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails({ ...bookingDetails, [name]: value });
        setMessage({}); // Clear previous messages
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!bookingDetails.customerName || !bookingDetails.roomType || !bookingDetails.checkIn || !bookingDetails.checkOut) {
            setMessage({ message: 'All fields are required.' });
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/add_booking/", bookingDetails, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = res.data;

            if (data.success) {
                setMessage({ success: "Booking added successfully!" });
                setBookingDetails({
                    customerName: "",
                    roomType: "",
                    checkIn: "",
                    checkOut: "",
                    guests: 1,
                });
                displayBookings(); // Refresh the bookings list after adding
            } else {
                setMessage(data);
            }
        } catch (error) {
            console.error('Error adding booking:', error);
            setMessage({ message: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const displayBookings = async () => {
        try {
            const res = await axios.get("http://localhost:8000/display_bookings/");
            const data = res.data;

            if (data.success) {
                setBookings(data.bookings);
            } else {
                setMessage(data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setMessage({ message: 'Could not fetch bookings. Please try again.'});
        }
    };

    useEffect(() => {
        displayBookings(); // Fetch bookings on component mount
    }, []);

    // Filtered bookings based on search input
    const filteredBookings = bookings.filter(booking =>
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="add-booking-container">
                <form className="add-booking-form" onSubmit={handleSubmit}>
                    <h2>Add Booking</h2>
                    <div className="form-group">
                        <label htmlFor="customerName">Customer Name</label>
                        <input
                            type="text"
                            name="customerName"
                            id="customerName"
                            placeholder="Customer Name"
                            onChange={handleChange}
                            value={bookingDetails.customerName}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="roomType">Room Category</label>
                        <select
                            id="roomType"
                            name="roomType"
                            value={bookingDetails.roomType}
                            onChange={handleChange}
                            className="booking-input"
                        >
                            <option hidden>Select Room Category</option>
                            <option value="Standard">Standard 1500RS</option>
                            <option value="Deluxe">Deluxe 2500RS</option>
                            <option value="Suite">Suite 30000RS</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="checkIn">Check-In Date</label>
                        <input
                            type="date"
                            max={bookingDetails.checkOut || undefined}
                            min={today}
                            name="checkIn"
                            id="checkIn"
                            onChange={handleChange}
                            value={bookingDetails.checkIn}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="checkOut">Check-Out Date</label>
                        <input
                            type="date"
                            name="checkOut"
                            id="checkOut"
                            min={bookingDetails.checkIn || today}
                            onChange={handleChange}
                            value={bookingDetails.checkOut}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="guests">Number of Guests</label>
                        <input
                            type="number"
                            name="guests"
                            id="guests"
                            min="1"
                            onChange={handleChange}
                            value={bookingDetails.guests}
                        />
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Adding Booking...' : 'Add Booking'}
                    </button>
                    {message.message && <p className="error-message">{message.message}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                </form>
            </div>

            {/* Search Bookings */}
            <div className="search-bookings">
                <input
                    type="text"
                    placeholder="Search by Customer Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Display Bookings */}
            <div className="booking-list">
                <h3>Current Bookings</h3>
                {filteredBookings.length > 0 ? (
                    <ul>
                        {filteredBookings.map((booking) => (
                            <li key={booking._id}>
                                {booking.customerName} - {booking.roomType} - Check-In: {booking.checkIn} - Check-Out: {booking.checkOut}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No bookings available.</p>
                )}
            </div>
        </>
    );
}
export default AddBooking;
