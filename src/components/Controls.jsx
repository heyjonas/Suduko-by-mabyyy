import React from "react";

export default function Controls({ onUndo, onErase, onHint, onToggleNotes, notesMode }) {
  return (
    <div className="flex justify-around w-full mt-4 mb-2 px-4">
      <button
        onClick={onUndo}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-semibold rounded-md"
      >
        Undo
      </button>
      <button
        onClick={onErase}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-semibold rounded-md"
      >
        Erase
      </button>
      <button
        onClick={onHint}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-semibold rounded-md"
      >
        Hint
      </button>
      <button
        onClick={onToggleNotes}
        className={`px-4 py-2 text-sm font-semibold rounded-md ${
          notesMode ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Notes
      </button>
    </div>
  );
}
// --- IGNORE ---