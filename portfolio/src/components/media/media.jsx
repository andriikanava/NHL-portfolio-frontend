import { useEffect, useState, useContext } from "react";
import "./media.css";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

function MediaContainer() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [add_btn, set_add_btn] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get("/portfolio/media/");
        setFiles(response.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    if (user && !loading) {
      set_add_btn(
        <div className="media-header">
            <a href="/upload" className="add-file-btn">+ Upload File</a>
        </div>
      );
    }
    else if (!loading && !user) {
      set_add_btn("");
    }
  }, [user, loading]);

  // ГРУППИРОВКА ФАЙЛОВ ПО ТИПУ
  const groupedFiles = files.reduce((acc, file) => {
    const type = file.file_type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(file);
    return acc;
  }, {});

  return (
    <div className="media-main">
      {add_btn}
      <div className="media-content">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div className="media-box skeleton" key={index}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div className="skeleton-line title"></div>
                <div className="skeleton-line dates"></div>
              </div>
              <div className="skeleton-line id"></div>
              <div className="skeleton-line desc long"></div>
              <div className="skeleton-line desc"></div>
              <div className="skeleton-line link"></div>
              <div className="skeleton-line link"></div>
            </div>
          ))
        ) : (

          Object.entries(groupedFiles).map(([type, files]) => (
            <div key={type} style={{ marginBottom: "40px" }}>
              <h2 style={{ marginBottom: "15px" }}>
                {type.toUpperCase()}
              </h2>
              <div className="media-flex">
                {files.map((file) => (
                  <div className="media-box" key={file.id}>
                    <img className="media-img" src={file.file} alt="content-file" />
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <h3>{file.original_name}</h3>
                    </div>
                  </div>
              ))}
              </div>
            </div>
          ))

        )}
      </div>
    </div>
  );
}

export default MediaContainer;
