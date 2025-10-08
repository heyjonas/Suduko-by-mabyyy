
import React from "react";

export default function NumberPad({ onSelect }) {
  return (
    <div className="w-full mt-4 px-4">
      <div className="flex justify-center flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className="w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base bg-orange-400 text-white rounded-md font-bold hover:bg-orange-500 active:bg-orange-600 transition"
            onClick={() => onSelect(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
