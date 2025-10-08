import React from "react";

export default function Controls({ onUndo, onErase, onHint, onToggleNotes, notesMode }) {
  return (
    <div className="flex justify-around w-full mt-4 mb-2 px-4">
      <button
        onClick={onUndo}
        className="px-4 py-2 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white text-sm font-semibold rounded-md transition"
      >
        Undo
      </button>
      <button
        onClick={onErase}
        className="px-4 py-2 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white text-sm font-semibold rounded-md transition"
      >
        Erase
      </button>
      <button
        onClick={onHint}
        className="px-4 py-2 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white text-sm font-semibold rounded-md transition"
      >
        Hint
      </button>
      <button
        onClick={onToggleNotes}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
          notesMode
            ? "bg-orange-600 text-white"
            : "bg-orange-200 hover:bg-orange-300 text-orange-800"
        }`}
      >
        Notes
      </button>
    </div>
  );
}
