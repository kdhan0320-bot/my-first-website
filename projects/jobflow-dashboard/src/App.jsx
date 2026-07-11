import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import KanbanPage from './pages/KanbanPage';
import ChecklistPage from './pages/ChecklistPage';
import InterviewPage from './pages/InterviewPage';
import AIPromptPage from './pages/AIPromptPage';
import SettingsPage from './pages/SettingsPage';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isGuest } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user && !isGuest) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  const { user, loading, isGuest } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user && !isGuest) return <Navigate to="/login" replace />;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/new" element={<ApplicationFormPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="applications/:id/edit" element={<ApplicationFormPage />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route path="checklist" element={<ChecklistPage />} />
        <Route path="interview" element={<InterviewPage />} />
        <Route path="ai-prompt" element={<AIPromptPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <HashRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </AuthProvider>
  </HashRouter>
);

export default App;
