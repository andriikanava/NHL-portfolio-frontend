import { useEffect, useState } from "react";
import "./projects-list.css";
import api from "../../api/axios";

function ProjectContainer() {
  const [projects, setProjects] = useState([]); // must be array
  const [periodFilter, setPeriodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/portfolio/projects/");
        setProjects(response.data);
      } catch (err) {
        console.log(err.message);
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
    <div class="project-content">
         {/* ---------- FILTER UI ---------- */}
        <div className="filters" style={{ marginBottom: "20px" }}>
            <select onChange={(e) => setPeriodFilter(e.target.value)}>
            <option value="all">All periods</option>
            <option value="1">Period 1</option>
            <option value="2">Period 2</option>
            <option value="3">Period 3</option>
            <option value="4">Period 4</option>
            </select>

            <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort: Name</option>
            <option value="id">Sort: ID</option>
            <option value="week">Sort: Week</option>
            </select>
        </div>
        <div className="porject-container">
        {/* ---------- PROJECT LIST ---------- */}
        {sorted.map((project) => (
            <div className="proj-box" key={project.id}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <h3>{project.title}</h3>
                <h5 className="dates">P: {project.period}; W: {project.week}</h5>
            </div>

            <h5>id: {project.id}</h5>
            <h5>{project.description}</h5>

            <a href={project.url}>Link</a>
            <a href={project.source_url}>Source</a>
            </div>
        ))}
        </div>
    </div>
  );
}

export default ProjectContainer;
