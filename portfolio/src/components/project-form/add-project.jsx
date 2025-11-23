import React, { useContext, useState } from "react";
import "./add-project.css";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom"; // Для редиректа


function ProjectForm() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [source_url, setSource_url] = useState("");
    const [week, setWeek] = useState("");
    const [period, setPeriod] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
          // 1️⃣ Регистрация
          console.log(week);
          await api.post("/portfolio/projects/", { title, description, url, source_url, week: Number(week), period: Number(period)});
    
          // 3️⃣ Редирект на главную
          navigate("/projects");
    
        } catch (err) {
          // Обработка ошибок
          console.error(err.response?.data || err.message);
          setError(
            err.response?.data?.email?.[0] ||
            err.response?.data?.password?.[0] ||
            "Project registration error"
          );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="url"
          placeholder="Url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Source url"
          value={source_url}
          onChange={(e) => setSource_url(e.target.value)}
          required
        />

        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">Select period</option>
            <option value="1">Period 1</option>
            <option value="2">Period 2</option>
            <option value="3">Period 3</option>
            <option value="4">Period 4</option>
        </select>

        <select value={week} onChange={(e) => setWeek(e.target.value)}>
            <option value="">Select week</option>
            <option value="1">Week 1</option>
            <option value="2">Week 2</option>
            <option value="3">Week 3</option>
            <option value="4">Week 4</option>
        </select>

        <button type="submit">Add Project</button>
    
        {error && <div className="project-error">{error}</div>}
      </form>

    )

}

export default ProjectForm;