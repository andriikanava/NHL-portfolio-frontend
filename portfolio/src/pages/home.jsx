import Navbar from "../components/navbar/navbar";
import Banner from "../components/welcome-banner/banner";
import ProjectContainer from "../components/project-list/projects-list";
import CommentsSection from "../components/comment/comments";

export default function Home() {
    return (
      <>
      <Navbar />
      <main>
        <Banner />
        
        <ProjectContainer />
        <CommentsSection />
      </main>
      </>
    )
  }
  