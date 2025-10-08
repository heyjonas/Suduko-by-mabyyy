
// sudoku.js

// Check if a number is valid in a given cell
export function isValidMove(board, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c].value === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col].value === num) return false;
  }

  // Check 3x3 box
  const startRow = 3 * Math.floor(row / 3);
  const startCol = 3 * Math.floor(col / 3);
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c].value === num) return false;
    }
  }

  return true;
}

// Recursive backtracking solver
function solveBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (let num of nums) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (solveBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Helper for solving plain number boards
function isValidPlacement(board, row, col, num) {
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  const startRow = 3 * Math.floor(row / 3);
  const startCol = 3 * Math.floor(col / 3);
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

// Generate a fully solved board
export function generateFullBoard() {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  solveBoard(board);
  return board;
}

// Remove cells to create a playable puzzle
export function removeCells(board, difficulty = "medium") {
  const puzzle = board.map(row => [...row]);
  let cellsToRemove = difficulty === "easy" ? 30 : difficulty === "hard" ? 55 : 45;
  let removed = 0;

  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }

  return puzzle;
}

// Generate a Sudoku puzzle with metadata
export function generateSudoku(difficulty = "medium") {
  const fullBoard = generateFullBoard();
  const puzzle = removeCells(fullBoard, difficulty);

  // Convert each cell to an object with value and readonly
  const boardWithMeta = puzzle.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      value: cell,
      readonly: cell !== 0,
      status: "normal", // can be 'normal', 'conflict', 'selected', etc.
      solution: fullBoard[rowIndex][colIndex], // store the solution for reference
      notes: [] // for pencil marks
    }))
  );

  return boardWithMeta;
}
