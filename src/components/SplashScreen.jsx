import React, { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-200 to-amber-400 text-brown-800 z-50">
      <div className="text-4xl font-extrabold animate-pulse">Sudoku</div>
      <div className="text-sm font-medium mt-1 text-brown-700">by Mabyyy</div>
    </div>
  );
}