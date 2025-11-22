import { useEffect, useState } from "react";
import "./comments.css";
import api from "../../api/axios";

function CommentsSection() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get("/portfolio/comments/");
                setComments(response.data);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, []);

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
            {comments.map((comment, index) => (
                <div className="comment-box" key={index}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <h3>{comment.name}</h3>
                        <h5 className="dates">{comment.role}</h5>
                    </div>
                    <h5>{comment.comment}</h5>
                </div>
            ))}
        </div>
    );
}

export default CommentsSection;
