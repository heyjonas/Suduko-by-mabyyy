import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import DifficultySelector from "./components/DifficultySelector";
import FriendList from "./pages/FriendList";
import ProfileSettings from "./pages/ProfileSettings";
import Leaderboard from "./components/Leaderboard";
import Home from "./pages/Home";
import App from "./App";
import AuthPage from "./pages/AuthPage";
import { SessionProvider, useSession } from "./context/SessionContext";

export default function RouteWrapper() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShowSplash(false), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? (
    <div
      className={`transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <SplashScreen onFinish={() => setShowSplash(false)} />
    </div>
  ) : (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  );
}

function ProtectedRoute({ children }) {
  const { session } = useSession();
  return session ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/difficulty"
        element={
          <ProtectedRoute>
            <DifficultySelector />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}