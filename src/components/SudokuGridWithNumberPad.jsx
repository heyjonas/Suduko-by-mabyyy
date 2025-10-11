
import React from "react";
import { isValidMove } from "../utils/sudoku";
import NumberPad from "./NumberPad";

export default function SudokuGrid({
  board,
  setBoard,
  selectedNumber,
  setSelectedNumber,
  mistakes,
  setMistakes,
  maxMistakes,
  gameOver,
  setGameOver,
  setShowGameOverPrompt,
  mistakeFlash,
  setMistakeFlash,
  inputHistory,
  setInputHistory,
  eraseMode,
  setEraseMode,
  notesMode,
  setNotesMode,
  setHintTarget,
  selectedCell,
  setSelectedCell,
  pause,
  setDidWin,
  isPaused,
  hintCount,
  maxHints,
  hintOptions,
  setHintOptions,
  setPendingHint,
  setShowHintModal
}) {
  const MAX_NOTES = 5;

  function isGroupComplete(group) {
    const values = group.map(cell => cell.value);
    const unique = new Set(values);
    return values.every(v => v !== 0) && unique.size === 9;
  }

  function isBoardComplete(board) {
    return board.every(row =>
      row.every(cell => cell.value === cell.solution)
    );
  }

  function handleCellClick(row, col) {
    setSelectedCell({ row, col });

    const cell = board[row][col];
    if (gameOver || cell.readonly) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));

    setHintTarget({ row, col });

    if (eraseMode) {
      if (cell.value !== 0) {
        newBoard[row][col].value = 0;
        newBoard[row][col].notes = [];
        setBoard(newBoard);
        setEraseMode(false);
      }
      return;
    }

    if (notesMode) {
      if (selectedNumber !== null) {
        const notes = newBoard[row][col].notes || [];
        if (notes.includes(selectedNumber)) {
          newBoard[row][col].notes = notes.filter(n => n !== selectedNumber);
        } else {
          if (notes.length < MAX_NOTES) {
            newBoard[row][col].notes = [...notes, selectedNumber].sort((a, b) => a - b);
          }
        }
        setBoard(newBoard);
      }
      return;
    }

    if (selectedNumber !== null) {
      newBoard[row][col].value = selectedNumber;
      newBoard[row][col].notes = [];
      newBoard[row][col].hintOptions = null;

      setInputHistory([...inputHistory, { row, col }]);

      if (!isValidMove(newBoard, row, col, selectedNumber)) {
        setMistakeFlash(true);
        setTimeout(() => setMistakeFlash(false), 500);
        const newMistakeCount = mistakes + 1;
        setMistakes(newMistakeCount);
        if (newMistakeCount >= maxMistakes) {
          pause();
          setGameOver(true);
          setShowGameOverPrompt(true);
        }
      }

      const rowGroup = newBoard[row];
      const colGroup = newBoard.map(r => r[col]);
      const boxGroup = [];
      const startRow = 3 * Math.floor(row / 3);
      const startCol = 3 * Math.floor(col / 3);
      for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
          boxGroup.push(newBoard[r][c]);
        }
      }

      const markCompleted = (group) => {
        if (isGroupComplete(group)) {
          group.forEach(cell => {
            if (!cell.readonly) {
              cell.status = "completed";
              cell.completedAt = Date.now();
            }
          });
        }
      };

      markCompleted(rowGroup);
      markCompleted(colGroup);
      markCompleted(boxGroup);

      setBoard(newBoard);

      if (isBoardComplete(newBoard)) {
        pause();
        setDidWin(true);
        setGameOver(true);
        setShowGameOverPrompt(true);
      }
    }
  }

  const cleanedBoard = board.map(row =>
    row.map(cell => {
      if (cell.status === "completed" && cell.completedAt) {
        const elapsed = Date.now() - cell.completedAt;
        if (elapsed > 1500) {
          return { ...cell, status: "normal", completedAt: null };
        }
      }
      return cell;
    })
  );

  const handleClearNotes = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].notes = [];
    setBoard(newBoard);
  };

  return (
    <div className="relative flex flex-col items-center px-4 w-full overflow-x-hidden">
      <div className="grid grid-cols-9 gap-[1px] bg-gray-400 p-[1px] rounded-md mt-4 w-full max-w-[360px] sm:max-w-[320px] xs:max-w-[280px]">
        {cleanedBoard.map((row, i) =>
          row.map((cell, j) => {
            const baseStyle = "min-w-[32px] min-h-[32px] aspect-square text-center text-xs sm:text-sm md:text-base font-medium border focus:outline-none transition active:scale-95";
            const bgColor = ((Math.floor(i / 3) + Math.floor(j / 3)) % 2 === 0)
              ? "bg-white"
              : "bg-amber-50";
            const readonlyStyle = cell.readonly
              ? "text-black font-bold"
              : "text-blue-600";
            const invalidStyle = "border-gray-300";
            const animationStyle = cell.status === "completed" ? "animate-pulse bg-green-200" : "";
            const isSelected = selectedCell?.row === i && selectedCell?.col === j;
            const highlightStyle = isSelected ? "ring-2 ring-rose-600" : "";

            return (
              <button
                key={`${i}-${j}`}
                onClick={() => handleCellClick(i, j)}
                tabIndex={0}
                className={`${baseStyle} ${bgColor} ${readonlyStyle} ${invalidStyle} ${animationStyle} ${highlightStyle}`}
              >
                {cell.value !== 0 ? (
                  cell.value
                ) : cell.hintOptions ? (
                  <div className="grid grid-cols-3 gap-[2px] text-[0.5rem] italic text-orange-600 leading-tight">
                    {Array.from({ length: 9 }).map((_, n) => (
                      <div
                        key={n}
                        className="h-3 w-3 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (cell.hintOptions.includes(n + 1)) {
                            setPendingHint({ row: i, col: j, value: n + 1 });
                            setShowHintModal(true);
                          }
                        }}
                      >
                        {cell.hintOptions.includes(n + 1) ? n + 1 : ""}
                      </div>
                    ))}
                  </div>
                ) : cell.notes && cell.notes.length > 0 ? (
                  <div className="grid grid-cols-3 gap-[2px] text-[0.5rem] text-gray-400 leading-tight">
                    {Array.from({ length: 9 }).map((_, n) => (
                      <div
                        key={n}
                        className="h-3 w-3 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newBoard = board.map(r => r.map(c => ({ ...c })));
                          const notes = newBoard[i][j].notes || [];
                          if (notes.includes(n + 1)) {
                            newBoard[i][j].notes = notes.filter(num => num !== n + 1);
                          } else if (notes.length < 5) {
                            newBoard[i][j].notes = [...notes, n + 1].sort((a, b) => a - b);
                          }
                          setBoard(newBoard);
                        }}
                      >
                        {cell.notes.includes(n + 1) ? n + 1 : ""}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs sm:text-sm">
        <button
          onClick={() => setNotesMode(!notesMode)}
          className={`px-2 py-1 rounded font-semibold ${notesMode ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-300 text-gray-700'}`}
        >
          {notesMode ? '📝 Notes Mode ON' : 'Notes Mode OFF'}
        </button>
        {notesMode && selectedCell && (
          <button
            onClick={handleClearNotes}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Clear Notes
          </button>
        )}
      </div>

      {!gameOver && !isPaused && (
        <div className="mt-4 w-full">
          <NumberPad onSelect={setSelectedNumber} />
        </div>
      )}
    </div>
  );
}
