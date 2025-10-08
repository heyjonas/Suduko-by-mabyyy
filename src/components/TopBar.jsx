import React, { useState } from "react";
import { FaPause, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function TopBar({ time, difficulty, mistakes, maxMistakes, isPaused, mistakeFlash, onPause }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="w-full bg-orange-100 shadow-md text-sm sm:text-base px-4 py-2 rounded">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sm:hidden text-orange-700 font-semibold flex items-center gap-1"
        >
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          {isCollapsed ? "Show Info" : "Hide Info"}
        </button>

        <button
          onClick={onPause}
          className="flex items-center gap-1 px-3 py-1 bg-orange-400 text-white rounded hover:bg-orange-500 active:bg-orange-600 transition"
        >
          <FaPause />
          Pause
        </button>
      </div>

      {/* Collapsible content */}
      <div className={`mt-2 ${isCollapsed ? "hidden sm:flex" : "flex"} flex-col sm:flex-row sm:items-center gap-1 sm:gap-4`}>
        <span className="font-semibold text-orange-700">⏱ Time: {time}</span>
        <span className="font-semibold text-orange-700">🎯 Difficulty: {difficulty}</span>
        <span className={`font-semibold ${mistakeFlash ? 'text-red-500 animate-pulse' : 'text-orange-700'}`}>
          ❤️ Mistakes: {mistakes}/{maxMistakes}
        </span>
      </div>
    </div>
  );
}