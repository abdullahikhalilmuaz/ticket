import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import "../styles/tickets.css";

const TicketDisplay = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ticketRef = useRef();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/events/tickets/${ticketId}`
        );
        if (!response.ok) throw new Error("Ticket not found");
        const data = await response.json();
        setTicket(data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handlePrint = useReactToPrint({
    content: () => ticketRef.current,
    pageStyle: `
      @page { size: auto; margin: 0mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
        .ticket-container { margin: 0; padding: 0; box-shadow: none; }
      }
    `,
  });

  if (loading) return <div className="loading">Loading ticket...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="ticket-page">
      <h1>Your Ticket</h1>
      <div className="ticket-container" ref={ticketRef}>
        <div className="ticket-header">
          <h2>{ticket.event.title}</h2>
          <p className="ticket-number">
            Ticket #: {ticket.ticket.ticketNumber}
          </p>
        </div>
        {ticket.event.image && (
          <img
            src={`http://localhost:8080${ticket.event.image}`}
            alt={ticket.event.title}
            className="ticket-event-image"
          />
        )}
        <div className="ticket-details">
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">
              {new Date(ticket.event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{ticket.event.time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{ticket.event.location}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Attendee:</span>
            <span className="detail-value">
              {ticket.ticket.userDetails.name}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">
              {ticket.ticket.userDetails.email}
            </span>
          </div>
        </div>
        <div className="ticket-footer">
          <p>Please present this ticket at the event entrance</p>
        </div>
      </div>
      <button onClick={handlePrint} className="print-ticket-btn">
        Print Ticket
      </button>
    </div>
  );
};

export default TicketDisplay;
