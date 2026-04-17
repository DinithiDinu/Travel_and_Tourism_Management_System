import { useState, useEffect } from "react";

function RaiseTicket() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [userName, setUserName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  const name = localStorage.getItem("userName");
  if (name) {
    setUserName(name);
  }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!subject.trim()) {
  setError("Subject is required.");
  return;
}

   if (!category) {
  setError("Please select a ticket category.");
  return;
}

if (!description.trim()) {
  setError("Description is required.");
  return;
}
    const userId = localStorage.getItem("userId");

    if (!userId) {
    alert("User not logged in");
    return;
  }

const ticketData = {
  userId: Number(userId),
  subject,
  description,
  category,
};

    try {
      const response = await fetch("http://localhost:8081/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      await response.json();
      alert("Ticket submitted successfully!");
      setError("");
      setSubject("");
      setDescription("");
      setCategory("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting ticket");
    }
  };

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-title">Support & Complaints</h2>
      </div>

      <p style={{ marginBottom: "10px", color: "#64748b" }}>
  Logged in as: <strong>{userName}</strong>
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          maxWidth: "700px",
        }}
      >
        <p style={{ marginBottom: "20px", color: "#667085" }}>
          Having an issue with a booking, driver, guide, or service? Raise a ticket and our admin team will review it.
        </p>

      {error && (
        <p style={{ color: "#dc2626", marginBottom: "12px", fontWeight: "500" }}>
        {error}
        </p>
           )}
             
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Enter ticket subject"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d0d5dd",
                outline: "none",
              }}
            />
          </div>

  <div style={{ marginBottom: "16px" }}>
  <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>
    Category
  </label>

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #d0d5dd",
    }}
  >
    <option value="">Select category</option>
    <option value="BOOKING">Booking Problem</option>
    <option value="DRIVER">Driver Problem</option>
    <option value="GUIDE">Guide Problem</option>
    <option value="PAYMENT">Payment Problem</option>
    <option value="OTHER">Other</option>
  </select>
</div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe your issue"
              rows="6"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d0d5dd",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaiseTicket;