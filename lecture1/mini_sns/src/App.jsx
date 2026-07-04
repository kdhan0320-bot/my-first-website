import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Meetup from './pages/Meetup';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import { ROUTES } from './constants/routes';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isGuest } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (user || isGuest) ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return !user ? children : <Navigate to={ROUTES.HOME} replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
    <Route path={ROUTES.SIGNUP} element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path={ROUTES.HOME} element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path={ROUTES.CREATE_POST} element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
    <Route path="/edit/:id" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
    <Route path={ROUTES.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path={ROUTES.MEETUP} element={<ProtectedRoute><Meetup /></ProtectedRoute>} />
    <Route path={ROUTES.CHAT} element={<ProtectedRoute><Chat /></ProtectedRoute>} />
    <Route path={ROUTES.CHAT_ROOM} element={<ProtectedRoute><Chat /></ProtectedRoute>} />
    <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
  </Routes>
);

const App = () => (
  <HashRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </HashRouter>
);

export default App;
