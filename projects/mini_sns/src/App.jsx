import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { DemoDataProvider } from "./context/DemoDataContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Meetup from "./pages/Meetup";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import { ROUTES } from "./constants/routes";

const ProtectedRoute = ({ children }) => {
  const { isGuest } = useAuth();
  return isGuest ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

const PublicRoute = ({ children }) => {
  const { isGuest } = useAuth();
  return !isGuest ? children : <Navigate to={ROUTES.HOME} replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path={ROUTES.LOGIN}
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route path="/signup" element={<Navigate to={ROUTES.LOGIN} replace />} />
    <Route
      path={ROUTES.HOME}
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.CREATE_POST}
      element={
        <ProtectedRoute>
          <CreatePost />
        </ProtectedRoute>
      }
    />
    <Route
      path="/edit/:id"
      element={
        <ProtectedRoute>
          <CreatePost />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.PROFILE}
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.MEETUP}
      element={
        <ProtectedRoute>
          <Meetup />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.CHAT}
      element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.CHAT_ROOM}
      element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.NOTIFICATIONS}
      element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
  </Routes>
);

const App = () => (
  <HashRouter>
    <AuthProvider>
      <DemoDataProvider>
        <AppRoutes />
      </DemoDataProvider>
    </AuthProvider>
  </HashRouter>
);

export default App;
