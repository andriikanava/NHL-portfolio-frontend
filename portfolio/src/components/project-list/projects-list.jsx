import { useEffect, useState } from "react";
import "./projects-list.css";
import api from "../../api/axios";

function ProjectContainer() {
    const [projects, setProjects] = useState("");

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
    }, [])
    console.log(projects);

    const project_boxes = [];

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];

        project_boxes.push(
            <div class="proj-box">
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <h3>{project.title}</h3>
                    <h5 class="dates">P: {project.period}; W: {project.week}</h5>
                </div>
                <h5>id: {project["id"]}</h5>
                <h5>{project["description"]}</h5>
                <a href={project['url']}>Link</a>
                <a href={project['source_url']}>Source</a>
            </div>
        )
    }

    return (
        <div class="porject-container">
            {project_boxes}
        </div>
    );
}

export default ProjectContainer;