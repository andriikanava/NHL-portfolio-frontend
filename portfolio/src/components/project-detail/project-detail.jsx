import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "./project-detail.css"
import { AuthContext } from "../../context/AuthContext";


function ProjectDetail() {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [err, setErr] = useState("");

  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadErr, setUploadErr] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileUrl = (u) => {
    if (!u) return "#";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    const base = (api.defaults.baseURL || "").replace(/\/$/, "");
    return `${base}${u}`;
  };

  const fetchProject = async () => {
    setErr("");
    try {
      const res = await api.get(`/portfolio/projects/${id}/`);
      setProject(res.data);
    } catch (e) {
      console.error(e.response?.data || e.message);
      setErr("Cannot load project (no access or not found)");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const res = await api.get(`/portfolio/media/`, {
        params: { project: id },
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setFiles(data);
    } catch (e) {
      console.error(e.response?.data || e.message);
      // если файлов нет или нет доступа, просто показываем пусто
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchFiles();
    // eslint-disable-next-line
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadErr("");

    if (!fileToUpload) {
      setUploadErr("Choose a file first");
      return;
    }

    try {
      setUploading(true);
      const form = new FormData();
      form.append("project", id);
      form.append("file", fileToUpload);

      await api.post("/portfolio/media/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFileToUpload(null);
      await fetchFiles();
    } catch (e) {
      console.error(e.response?.data || e.message);
      const data = e.response?.data;
      if (data && typeof data === "object") {
        const k = Object.keys(data)[0];
        setUploadErr(Array.isArray(data[k]) ? data[k][0] : String(data[k]));
      } else {
        setUploadErr("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  if (pageLoading) return <div className="project-page">Loading...</div>;
  if (err) return <div className="project-page error">{err}</div>;
  if (!project) return null;

  return (
    <div className="project-page">
      <div className="project-header">
        <h1>{project.title}</h1>
        <div className="meta">
          <span>Year {project.year}</span>
          <span>•</span>
          <span>{project.module}</span>
          {project.private ? (
            <span className="badge">Private</span>
          ) : (
            <span className="badge">Public</span>
          )}
        </div>
      </div>

      <p className="project-description">{project.description}</p>

      <div className="project-links">
        {project.url ? (
          <a href={project.url} target="_blank" rel="noreferrer">
            Project link
          </a>
        ) : null}
        {project.source_url ? (
          <a href={project.source_url} target="_blank" rel="noreferrer">
            Source link
          </a>
        ) : null}
      </div>

      <hr />

      <h2>Files</h2>

      {filesLoading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files yet.</p>
      ) : (
        <ul className="files-list">
          {files.map((f) => {
            const href = fileUrl(f.file);
            return (
              <li key={f.id} className="file-row">
                <a href={href} target="_blank" rel="noreferrer">
                  {f.original_name || `File #${f.id}`}
                </a>{" "}
                {f.file_type ? <span className="file-type">({f.file_type})</span> : null}
              </li>
            );
          })}
        </ul>
      )}

      {!loading && user?.is_staff ? (
        <>
          <hr />
          <h2>Upload file</h2>

          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
            />
            <button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>

          {uploadErr ? <div className="error">{uploadErr}</div> : null}
        </>
      ) : null}
    </div>
  );
}

export default ProjectDetail;
