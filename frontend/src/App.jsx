import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chats from './pages/Chats';
import Groups from './pages/Groups';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useAuth } from './hooks/useAuth';
import { SocketProvider } from './context/SocketContext.jsx';
import AppLoader from './components/ui/AppLoader.jsx';

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SocketProvider>
      <div className="app-shell">
        <Sidebar />
        {children}
      </div>
    </SocketProvider>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <Home />
          </ProtectedLayout>
        }
      />
      <Route
        path="/chats"
        element={
          <ProtectedLayout>
            <Chats />
          </ProtectedLayout>
        }
      />
      <Route
        path="/groups"
        element={
          <ProtectedLayout>
            <Groups />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <Settings />
          </ProtectedLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
