import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';

const App = () => (
  <HashRouter>
    <Navbar />
    <Routes>
      <Route path="/"         element={<HomePage />} />
      <Route path="/about"    element={<AboutPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  </HashRouter>
);

export default App;
