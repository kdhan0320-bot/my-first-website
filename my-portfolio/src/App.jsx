import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';

const App = () => (
  <BrowserRouter basename="/my-first-website/my-portfolio">
    <Navbar />
    <Routes>
      <Route path="/"         element={<HomePage />} />
      <Route path="/about"    element={<AboutPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
