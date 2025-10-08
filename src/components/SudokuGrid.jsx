import React from "react";
import { isValidMove } from "../utils/sudoku";

export default function SudokuGrid({
  board,
  setBoard,
  selectedNumber,
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
  setHintTarget,
  selectedCell,
  setSelectedCell,
  pause,
  setDidWin
}) {
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
          newBoard[row][col].notes = [...notes, selectedNumber].sort((a, b) => a - b);
        }
        setBoard(newBoard);
      }
      return;
    }

    if (selectedNumber !== null) {
      newBoard[row][col].value = selectedNumber;
      newBoard[row][col].notes = [];

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

      // ✅ Check for board completion
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

  return (
    <div className="relative flex flex-col items-center">
      <div className="grid grid-cols-9 gap-[1px] bg-gray-400 p-[1px] rounded-md mt-8">
        {cleanedBoard.map((row, i) =>
          row.map((cell, j) => {
            const baseStyle = "w-10 h-10 text-center text-lg font-medium border focus:outline-none";
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
                className={`${baseStyle} ${bgColor} ${readonlyStyle} ${invalidStyle} ${animationStyle} ${highlightStyle}`}
              >
                {cell.value !== 0 ? (
                  cell.value
                ) : cell.notes && cell.notes.length > 0 ? (
                  <div className="grid grid-cols-3 gap-[1px] text-[0.6rem] text-gray-400 leading-tight">
                    {Array.from({ length: 9 }).map((_, n) => (
                      <div
                        key={n}
                        className="h-3 w-3 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (notesMode && cell.notes.includes(n + 1)) {
                            const newBoard = board.map(r => r.map(c => ({ ...c })));
                            newBoard[i][j].notes = newBoard[i][j].notes.filter(num => num !== n + 1);
                            setBoard(newBoard);
                          }
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
    </div>
  );
}