import { FaPause } from "react-icons/fa";

export default function TopBar({
  time,
  difficulty = "easy",
  mistakes = 0,
  maxMistakes = 3,
  isPaused,
  mistakeFlash,
  onPause
}) {
  return (
    <div className="w-full flex justify-between items-center px-4 pt-1 pb-1 text-sm text-gray-700">
      <span className="font-medium">Difficulty: {difficulty}</span>
      <span className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          {Array.from({ length: maxMistakes }).map((_, i) => (
            <span
              key={i}
              className={`text-lg transition-transform duration-300 ${
                i < mistakes
                  ? `text-black ${mistakeFlash ? "animate-pulse" : ""}`
                  : "text-red-500"
              }`}
              title={i < mistakes ? "Mistake" : "Remaining life"}
            >
              {i < mistakes ? "🖤" : "❤️"}
            </span>
          ))}
        </span>
        <span>{time}</span>
        <button
          onClick={onPause}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Pause
        </button>
      </span>
    </div>
  );
}
