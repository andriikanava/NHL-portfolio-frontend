import React, { useState } from "react";
import Navbar from "../components/navbar/navbar";
import ProjectDetail from "../components/project-detail/project-detail";
import CommentsSection from "../components/comment/comments";
import CommentForm from "../components/comment/comment-form";

import "./detail.css"

export default function ProjectPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <Navbar />
      <main>
        <ProjectDetail />
        <div className="comment-section">
          <CommentForm onCreated={() => setRefreshKey((v) => v + 1)} />
          <CommentsSection refreshKey={refreshKey} />
        </div>
      </main>
    </>
  );
}
