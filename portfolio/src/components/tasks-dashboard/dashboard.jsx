import { useEffect, useState, useContext, useMemo } from "react";
import api from "../../api/axios";
import "./dashboard.css";
import { AuthContext } from "../../context/AuthContext";

function ProjectContainer() {
  const [projects, setProjects] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const [add_btn, set_add_btn] = useState("");
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    if (user && !loading && user.is_staff) {
      set_add_btn(
        <div className="projects-header">
          <a href="/add-project" className="add-project-btn">
            + Add Project
          </a>
        </div>
      );
    } else if (!loading && !user) {
      set_add_btn("");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/portfolio/projects/");
        // DRF может отдавать list или {results: []}
        const data = Array.isArray(response.data) ? response.data : response.data?.results || [];
        setProjects(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Группировка: year → module → projects
  const grouped = useMemo(() => {
    return projects.reduce((acc, project) => {
      const year = project.year ?? 0; // 1..4
      const moduleName = project.module?.trim() || "Unsorted";

      if (!acc[year]) acc[year] = {};
      if (!acc[year][moduleName]) acc[year][moduleName] = [];

      acc[year][moduleName].push(project);
      return acc;
    }, {});
  }, [projects]);

  const SkeletonCard = ({ title }) => (
    <div className="card skeleton-card">
      <h2 className="skeleton-title">{title}</h2>
      <div className="skeleton-block period"></div>
      <div className="skeleton-block week"></div>
      <div className="skeleton-block task long"></div>
      <div className="skeleton-block task"></div>
      <div className="skeleton-block task long"></div>
    </div>
  );

  // Отображение карточки для одного года (внутри: modules → projects)
  const renderYearCard = (title, yearKey) => {
    const yearData = grouped[yearKey];

    return (
      <div className="card">
        <h2>{title}</h2>

        {!yearData && <p>No projects available</p>}

        {yearData &&
          Object.entries(yearData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([moduleName, items]) => (
              <details key={moduleName}>
                <summary>{moduleName}</summary>

                <ul>
                  {items.map((p) => (
                    <li key={p.id}>
                      <div className="project-item">
                        <h4>{p.title}</h4>
                        <h5>{p.description}</h5>
                        <a href={`/projects/${p.id}`}>Open</a>


                        {/* private badge */}
                        {p.private ? <span className="badge">Private</span> : null}

                        {/* ссылки optional */}
                        {p.url ? (
                          <a href={p.url} target="_blank" rel="noreferrer">
                            Link
                          </a>
                        ) : null}
                        {p.source_url ? (
                          <a href={p.source_url} target="_blank" rel="noreferrer">
                            Source
                          </a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
      </div>
    );
  };

  return (
    <div className="assignment-content">
      {add_btn}

      {projectsLoading ? (
        <div className="assignment-container">
          <SkeletonCard title="Year 1" />
          <SkeletonCard title="Year 2" />
          <SkeletonCard title="Year 3" />
          <SkeletonCard title="Year 4" />
        </div>
      ) : (
        <div className="assignment-container">
          {renderYearCard("Year 1", 1)}
          {renderYearCard("Year 2", 2)}
          {renderYearCard("Year 3", 3)}
          {renderYearCard("Year 4", 4)}
        </div>
      )}
    </div>
  );
}

export default ProjectContainer;
