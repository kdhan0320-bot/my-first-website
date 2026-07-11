import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';

const NAVBAR_HEIGHT = 64;

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <HashRouter>
      <Navbar />
      <Box sx={{ height: NAVBAR_HEIGHT }} aria-hidden="true" />
      <Box component="main">
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/about"    element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
      </Box>
    </HashRouter>
  </ThemeProvider>
);

export default App;
