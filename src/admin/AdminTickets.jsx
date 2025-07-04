import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/admin-tickets.css";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("tix-user"));
  const adminId = user.id;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // Include status filter in the API URL
        const url = `http://localhost:8080/api/events/tickets/admin/${adminId}?status=${statusFilter}`;

        console.log("Fetching tickets from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tickets");
        }

        const data = await response.json();
        console.log("Received tickets data:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from server");
        }

        setTickets(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(err.message);
        toast.error(`Error: ${err.message}`);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [adminId, statusFilter]); // Add statusFilter to dependency array

  const handleApprove = async (ticketId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/tickets/${ticketId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve ticket");
      }

      // Optimistic UI update
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: "approved" } : ticket
        )
      );

      toast.success("Ticket approved successfully!");
    } catch (err) {
      console.error("Error approving ticket:", err);
      toast.error(err.message);
      // Re-fetch tickets to ensure consistency
      fetchTickets();
    }
  };

  const handleReject = async (ticketId) => {
    const reason = prompt("Please enter the reason for rejection:");
    if (!reason) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/events/tickets/${ticketId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId, reason }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject ticket");
      }

      // Optimistic UI update
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, status: "rejected", rejectionReason: reason }
            : ticket
        )
      );

      toast.success("Ticket rejected successfully!");
    } catch (err) {
      console.error("Error rejecting ticket:", err);
      toast.error(err.message);
      // Re-fetch tickets to ensure consistency
      fetchTickets();
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:8080/api/events/tickets/admin/${adminId}?status=${statusFilter}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tickets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-tickets-container">
      <h1>Manage Ticket Requests</h1>

      <div className="filter-controls"></div>

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>No tickets found with status: {statusFilter || "all"}</p>
          <button onClick={fetchTickets} className="refresh-btn">
            Refresh Data
          </button>
        </div>
      ) : (
        <div className="tickets-list">
          {tickets &&
            tickets.map((ticket) => (
              <div key={ticket._id} className={`ticket-card ${ticket.status}`}>
                <div className="ticket-header">
                  <h3>
                    {ticket &&
                      (ticket.event?.title || "Event title not available")}
                  </h3>
                  <span className={`status-badge ${ticket.status}`}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>

                <div className="ticket-details">
                  <p>
                    <strong>Requested by:</strong>{" "}
                    {ticket && (ticket.userDetails?.name || "N/A")}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {ticket && (ticket.userDetails?.email || "N/A")}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {ticket && (ticket.userDetails?.phone || "N/A")}
                  </p>
                  <p>
                    <strong>Event Date:</strong>{" "}
                    {ticket.event?.date
                      ? new Date(ticket.event.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Event Time:</strong> {ticket.event?.time || "N/A"}
                  </p>
                  {ticket.rejectionReason && (
                    <p>
                      <strong>Rejection Reason:</strong>{" "}
                      {ticket.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="payment-proof">
                  <h4>Payment Proof:</h4>
                  {ticket.paymentProof ? (
                    <img
                      src={`http://localhost:8080${ticket.paymentProof}`}
                      alt="Payment proof"
                      className="payment-proof-image"
                      onError={(e) => {
                        e.target.src = "/default-payment-proof.jpg";
                        e.target.alt = "Payment proof not available";
                      }}
                    />
                  ) : (
                    <p>No payment proof available</p>
                  )}
                </div>

                <div className="ticket-actions">
                  {ticket.status === "pending" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(ticket._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(ticket._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {ticket.eventId && (
                    <button
                      className="view-event-btn"
                      onClick={() => navigate(`/event/${ticket.eventId}`)}
                    >
                      View Event
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
