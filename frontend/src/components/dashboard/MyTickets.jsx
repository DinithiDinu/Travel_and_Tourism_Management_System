import { useEffect, useState } from "react";

function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("Traveler logged in userId:", userId);

    if (!userId) {
      console.error("User not logged in");
      return;
    }


    fetch(`http://localhost:8081/api/tickets/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-title">My Tickets</h2>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        {tickets.length === 0 ? (
          <p>No tickets yet</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>{ticket.subject}</h3>
              <p style={{ marginBottom: "8px", color: "#475467" }}>
                {ticket.description}
              </p>

              <p style={{ marginBottom: "6px" }}>
              <strong>Category:</strong> {ticket.category || "Not specified"}
              </p>

              
              <div style={{ marginBottom: "10px" }}>
                <strong>Status: </strong>
                <span
                    style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor:
                            ticket.status === "RESOLVED"
                         ? "#dcfce7"
                         : ticket.status === "IN_PROGRESS"
                         ? "#fef3c7"
                         : "#fee2e2",
                     color:
                        ticket.status === "RESOLVED"
                      ? "#166534"
                      : ticket.status === "IN_PROGRESS"
                      ? "#92400e"
                      : "#991b1b",
                   }}
            >
              {ticket.status}
            </span>
            </div>

              {ticket.adminResponse ? (
                <p style={{ marginBottom: "6px" }}>
                  <strong>Admin Response:</strong> {ticket.adminResponse}
                </p>
              ) : (
                <p style={{ marginBottom: "6px", color: "#667085" }}>
                  <strong>Admin Response:</strong> No response yet
                </p>
              )}

              <p style={{ fontSize: "13px", color: "#98a2b3", marginTop: "10px" }}>
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTickets;