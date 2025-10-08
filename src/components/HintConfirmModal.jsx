import React from "react";

export default function HintConfirmModal({ options = [], onConfirm }) {
  if (!Array.isArray(options) || options.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md text-center w-80">
        <h2 className="text-lg font-bold mb-3 text-orange-700">Confirm Hint</h2>
        <p className="mb-4 text-sm text-gray-700">
          Select a hint to apply to the selected cell. This will count as a move and add 30 seconds to your timer.
        </p>
        <div className="grid grid-cols-3 gap-2 text-sm italic text-orange-700 font-semibold">
          {options.map((num, idx) => (
            <button
              key={idx}
              className="px-2 py-1 bg-orange-100 rounded border border-orange-300 hover:bg-orange-200 active:bg-orange-300 transition"
              onClick={() => onConfirm(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
