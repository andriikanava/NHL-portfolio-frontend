import Navbar from "../components/navbar/navbar";
import Banner from "../components/welcome-banner/banner";
import ProjectContainer from "../components/project-list/projects-list";

export default function Home() {
    return (
      <>
      <Navbar />
      <main>
        <Banner />
        
        <ProjectContainer />
      </main>
      </>
    )
  }
  