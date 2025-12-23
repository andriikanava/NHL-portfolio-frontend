import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import "./comment-form.css";

function CommentForm({ onCreated }) {
  const { id } = useParams(); // project id из /projects/:id
  const { user, loading } = useContext(AuthContext);

  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // Комменты по требованиям — только staff
  if (loading) return null;
  if (!user?.is_staff) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setSending(true);

      await api.post("/portfolio/comments/", {
        project: Number(id),
        comment: comment.trim(),
        user: user.id,
        status: "OPEN",
      });

      setComment("");
      if (typeof onCreated === "function") onCreated();
    } catch (err) {
      console.error(err.response?.data || err.message);

      const data = err.response?.data;
      if (data && typeof data === "object") {
        const key = Object.keys(data)[0];
        const msg = Array.isArray(data[key]) ? data[key][0] : String(data[key]);
        setError(msg);
      } else {
        setError("Failed to send comment");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Write comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      {error ? <div className="field-error">{error}</div> : null}

      <button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

export default CommentForm;
