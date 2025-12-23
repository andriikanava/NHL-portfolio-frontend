import React, { useState } from "react";
import "./add-project.css";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ProjectForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [year, setYear] = useState("1");
  const [module, setModule] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        title,
        description,
        url: url || null,
        source_url: sourceUrl || null,
        year: Number(year),
        module,
        private: isPrivate,
      };

      await api.post("/portfolio/projects/", payload);
      navigate("/projects");
    } catch (err) {
      console.error(err.response?.data || err.message);

      const data = err.response?.data;
      // нормальный вывод ошибок DRF
      if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : String(data[firstKey]);
        setError(msg);
      } else {
        setError("Project creation error");
      }
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
        type="text"
        placeholder="Module (e.g. Web Development)"
        value={module}
        onChange={(e) => setModule(e.target.value)}
        required
      />

      <select value={year} onChange={(e) => setYear(e.target.value)} required>
        <option value="1">Year 1</option>
        <option value="2">Year 2</option>
        <option value="3">Year 3</option>
        <option value="4">Year 4</option>
      </select>

      <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        Private project (only allowed users)
      </label>

      <input
        type="url"
        placeholder="Project URL (optional)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        type="url"
        placeholder="Source URL (optional)"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
      />

      <button type="submit">Add Project</button>

      {error && <div className="project-error">{error}</div>}
    </form>
  );
}

export default ProjectForm;
