import React, { useContext, useState, useEffect } from "react";
import "./media-form.css";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UploadForm() {
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Проверяем авторизацию
    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!file) {
            setError("Upload file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("portfolio/media/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess("Loaded!");
            setFile(null);
        } catch (err) {
            console.log(err);

            // Ошибка от сервера
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } 
            else if (err.response?.data) {
                // Если сервер вернул объект ошибок
                setError(JSON.stringify(err.response.data["file"]));
            } 
            else {
                setError("Error!");
            }
        }
    };

    return (
        <div className="upload-form">
            <h2>Upload file</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button type="submit">Upload</button>
            </form>

            {/* вывод ошибки */}
            {error && <p className="error">{error}</p>}

            {/* вывод успеха */}
            {success && <p className="success">{success}</p>}
        </div>
    );
}

export default UploadForm;
