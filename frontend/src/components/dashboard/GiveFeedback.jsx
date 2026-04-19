import { useEffect, useState } from "react";

function GiveFeedback() {
  const [userName, setUserName] = useState("");
  const [targetType] = useState("TRIP");
  const [targetId, setTargetId] = useState("");
  const [trips, setTrips] = useState([]);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/api/bookings/trips")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load trips");
        }
        return res.json();
      })
      .then((data) => {
        setTrips(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading trips:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User not logged in.");
      return;
    }

    if (!targetId) {
      setError("Please select a trip.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating from 1 to 5.");
      return;
    }

    if (!title.trim()) {
      setError("Feedback title is required.");
      return;
    }

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters.");
      return;
    }

    const feedbackData = {
      userId: Number(userId),
      targetType,
      targetId: String(targetId),
      rating,
      title,
      comment,
      recommend,
    };

    try {
      const response = await fetch("http://localhost:8081/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      await response.json();
      alert("Feedback submitted successfully!");

      setError("");
      setTargetId("");
      setRating(0);
      setTitle("");
      setComment("");
      setRecommend(true);
    } catch (error) {
      console.error("Error:", error);
      setError("Error submitting feedback.");
    }
  };

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-title">Feedback & Reviews</h2>
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
          maxWidth: "760px",
        }}
      >
        <p style={{ marginBottom: "20px", color: "#667085" }}>
          Share your trip experience and help other travelers make better decisions.
        </p>

        {error && (
          <p style={{ color: "#dc2626", marginBottom: "12px", fontWeight: "500" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Feedback Type
            </label>
            <input
              type="text"
              value="Trip"
              disabled
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d0d5dd",
                background: "#f8fafc",
                color: "#475569",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Select Trip
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d0d5dd",
              }}
            >
              <option value="">Select a trip</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Rating
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: "24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: star <= rating ? "#f59e0b" : "#d1d5db",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short review title"
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
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              placeholder="Share your experience..."
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

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Would you recommend it?
            </label>
            <select
              value={recommend ? "yes" : "no"}
              onChange={(e) => setRecommend(e.target.value === "yes")}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d0d5dd",
              }}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default GiveFeedback;