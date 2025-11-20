import React, { useContext, useState, useEffect } from "react";
import "./profile.css";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfileForm() {
    const { user, logout, loading } = useContext(AuthContext);

    // hooks MUST be here ALWAYS
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        if (user) {
            // Пользователь есть — заполняем форму
            setEmail(user.email);
            setUsername(user.username);
        } else if (!loading && !user) {
            // Пользователь нет — редиректим
            navigate("/login");
        }
    }, [loading, user, navigate]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const action = e.nativeEvent.submitter.value;

        if (action === "save") {
            try {
                const request_url = `/portfolio/users/${user.id}/`;
                console.log(request_url);
                await api.patch(request_url, { username, email });
            } catch (err) {
                setError(
                    err.response?.data?.email?.[0] ||
                    "User error"
                );
            }
        } 
        else if (action === "logout") {
            logout();
        }

        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <button type="submit" name="action" value="save">Save</button>
            <button type="submit" name="action" value="logout">Logout</button>

            {error && <div className="register-error">{error}</div>}
        </form>
    );
}

export default ProfileForm;
