import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./comments.css";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

function CommentsSection({ refreshKey = 0 }) {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ждём пока auth загрузится
    if (authLoading) return;

    // если не staff — просто ничего не грузим
    if (!user?.is_staff) {
      setLoading(false);
      setComments([]);
      return;
    }

    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await api.get("/portfolio/comments/", {
          params: { project: id },
        });

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        setComments(data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchComments();
  }, [id, refreshKey, authLoading, user]);

  // ⬇️ return ПОСЛЕ всех хуков — это важно
  if (authLoading) return null;
  if (!user?.is_staff) return null;

  if (loading) {
    return (
      <div className="comment-content">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="comment-box skeleton" key={index}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div className="skeleton-line name"></div>
              <div className="skeleton-line role"></div>
            </div>
            <div className="skeleton-line text long"></div>
            <div className="skeleton-line text"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="comment-content">
      {comments.length === 0 ? (
        <div className="comment-box">
          <h5>No comments yet.</h5>
        </div>
      ) : (
        comments.map((c) => (
          <div className="comment-box" key={c.id}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <h3>Admin</h3>
              {c.created_at && (
                <h5 className="dates">
                  {new Date(c.created_at).toLocaleString()}
                </h5>
              )}
            </div>
            <h5>{c.comment}</h5>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentsSection;
