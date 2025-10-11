
import React from "react";

export default function NumberPad({ onSelect }) {
  return (
    <div className="grid grid-cols-9 gap-1 w-full max-w-[360px] sm:max-w-[320px] xs:max-w-[280px] mx-auto">
      {Array.from({ length: 9 }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onSelect(i + 1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded text-xs sm:text-sm md:text-base"
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
