import React, { useState, useEffect } from "react";
import "../styles/welcome.css";
import "../styles/adminhome.css";

const Welcome = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://ticket-server-e4r3.onrender.com/api/events"
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const allEvents = await response.json();
      const currentDate = new Date();

      const processedUpcoming = allEvents
        .filter((event) => new Date(event.date) >= currentDate)
        .map((event) => ({
          id: event._id,
          title: event.title,
          date: event.date,
          venue: event.location,
          description: event.body,
          image: event.image
            ? `https://ticket-server-e4r3.onrender.com${event.image}`
            : "https://via.placeholder.com/300",
          ticketPrice: "Contact Organizer",
          ticketType: "General Admission",
        }));

      setUpcomingEvents(processedUpcoming);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <main className="dashboard-main">
        <div className="user-greeting">
          <h1>Welcome to Our Events Platform!</h1>
          <p>Discover amazing upcoming events</p>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            All Events
          </button>
          <button
            className={`tab-button ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About Us
          </button>
        </div>

        {activeTab === "events" && (
          <div className="events-section">
            <div className="upcoming-events">
              <h2>Upcoming Events</h2>
              {upcomingEvents.length > 0 ? (
                <div className="event-cards">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="event-card">
                      <div className="event-image-container">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="event-image"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300";
                          }}
                        />
                      </div>
                      <div className="event-info">
                        <h3>{event.title}</h3>
                        <p className="event-description">{event.description}</p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>
                          <strong>Venue:</strong> {event.venue}
                        </p>
                         <button
                          className="register-btn"
                          onClick={() => (window.location.href = "/login")}
                        >
                          Visit Tickets Buy Ticket
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No upcoming events at the moment. Check back later!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="about-section">
            <h2>About Our Platform</h2>
            <p>
              Welcome to our events platform where you can discover and register
              for amazing events in your area. We connect people with great
              experiences.
            </p>
            <div className="features">
              <div className="feature-card">
                <h3>Discover Events</h3>
                <p>
                  Find concerts, exhibitions, workshops and more happening near
                  you.
                </p>
              </div>
              <div className="feature-card">
                <h3>Easy Registration</h3>
                <p>Simple and secure registration process for all events.</p>
              </div>
              <div className="feature-card">
                <h3>Never Miss Out</h3>
                <p>
                  Get notifications about upcoming events that match your
                  interests.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Events Platform. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Welcome;
