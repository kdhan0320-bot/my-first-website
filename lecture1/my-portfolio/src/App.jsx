import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';

const NAVBAR_HEIGHT = 64;

const App = () => (
  <HashRouter>
    <Navbar />
    {/* fixed 헤더 높이만큼 공간 확보 */}
    <Box sx={{ height: NAVBAR_HEIGHT }} />
    <Routes>
      <Route path="/"         element={<HomePage />} />
      <Route path="/about"    element={<AboutPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  </HashRouter>
);

export default App;
