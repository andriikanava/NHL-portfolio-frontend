import Navbar from "../components/navbar/navbar";
import Banner from "../components/welcome-banner/banner";
import ProjectContainer from "../components/project-list/projects-list";
import CommentsSection from "../components/comment/comments";
import CommentForm from "../components/comment/comment-form";

import "./home.css"

export default function Home() {
    return (
      <>
      <Navbar />
      <main>
        <Banner />
        
        <ProjectContainer />
        <h1 class="comments-title">Comments ✉️</h1>
        <div class="comment-section">
          <CommentsSection />
          <CommentForm />
        </div>

      </main>
      </>
    )
  }
  