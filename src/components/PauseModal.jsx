import React from "react";
import ModalWrapper from "./ModalWrapper";

export default function PauseModal({ onResume, onNewGame, onGoHome }) {
  return (
    <ModalWrapper
      title="⏸ Game Paused"
      message="What would you like to do?"
      onOverlayClick={onResume}
    >
      <button
        onClick={onResume}
        className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 active:bg-orange-600 transition-colors duration-200"
      >
        Resume Game
      </button>
      <button
        onClick={onNewGame}
        className="px-4 py-2 bg-orange-300 text-orange-900 rounded hover:bg-orange-400 active:bg-orange-500 transition-colors duration-200"
      >
        New Game
      </button>
      <button
        onClick={onGoHome}
        className="px-4 py-2 bg-orange-200 text-orange-800 rounded hover:bg-orange-300 active:bg-orange-400 transition-colors duration-200"
      >
        Go to Home
      </button>
    </ModalWrapper>
  );
}