import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SessionContext } from './context/SessionContext';
import { submitScore } from "./services/leaderboardService";
import SudokuGrid from "./components/SudokuGridWithNumberPad";
import Controls from "./components/Controls";
import NumberPad from "./components/NumberPad";
import TopBar from "./components/TopBar";
import SplashScreen from "./components/SplashScreen";
import PauseModal from "./components/PauseModal";
import ModalWrapper from "./components/ModalWrapper";
import HintConfirmModal from "./components/HintConfirmModal";
import { generateSudoku } from "./utils/sudoku";
import useTimer from "./hooks/useTimer";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import Confetti from "react-confetti";

const maxMistakes = 3;
const maxHints = 3;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useContext(SessionContext);

  const [showSplash, setShowSplash] = useState(true);
  const [board, setBoard] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverPrompt, setShowGameOverPrompt] = useState(false);
  const [mistakeFlash, setMistakeFlash] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const [inputHistory, setInputHistory] = useState([]);
  const [eraseMode, setEraseMode] = useState(false);
  const [hintTarget, setHintTarget] = useState(null);
  const [hintOptions, setHintOptions] = useState([]);
  const [hintCount, setHintCount] = useState(0);
  const [showPausePrompt, setShowPausePrompt] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [didWin, setDidWin] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [pendingHint, setPendingHint] = useState(null);

  const {
    formatted,
    toggle,
    isPaused,
    pause,
    resume,
    reset,
    setSeconds
  } = useTimer(!showSplash);

  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get("difficulty") || "medium";

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session]);

  useEffect(() => {
    if (!showSplash) generateNewGame();
  }, [showSplash]);

  useEffect(() => {
    if (gameOver && session) {
      const timeParts = formatted.split(':').map(Number);
      const timeInSeconds = timeParts.length === 3
        ? timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
        : timeParts[0] * 60 + timeParts[1];

      const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
      const accuracyBonus = mistakes === 0 ? 1 : mistakes === 1 ? 0.9 : mistakes === 2 ? 0.8 : 0.7;
      const hintPenalty = hintCount * 30;

      const baseScore = 1000 - timeInSeconds;
      const calculatedScore = Math.max(0, Math.floor(baseScore * difficultyMultiplier * accuracyBonus - hintPenalty));
      setFinalScore(calculatedScore);
      setScoreBreakdown({
        timeInSeconds,
        difficultyMultiplier,
        accuracyBonus,
        hintPenalty,
        baseScore,
        calculatedScore
      });

      submitScore(calculatedScore, difficulty, {
        baseScore,
        timeInSeconds,
        difficultyMultiplier,
        accuracyBonus,
        hintPenalty
      }).catch(err => {
        console.error("Error submitting score:", err);
      });
    }
  }, [gameOver, session, formatted, difficulty, mistakes, hintCount]);

  const generateNewGame = () => {
    const newBoard = generateSudoku(difficulty);
    setBoard(newBoard);
    setSelectedNumber(null);
    setMistakes(0);
    setGameOver(false);
    setShowGameOverPrompt(false);
    setHintCount(0);
    setHintOptions([]);
    setSelectedCell(null);
  };

  const handlePause = () => {
    pause();
    setShowPausePrompt(true);
  };

  const handleResume = () => {
    resume();
    setShowPausePrompt(false);
  };

  const handleUndo = () => {
    if (inputHistory.length === 0) return;
    const lastInput = inputHistory[inputHistory.length - 1];
    const { row, col } = lastInput;
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].value = 0;
    setBoard(newBoard);
    setInputHistory(inputHistory.slice(0, -1));
  };

  const handleErase = () => {
    setEraseMode(true);
  };

  const handleHint = () => {
    if (!hintTarget || hintCount >= maxHints) return;

    const { row, col } = hintTarget;
    const cell = board[row][col];
    if (cell.readonly || cell.value !== 0) return;

    const correct = cell.solution;
    const options = [correct];
    while (options.length < 3) {
      const rand = Math.ceil(Math.random() * 9);
      if (!options.includes(rand)) options.push(rand);
    }
    const shuffled = options.sort(() => Math.random() - 0.5);

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].hintOptions = shuffled;
    setBoard(newBoard);
  };

  const confirmHint = (row, col, value) => {
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].value = value;
    newBoard[row][col].notes = [];
    delete newBoard[row][col].hintOptions;
    setBoard(newBoard);
    setInputHistory([...inputHistory, { row, col }]);
    setHintOptions([]);
    setHintCount(prev => prev + 1);
    setSeconds(prev => prev + 30);
    setShowHintModal(false);
    setPendingHint(null);
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen pt-2 pb-1 px-2 bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50 text-center py-3">
        <TopBar
          time={formatted}
          difficulty={difficulty}
          mistakes={mistakes}
          maxMistakes={maxMistakes}
          isPaused={isPaused}
          mistakeFlash={mistakeFlash}
          onPause={handlePause}
        />
      </div>

      {showPausePrompt && (
        <PauseModal
          onResume={handleResume}
          onNewGame={() => {
            generateNewGame();
            reset();
            setShowPausePrompt(false);
          }}
          onGoHome={() => navigate("/")}
        />
      )}

      {showGameOverPrompt && (
        <div className={`transition-all ${didWin ? 'animate-pulse bg-yellow-100 border-4 border-yellow-400 rounded-lg p-2' : ''}`}>
          {didWin && <Confetti />}
          <ModalWrapper
            title={didWin ? "🎉 You Win!" : "Game Over"}
            message={
              `${didWin ? "🎉 You Win!" : "You've made 3 mistakes."}
Final Time: ${formatted}
Score: ${finalScore}

Breakdown:
- Base Score: ${scoreBreakdown?.baseScore}
- Difficulty Multiplier: ${scoreBreakdown?.difficultyMultiplier}
- Accuracy Bonus: ${scoreBreakdown?.accuracyBonus}
- Hint Penalty: ${scoreBreakdown?.hintPenalty}
- Final Score: ${scoreBreakdown?.calculatedScore}

Would you like to start a new game or go to Home?`
            }
          >
            <button
              onClick={generateNewGame}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
            >
              New Game
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate("/leaderboard")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 mt-2"
            >
              View Leaderboard
            </button>
          </ModalWrapper>
        </div>
      )}

      {showHintModal && pendingHint && (
        <HintConfirmModal
          options={[pendingHint.value]}
          onConfirm={() => confirmHint(pendingHint.row, pendingHint.col, pendingHint.value)}
        />
      )}

      <div className="relative w-full max-w-md mx-auto">
        <SudokuGrid
          board={board}
          setBoard={setBoard}
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
          mistakes={mistakes}
          setMistakes={setMistakes}
          maxMistakes={maxMistakes}
          gameOver={gameOver}
          setGameOver={setGameOver}
          setShowGameOverPrompt={setShowGameOverPrompt}
          mistakeFlash={mistakeFlash}
          setMistakeFlash={setMistakeFlash}
          inputHistory={inputHistory}
          setInputHistory={setInputHistory}
          eraseMode={eraseMode}
          setEraseMode={setEraseMode}
          notesMode={notesMode}
          setNotesMode={setNotesMode}
          setHintTarget={setHintTarget}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          pause={pause}
          setDidWin={setDidWin}
          isPaused={isPaused}
          hintCount={hintCount}
          maxHints={maxHints}
          hintOptions={hintOptions}
          setHintOptions={setHintOptions}
          setPendingHint={setPendingHint}
          setShowHintModal={setShowHintModal}
        />
      </div>

      <Controls
        onUndo={handleUndo}
        onErase={handleErase}
        onHint={handleHint}
        onToggleNotes={() => setNotesMode(!notesMode)}
        notesMode={notesMode}
      />
    </main>
  );
}
