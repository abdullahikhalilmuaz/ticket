// LandingPage.jsx
import React from "react";
import "../styles/landing.css";
import Dashboard from "./Dashboard";
const handleRegiser = () => {
  window.location.href = "/register";
};
var saved = JSON.parse(localStorage.getItem("tix-user"));
const handleAdmin = () => {
  window.location.href = "/admin";
};

const Home = () => {
  return (
    <>
      {saved ? (
        <Dashboard />
      ) : (
        <div className="landing-container">
          <header className="hero">
            <nav className="navbar">
              <span style={{ color: "black" }}>{saved && saved.email}</span>
              <div className="logo">TixLite</div>
              <ul className="nav-links">
                <li>
                  <a>Features</a>
                </li>
                <li>
                  <a>Browse Events</a>
                </li>
                <li onClick={handleRegiser}>
                  <a>Get Started</a>
                </li>
                <li onClick={handleAdmin}>
                  <a>Admin ?</a>
                </li>
              </ul>
            </nav>
            <div className="hero-content">
              <h1>Your Gateway to Memorable Events</h1>
              <p>
                Discover, book, and attend events with ease. Quick, simple, and
                secure ticketing.
              </p>
              <a className="cta-button">Browse Events</a>
            </div>
          </header>

          <section className="features" id="features">
            <h2>Why Choose TixLite?</h2>
            <div className="feature-list">
              <div className="feature">
                <h3>Easy Booking</h3>
                <p>Reserve tickets in just a few clicks, without any hassle.</p>
              </div>
              <div className="feature">
                <h3>Secure Access</h3>
                <p>Get QR-based digital tickets for seamless check-ins.</p>
              </div>
              <div className="feature">
                <h3>Admin Dashboard</h3>
                <p>
                  Manage events, view attendees, and track sales in real-time.
                </p>
              </div>
            </div>
          </section>

          <footer className="footer">
            <p>&copy; 2025 TixLite. All rights reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
};

export default Home;
