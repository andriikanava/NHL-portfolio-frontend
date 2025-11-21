import { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import "./dashboard.css"; // сюда помести твой CSS
import { AuthContext } from "../../context/AuthContext";

function ProjectContainer() {
  const [projects, setProjects] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const [add_btn, set_add_btn] = useState("");

  useEffect(() => {
    if (user && !loading) {
      set_add_btn(
        <div className="projects-header">
            <a href="/add-project" className="add-project-btn">+ Add Project</a>
        </div>
      );
    }
    else if (!loading && !user) {
      set_add_btn("");
    }
  }, [user, loading]);

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

  // Группировка: category → period → week → tasks
  const grouped = projects.reduce((acc, project) => {
    const category = project.category || "Weekly";  // твой API должен отдавать category
    const period = project.period || 0;
    const week = project.week || 0;

    if (!acc[category]) acc[category] = {};
    if (!acc[category][period]) acc[category][period] = {};
    if (!acc[category][period][week]) acc[category][period][week] = [];

    acc[category][period][week].push(project);
    return acc;
  }, {});

  // функция для отображения карточки
  const renderCard = (title, categoryKey) => {
    const category = grouped[categoryKey];

    return (
      <div className="card">
        <h2>{title}</h2>

        {!category && <p>No assignments available</p>}

        {category &&
          Object.entries(category).map(([period, weeks]) => (
            <details key={period}>
              <summary>Period {period}</summary>

              {/* Weeks */}
              {Object.entries(weeks).map(([week, tasks]) => (
                <details key={week} style={{ paddingLeft: "12px" }}>
                  <summary>Week {week}</summary>
                  <ul>
                    {tasks.map((task) => (
                      <li key={task.id}>
                        <div className="project-item">
                          <h4>{task.title}</h4>
                          <h5>{task.description}</h5>
                          <a href={task.url}>Link</a>
                          <a href={task.source_url}>Source</a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </details>
          ))}
      </div>
    );
  };

  return (
    <>
    <div className="assignment-content">
        {add_btn}
        <div className="assignment-container">
          {renderCard("Weekly Assignments", "Weekly")}
          {renderCard("Portfolio Assignments", "Portfolio")}
          {renderCard("Extra Assignments", "Extra")}
        </div>
      </div>
    </>
  );
}

export default ProjectContainer;
