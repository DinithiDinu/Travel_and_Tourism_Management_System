import { useEffect, useState } from "react";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [responseInputs, setResponseInputs] = useState({});
  const [filter, setFilter] = useState("OPEN");

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/tickets");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (ticketId, status) => {
    try {
      await fetch(`http://localhost:8081/api/tickets/${ticketId}/status?status=${status}`, {
        method: "PUT",
      });
      fetchTickets();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const submitResponse = async (ticketId) => {
    const response = responseInputs[ticketId];
    if (!response) return;

    if (!response || !response.trim()) {
  alert("Admin response cannot be empty.");
  return;
    }

    try {
      await fetch(
        `http://localhost:8081/api/tickets/${ticketId}/response?response=${encodeURIComponent(response)}`,
        { method: "PUT" }
      );
      setResponseInputs((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets();
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const handleResolve = async (ticketId) => {
  const response = responseInputs[ticketId];

  if (!response || !response.trim()) {
    alert("Please write an admin response before resolving this ticket.");
    return;
  }

  try {
    await fetch(
      `http://localhost:8081/api/tickets/${ticketId}/response?response=${encodeURIComponent(response)}`,
      { method: "PUT" }
    );

    await fetch(
      `http://localhost:8081/api/tickets/${ticketId}/status?status=RESOLVED`,
      { method: "PUT" }
    );

    setResponseInputs((prev) => ({ ...prev, [ticketId]: "" }));
    fetchTickets();
  } catch (error) {
    console.error("Error resolving ticket:", error);
  }
};

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-title">Manage Support Tickets</h2>

        <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
  <button 
  className ={filter === "ALL" ? "btn btn-primary btn-sm" : "btn btn-outline-dark btn-sm"}
  onClick={() => setFilter("ALL")} >
    All
  </button>

  <button 
  className = {filter === "OPEN" ? "btn btn-primary btn-sm" : "btn btn-outline-dark btn-sm"}
  onClick={() => setFilter("OPEN")}>
    Open
  </button>

  <button 
  className = {filter === "IN_PROGRESS" ? "btn btn-primary btn-sm" : "btn btn-outline-dark btn-sm"}
  onClick={() => setFilter("IN_PROGRESS")}>
    In Progress
  </button>

  <button 
  className = {filter === "RESOLVED" ? "btn btn-primary btn-sm" : "btn btn-outline-dark btn-sm"}
  onClick={() => setFilter("RESOLVED")}>
    Resolved
  </button>

  <p style={{ marginBottom: "12px", color: "#667085"}}>
    Total tickets: {tickets.length}
  </p>
  </div>
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
          <p>No tickets found.</p>
        ) : (

          tickets
             .filter((ticket) => {
             if (filter === "ALL") return true;
             return ticket.status === filter;
           })
          .map((ticket) => (
            <div
              key={ticket.ticketId}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>{ticket.subject}</h3>
              <p style={{ margin: "0 0 8px 0" }}>{ticket.description}</p>
              <p><strong>User ID:</strong> {ticket.userId}</p>
              <p><strong>Category:</strong> {ticket.category || "Not specified"}</p>
                <p>
                  <strong>Status:</strong>{" "}
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
              </p>

              {ticket.adminResponse && (
                <p><strong>Admin Response:</strong> {ticket.adminResponse}</p>
              )}

              <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button className="btn btn-outline-dark btn-sm" onClick={() => updateStatus(ticket.ticketId, "OPEN")}>
                  Mark Open
                </button>
                <button className="btn btn-outline-dark btn-sm" onClick={() => updateStatus(ticket.ticketId, "IN_PROGRESS")}>
                  In Progress
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => handleResolve(ticket.ticketId)}>
                Resolve
                </button>
              </div>

              <div style={{ marginTop: "14px" }}>
                <textarea
                  placeholder="Write admin response"
                  value={responseInputs[ticket.ticketId] || ""}
                  onChange={(e) =>
                    setResponseInputs((prev) => ({
                      ...prev,
                      [ticket.ticketId]: e.target.value,
                    }))
                  }
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #d0d5dd",
                    resize: "vertical",
                  }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: "10px" }}
                  onClick={() => submitResponse(ticket.ticketId)}
                >
                  Send Response
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminTickets;