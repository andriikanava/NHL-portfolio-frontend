import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./comment-form.css";
import api from "../../api/axios";

function CommentForm() {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState(user ? user.username : "");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");
    const [role, setRole] = useState("");
    const [notify, setNotify] = useState(false);
    const [error, setError] = useState("");

    const hadleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/portfolio/comments/", { name, email, comment, role, notify });
        }
        catch (err) {
            console.error(err.response?.data || err.message);
            if (err.response?.data) {
                setError(err.response.data);
            }
        }
    };

    return (
        <form className="comment-form" onSubmit={hadleSubmit}>
            <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>

            <textarea
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
             {error.comment && <div className="field-error">{error.comment[0]}</div>}
            <label className="notify-box">
                <input
                    type="checkbox"
                    checked={notify}
                    onChange={() => setNotify(!notify)}
                />
                Notify others
            </label>
            {error.notify && <div className="field-error">{error.notify[0]}</div>}

            <button type="submit">Send</button>

        </form>

    )
}

export default CommentForm;