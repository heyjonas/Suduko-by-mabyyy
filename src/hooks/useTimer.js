import { useState, useEffect, useRef } from "react";

export default function useTimer(active = true) {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (active && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [active, isPaused]);

  const reset = () => setSeconds(0);
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  const toggle = () => setIsPaused(prev => !prev);

  const minutes = Math.floor(seconds / 60);
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return { seconds, minutes, formatted, reset, setSeconds, isPaused, pause, resume, toggle };
}