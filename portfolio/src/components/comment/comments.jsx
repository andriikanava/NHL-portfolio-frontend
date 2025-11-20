import { useEffect, useState} from "react";
import "./comments.css";
import api from "../../api/axios";

function CommentsSection() {
    const [comments, setComments] = useState([]);

    useEffect( () => {
        const fetchComments = async () => {
            try {
                const response = await api.get("/portfolio/comments/");
                setComments(response.data);
            }
            catch (err) {
                console.log(err.message);
            }
        }
        fetchComments();
    }, []);

    const comment_box = [];
    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        comment_box.push(
            <div class="comment-box">
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <h3>{comment.name}</h3>
                    <h5 className="dates">{comment.role}</h5>
                </div>
                <h5>{comment.comment}</h5>
            </div>
        )
    }
    return (
        <div class="comment-content">
            <h1>Comments ✉️</h1>
            {comment_box}
        </div>
    );
}

export default CommentsSection;