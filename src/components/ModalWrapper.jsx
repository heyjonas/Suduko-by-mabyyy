import React from "react";

export default function ModalWrapper({ title, message, children, onOverlayClick }) {
  const handleClick = (e) => {
    // Only allow dismiss if onOverlayClick is explicitly passed
    if (e.target === e.currentTarget && typeof onOverlayClick === "function") {
      onOverlayClick();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
      onClick={handleClick}
    >
      <div className="bg-white p-6 rounded shadow-md text-center w-80 transform transition-all duration-300 scale-95 animate-scale-in">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {message && <p className="mb-4">{message}</p>}
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
}