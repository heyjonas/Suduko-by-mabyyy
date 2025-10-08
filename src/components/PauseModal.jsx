import React from "react";
import ModalWrapper from "./ModalWrapper";

export default function PauseModal({ onResume, onNewGame, onGoHome }) {
  return (
    <ModalWrapper
      title="Game Paused"
      message="What would you like to do?"
      onOverlayClick={onResume}
    >
      <button
        onClick={onResume}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
      >
        Resume Game
      </button>
      <button
        onClick={onNewGame}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        New Game
      </button>
      <button
        onClick={onGoHome}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
      >
        Go to Home
      </button>
    </ModalWrapper>
  );
}
// --- IGNORE ---