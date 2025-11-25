import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Home from "./pages/home";
import Register from "./pages/register";
import Projects from "./pages/project";
import Login from "./pages/login";
import ProfilePage from "./pages/profile";
import ProjectFormPage from "./pages/project-form";
import MediaPage from "./pages/media";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-project" element={<ProjectFormPage />} />
          <Route path="/media" element={<MediaPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
