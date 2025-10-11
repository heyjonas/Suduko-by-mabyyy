
import React from "react";
import { FaPause } from "react-icons/fa";

export default function TopBar({
  time,
  difficulty,
  mistakes,
  maxMistakes,
  hintCount,
  maxHints,
  mistakeFlash,
  onPause
}) {
  return (
    <div className="w-full bg-orange-100 shadow-md text-sm sm:text-base px-4 py-2 rounded">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="font-semibold text-orange-700">⏱ Time: {time}</span>
          <span className="font-semibold text-orange-700">🎯 Difficulty: {difficulty}</span>
          <span className={`font-semibold ${mistakeFlash ? 'text-red-500 animate-pulse' : 'text-orange-700'}`}>
            ❤️ Mistakes: {mistakes}/{maxMistakes}
          </span>
          <span className="font-semibold text-orange-700">
            💡 Hints left: {maxHints - hintCount}/{maxHints}
          </span>
        </div>
        <button
          onClick={onPause}
          className="flex items-center gap-1 px-3 py-1 bg-orange-400 text-white rounded hover:bg-orange-500 active:bg-orange-600 transition self-start sm:self-auto"
        >
          <FaPause />
          Pause
        </button>
      </div>
    </div>
  );
}
