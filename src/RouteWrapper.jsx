import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import DifficultySelector from "./components/DifficultySelector";
import Login from "./pages/Login";
import FriendList from "./pages/FriendList";
import Signup from "./pages/Signup";
import ProfileSettings from "./pages/ProfileSettings";
import Leaderboard from "./components/Leaderboard";
import Home from "./pages/Home";
import App from "./App";
import { SessionProvider } from "./context/SessionContext";

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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/friends" element={<FriendList />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/" element={<Home />} />
      <Route path="/difficulty" element={<DifficultySelector />} />
      <Route path="/game" element={<App />} />
    </Routes>
  );
}