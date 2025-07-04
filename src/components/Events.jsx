import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import "../styles/events.css";
import "../styles/tickets.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const ticketRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("tix-user"));
    if (userData && userData.id) {
      setUserId(userData.id);
      fetchUserTickets(userData.id);
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/events");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/tickets/user/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch user tickets");
      const data = await response.json();
      setUserTickets(data);
    } catch (err) {
      console.error("Error fetching user tickets:", err);
      toast.error("Failed to load your tickets");
    }
  };

  const handleBuyTicket = (event) => {
    if (!userId) {
      toast.info("Please login to purchase tickets");
      navigate("/login");
      return;
    }
    setSelectedEvent(event);
    setShowBuyModal(true);
  };

  const handlePrintTicket = useReactToPrint({
    content: () => ticketRef.current,
    pageStyle: `
      @page { size: auto; margin: 0mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
        .ticket-container { margin: 0; padding: 0; box-shadow: none; }
      }
    `,
    onAfterPrint: () => toast.success("Ticket printed successfully"),
  });

  const handlePaymentProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }

      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitTicketRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!userId) throw new Error("Please login to purchase tickets");
      if (!selectedEvent?._id) throw new Error("No event selected");
      if (!userDetails.name || !userDetails.email || !userDetails.phone) {
        throw new Error("Please fill in all personal details");
      }
      if (!paymentProof) throw new Error("Please upload payment proof");

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append(
        "userDetails",
        JSON.stringify({
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
        })
      );
      formData.append("paymentProof", paymentProof);

      const response = await fetch(
        `http://localhost:8080/api/events/${selectedEvent._id}/tickets`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit ticket request");
      }

      const data = await response.json();
      setTicketData(data);
      setShowBuyModal(false);
      setShowTicketModal(true);

      setUserDetails({ name: "", email: "", phone: "" });
      setPaymentProof(null);
      setPaymentProofPreview(null);

      fetchUserTickets(userId);
      fetchEvents();

      toast.success("Ticket request submitted successfully!");
    } catch (err) {
      console.error("Error submitting ticket request:", err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModals = () => {
    setShowBuyModal(false);
    setShowTicketModal(false);
    setSelectedEvent(null);
    setTicketData(null);
    setUserDetails({ name: "", email: "", phone: "" });
    setPaymentProof(null);
    setPaymentProofPreview(null);
  };

  if (!userId) {
    return (
      <div className="auth-message">
        <h2>Please login to view events</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="events-container">
      <h1>Upcoming Events</h1>
      <div className="user-tickets-summary">
        <h3>Your Tickets</h3>
        {userTickets.length > 0 ? (
          <div className="ticket-status-summary">
            {userTickets.map((ticket) => (
              <div
                key={ticket._id}
                className={`ticket-status-item ${ticket.status}`}
              >
                <span className="event-title">
                  {ticket.event?.title || "Unknown Event"}
                </span>
                <span className={`status-badge ${ticket.status}`}>
                  {ticket.status.toUpperCase()}
                </span>
                {ticket.status === "rejected" && ticket.rejectionReason && (
                  <span className="rejection-reason">
                    Reason: {ticket.rejectionReason}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't purchased any tickets yet</p>
        )}
      </div>

      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => {
            const userTicket = userTickets.find((t) => t.eventId === event._id);
            return (
              <div key={event._id} className="event-card">
                {event.image && (
                  <img
                    src={`http://localhost:8080${event.image}`}
                    alt={event.title}
                    className="event-image"
                    onError={(e) => {
                      e.target.src = "/default-event-image.jpg";
                    }}
                  />
                )}
                <div className="event-details">
                  <h2>{event.title}</h2>
                  <p className="event-description">{event.body}</p>
                  <div className="event-info">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <strong>Time:</strong> {event.time}
                    </p>
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                      <strong>Tickets Available:</strong> {event.tickets}
                    </p>
                  </div>
                  {userTicket ? (
                    <div className="ticket-status-container">
                      <div
                        className={`ticket-status-badge ${userTicket.status}`}
                      >
                        <span>Status: {userTicket.status.toUpperCase()}</span>
                        {userTicket.status === "rejected" &&
                          userTicket.rejectionReason && (
                            <div className="rejection-reason">
                              <strong>Reason:</strong>{" "}
                              {userTicket.rejectionReason}
                            </div>
                          )}
                      </div>
                    </div>
                  ) : (
                    <button
                      className={`buy-ticket-btn ${
                        event.tickets <= 0 ? "sold-out" : ""
                      }`}
                      onClick={() => handleBuyTicket(event)}
                      disabled={event.tickets <= 0}
                    >
                      {event.tickets <= 0 ? "Sold Out" : "Buy Ticket"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No upcoming events at the moment. Check back later!</p>
        )}
      </div>

      {/* Buy Ticket Modal */}
      {showBuyModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="buy-ticket-modal">
              <button
                className="close-modal"
                onClick={() => {
                  setShowBuyModal(false);
                  setPaymentProofPreview(null);
                }}
                disabled={isSubmitting}
              >
                &times;
              </button>
              <h2>Buy Ticket for {selectedEvent.title}</h2>

              <div className="payment-info-section">
                <h3>Payment Details</h3>
                <p>Please transfer the ticket amount to:</p>
                <div className="payment-details">
                  <p>
                    <strong>Account Name:</strong>{" "}
                    {selectedEvent.paymentInfo?.accountName}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    {selectedEvent.paymentInfo?.accountNumber}
                  </p>
                  <p>
                    <strong>Bank Name:</strong>{" "}
                    {selectedEvent.paymentInfo?.bankName}
                  </p>
                </div>
                <p className="payment-note">
                  After payment, please upload your proof of payment below.
                </p>
              </div>

              <form onSubmit={handleSubmitTicketRequest}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={userDetails.name}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={userDetails.email}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, email: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={userDetails.phone}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, phone: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Proof (Screenshot) *</label>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handlePaymentProofChange}
                    disabled={isSubmitting}
                  />
                  {paymentProofPreview && (
                    <div className="payment-proof-preview">
                      <img
                        src={paymentProofPreview}
                        alt="Payment proof preview"
                      />
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowBuyModal(false);
                      setPaymentProofPreview(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Display Modal */}
      {showTicketModal && ticketData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="ticket-modal">
              <button className="close-modal" onClick={handleCloseModals}>
                &times;
              </button>
              {ticketData.ticket.status === "pending" && (
                <div className="ticket-status pending">
                  <p>
                    Your ticket is pending approval from the event organizer
                  </p>
                  <p>You'll receive a confirmation once approved</p>
                </div>
              )}
              {ticketData.ticket.status === "rejected" && (
                <div className="ticket-status rejected">
                  <p>Your ticket request has been rejected</p>
                  {ticketData.ticket.rejectionReason && (
                    <p>Reason: {ticketData.ticket.rejectionReason}</p>
                  )}
                </div>
              )}
              <div className="ticket-container" ref={ticketRef}>
                <div className="ticket-header">
                  <h2>{ticketData.event.title}</h2>
                  <p className="ticket-number">
                    Ticket #:{" "}
                    {ticketData.ticket.ticketNumber || "PENDING-APPROVAL"}
                  </p>
                  <p className="ticket-status-badge">
                    Status:{" "}
                    <span className={`status-${ticketData.ticket.status}`}>
                      {ticketData.ticket.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                {ticketData.event.image && (
                  <img
                    src={`http://localhost:8080${ticketData.event.image}`}
                    alt={ticketData.event.title}
                    className="ticket-event-image"
                    onError={(e) => {
                      e.target.src = "/default-event-image.jpg";
                    }}
                  />
                )}
                <div className="ticket-details">
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(ticketData.event.date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">
                      {ticketData.event.time}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">
                      {ticketData.event.location}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Attendee:</span>
                    <span className="detail-value">
                      {ticketData.ticket.userDetails.name}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {ticketData.ticket.userDetails.email}
                    </span>
                  </div>
                </div>
                <div className="ticket-footer">
                  <p>
                    {ticketData.ticket.status === "pending"
                      ? "Your ticket request is pending approval. You will be notified once approved."
                      : ticketData.ticket.status === "approved"
                      ? "Please present this ticket at the event entrance"
                      : "This ticket request has been rejected"}
                  </p>
                </div>
                {ticketData.ticket.status === "approved" && (
                  <div className="ticket-barcode">
                    <div className="barcode"></div>
                    <p>{ticketData.ticket.ticketNumber}</p>
                  </div>
                )}
              </div>
              <div className="ticket-actions">
                {ticketData.ticket.status === "approved" && (
                  <button
                    onClick={handlePrintTicket}
                    className="print-ticket-btn"
                  >
                    Print Ticket
                  </button>
                )}
                <button
                  onClick={handleCloseModals}
                  className="close-ticket-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
