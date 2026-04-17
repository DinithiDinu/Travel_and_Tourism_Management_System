import { useEffect, useState } from "react";

function MyFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    targetType: "DESTINATION",
    targetId: "",
    rating: 0,
    title: "",
    comment: "",
    recommend: true,
  });

  const userId = localStorage.getItem("userId");

  const fetchMyFeedback = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:8081/api/feedback/user/${userId}`);
      const data = await res.json();
      setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching my feedback:", error);
    }
  };

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const handleDelete = async (feedbackId) => {
    const confirmed = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:8081/api/feedback/${feedbackId}`, {
        method: "DELETE",
      });
      fetchMyFeedback();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const startEdit = (feedback) => {
    setEditingId(feedback.feedbackId);
    setEditForm({
      targetType: feedback.targetType,
      targetId: feedback.targetId,
      rating: feedback.rating,
      title: feedback.title,
      comment: feedback.comment,
      recommend: feedback.recommend,
    });
  };

  const handleUpdate = async (feedbackId) => {
    if (!editForm.title.trim() || editForm.title.trim().length < 3) {
      alert("Title must be at least 3 characters.");
      return;
    }

    if (!editForm.comment.trim() || editForm.comment.trim().length < 10) {
      alert("Comment must be at least 10 characters.");
      return;
    }

    if (editForm.rating < 1 || editForm.rating > 5) {
      alert("Please select a valid rating.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/feedback/${feedbackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          targetType: editForm.targetType,
          targetId: editForm.targetId,
          rating: editForm.rating,
          title: editForm.title,
          comment: editForm.comment,
          recommend: editForm.recommend,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update feedback");
      }

      setEditingId(null);
      fetchMyFeedback();
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-title">My Feedback</h2>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        {feedbackList.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          feedbackList.map((feedback) => (
            <div
              key={feedback.feedbackId}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              {editingId === feedback.feedbackId ? (
                <div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                      Feedback Type
                    </label>
                    <select
                      value={editForm.targetType}
                      onChange={(e) =>
                        setEditForm({ ...editForm, targetType: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #d0d5dd",
                      }}
                    >
                      <option value="DESTINATION">Destination</option>
                      <option value="HOTEL">Hotel</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                      Destination / Hotel ID
                    </label>
                    <input
                      type="text"
                      value={editForm.targetId}
                      onChange={(e) =>
                        setEditForm({ ...editForm, targetId: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #d0d5dd",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                      Rating
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, rating: star })}
                          style={{
                            fontSize: "24px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: star <= editForm.rating ? "#f59e0b" : "#d1d5db",
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #d0d5dd",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                      Comment
                    </label>
                    <textarea
                      rows="4"
                      value={editForm.comment}
                      onChange={(e) =>
                        setEditForm({ ...editForm, comment: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #d0d5dd",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                      Recommend
                    </label>
                    <select
                      value={editForm.recommend ? "yes" : "no"}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          recommend: e.target.value === "yes",
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #d0d5dd",
                      }}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdate(feedback.feedbackId)}
                    >
                      Save Changes
                    </button>
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{feedback.title}</h3>
                    <span style={{ color: "#d97706", fontWeight: "700" }}>
                      {"★".repeat(feedback.rating)}
                      {"☆".repeat(5 - feedback.rating)}
                    </span>
                  </div>

                  <p style={{ margin: "8px 0", color: "#475467" }}>
                    {feedback.comment}
                  </p>

                  <p><strong>Type:</strong> {feedback.targetType}</p>
                  <p><strong>Target:</strong> {feedback.targetId}</p>
                  <p><strong>Recommend:</strong> {feedback.recommend ? "Yes" : "No"}</p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : "N/A"}
                  </p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => startEdit(feedback)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => handleDelete(feedback.feedbackId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyFeedback;