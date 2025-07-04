import React, { useState, useEffect } from "react";
import "../styles/adminhome.css";
import AdminProfile from "./AdminProfile";

const AdminHome = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("tix-user"));
    if (savedUser) {
      setUser(savedUser);
      fetchEvents(savedUser.id); // Using user ID to fetch their events
    }
  }, []);

  const fetchEvents = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch events from your backend API
      const response = await fetch(
        `https://ticket-server-e4r3.onrender.com/api/events/admin/${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allEvents = await response.json();

      // Get current date to separate upcoming and past events
      const currentDate = new Date();

      // Process events data to match your frontend structure
      const processedUpcoming = allEvents
        .filter((event) => new Date(event.date) >= currentDate)
        .map((event) => ({
          id: event._id || event.id,
          title: event.title,
          date: event.date,
          venue: event.location,
          ticketType: "General Admission", // You might want to get this from your API
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EVENT-${event.id}-USER-${userId}`,
        }));

      const processedPast = allEvents
        .filter((event) => new Date(event.date) < currentDate)
        .map((event) => ({
          id: event._id || event.id,
          title: event.title,
          date: event.date,
          venue: event.location,
        }));

      setUpcomingEvents(processedUpcoming);
      setPastEvents(processedPast);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
      // Fallback to mock data if API fails (for development)
      if (process.env.NODE_ENV === "development") {
        mockFetchEvents();
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data function
  // const mockFetchEvents = () => {
  //   setUpcomingEvents([
  //     {
  //       id: 1,
  //       title: "Summer Music Festival",
  //       date: "2025-08-15",
  //       venue: "Central Park",
  //       ticketType: "VIP Pass",
  //       qrCode:
  //         "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EVENT-1-USER-123",
  //     },
  //   ]);
  //   setPastEvents([
  //     {
  //       id: 3,
  //       title: "Spring Art Exhibition",
  //       date: "2025-04-10",
  //       venue: "City Art Gallery",
  //     },
  //   ]);
  // };

  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <main className="dashboard-main">
        <div className="user-greeting">
          <h1>Welcome back, {user.name || user.email.split("@")[0]}!</h1>
          <p>Here's what's happening with your events</p>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            My Events
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
                      <div className="event-info">
                        <h3>{event.title}</h3>
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
                        <p>
                          <strong>Ticket:</strong> {event.ticketType}
                        </p>
                      </div>
                      {event.qrCode && (
                        <div className="event-qr">
                          <img src={event.qrCode} alt="Event QR Code" />
                          <button className="download-btn"></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>You don't have any upcoming events.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && <AdminProfile />}
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 TixLite. All rights reserved.</p>
      </footer>
    </>
  );
};

export default AdminHome;
