import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DifficultySelector() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50); // slight delay to trigger transition
    return () => clearTimeout(timer);
  }, []);

  const startGame = (level) => {
    navigate(`/game?difficulty=${level}`);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 transition-opacity duration-700 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-amber-600">🧠 Sudoku</h1>
      <p className="mb-4 text-gray-700">Select Difficulty</p>
      <div className="flex gap-4">
        {["Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() => startGame(level)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}