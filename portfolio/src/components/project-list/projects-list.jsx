import { useEffect, useState } from "react";
import "./projects-list.css";
import api from "../../api/axios";

function ProjectContainer() {
  const [projects, setProjects] = useState([]); // must be array
  const [periodFilter, setPeriodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/portfolio/projects/");
        setProjects(response.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false); 
      }
    };
    fetchProjects();
  }, []);
  

  // ------- FILTER -------
  const filtered = projects.filter((p) => {
    if (periodFilter === "all") return true;
    return p.period === Number(periodFilter);
  });

  // ------- SORT -------
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "id":
        return a.id - b.id;
      case "week":
        return a.week - b.week;
      default:
        return 0;
    }
  });

  

  return (
    <div className="project-content">
         {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
                <div className="proj-box skeleton" key={index}>
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
            projects.map((project) => (
                <div className="proj-box" key={project.id}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <h3>{project.title}</h3>
                        <h5 className="dates">
                            P: {project.period}; W: {project.week}
                        </h5>
                    </div>

                    <h5>id: {project.id}</h5>
                    <h5>{project.description}</h5>

                    <a href={project.url}>Link</a>
                    <a href={project.source_url}>Source</a>
                </div>
            ))
        )}

    </div>
  );
}

export default ProjectContainer;
