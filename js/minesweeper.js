(function () {
  const difficulties = {
    beginner: { label: "Beginner", rows: 9, cols: 9, mines: 10 },
    intermediate: { label: "Intermediate", rows: 16, cols: 16, mines: 40 },
    expert: { label: "Expert", rows: 16, cols: 30, mines: 99 }
  };
  const bestKey = "nyanyaMinesweeperBestTimes";
  const boardElement = document.getElementById("minesweeper-board");
  const difficultySelect = document.getElementById("minesweeper-difficulty");
  const statusElement = document.getElementById("minesweeper-status");
  const minesElement = document.getElementById("minesweeper-mines");
  const timerElement = document.getElementById("minesweeper-timer");
  const bestElement = document.getElementById("minesweeper-best");
  const restartButton = document.getElementById("minesweeper-restart");

  let difficulty = "beginner";
  let settings = difficulties[difficulty];
  let board = [];
  let state = "ready";
  let firstMove = true;
  let flags = 0;
  let revealed = 0;
  let seconds = 0;
  let timerId = null;
  let longPressId = null;
  let longPressHandled = false;
  let bestTimes = loadBestTimes();

  function loadBestTimes() {
    try {
      return JSON.parse(localStorage.getItem(bestKey)) || {};
    } catch (error) {
      return {};
    }
  }

  function saveBestTime() {
    const currentBest = bestTimes[difficulty];

    if (!currentBest || seconds < currentBest) {
      bestTimes[difficulty] = seconds;
      localStorage.setItem(bestKey, JSON.stringify(bestTimes));
    }
  }

  function formatTime(value) {
    return value ? value + "s" : "--";
  }

  function createBoard() {
    board = [];

    for (let row = 0; row < settings.rows; row += 1) {
      const boardRow = [];

      for (let col = 0; col < settings.cols; col += 1) {
        boardRow.push({ row: row, col: col, mine: false, revealed: false, flagged: false, adjacent: 0 });
      }

      board.push(boardRow);
    }
  }

  function getNeighbors(cell) {
    const neighbors = [];

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const row = cell.row + rowOffset;
        const col = cell.col + colOffset;

        if (row >= 0 && row < settings.rows && col >= 0 && col < settings.cols) {
          neighbors.push(board[row][col]);
        }
      }
    }

    return neighbors;
  }

  function placeMines(safeCell) {
    let placed = 0;

    while (placed < settings.mines) {
      const row = Math.floor(Math.random() * settings.rows);
      const col = Math.floor(Math.random() * settings.cols);
      const cell = board[row][col];

      if (cell.mine || (row === safeCell.row && col === safeCell.col)) {
        continue;
      }

      cell.mine = true;
      placed += 1;
    }

    for (let row = 0; row < settings.rows; row += 1) {
      for (let col = 0; col < settings.cols; col += 1) {
        const cell = board[row][col];
        cell.adjacent = getNeighbors(cell).filter(function (neighbor) { return neighbor.mine; }).length;
      }
    }
  }

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(function () {
      seconds += 1;
      timerElement.textContent = seconds + "s";
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function updateStats() {
    minesElement.textContent = settings.mines - flags;
    timerElement.textContent = seconds + "s";
    bestElement.textContent = formatTime(bestTimes[difficulty]);
    statusElement.textContent = state === "won" ? "You Win!" : state === "game-over" ? "Game Over" : state.charAt(0).toUpperCase() + state.slice(1);
  }

  function renderBoard() {
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = "repeat(" + settings.cols + ", 2rem)";

    for (let row = 0; row < settings.rows; row += 1) {
      for (let col = 0; col < settings.cols; col += 1) {
        const cell = board[row][col];
        const button = document.createElement("button");
        button.className = "minesweeper-cell";
        button.type = "button";
        button.dataset.row = row;
        button.dataset.col = col;
        button.setAttribute("role", "gridcell");

        if (cell.revealed) {
          button.classList.add("is-revealed");
          button.disabled = true;

          if (cell.mine) {
            button.classList.add("is-mine");
            button.textContent = "*";
            button.setAttribute("aria-label", "Mine");
          } else if (cell.adjacent > 0) {
            button.textContent = cell.adjacent;
            button.dataset.count = cell.adjacent;
            button.setAttribute("aria-label", cell.adjacent + " adjacent mines");
          } else {
            button.setAttribute("aria-label", "Empty safe cell");
          }
        } else if (cell.flagged) {
          button.classList.add("is-flagged");
          button.textContent = "F";
          button.setAttribute("aria-label", "Flagged cell");
        } else {
          button.setAttribute("aria-label", "Hidden cell");
        }

        button.addEventListener("click", function () {
          if (longPressHandled) {
            longPressHandled = false;
            return;
          }

          revealCell(cell);
        });
        button.addEventListener("contextmenu", function (event) {
          event.preventDefault();
          toggleFlag(cell);
        });
        button.addEventListener("touchstart", function () {
          longPressHandled = false;
          clearTimeout(longPressId);
          longPressId = setTimeout(function () {
            longPressHandled = true;
            toggleFlag(cell);
          }, 520);
        }, { passive: true });
        button.addEventListener("touchend", function () {
          clearTimeout(longPressId);
        });
        button.addEventListener("touchmove", function () {
          clearTimeout(longPressId);
        }, { passive: true });

        boardElement.appendChild(button);
      }
    }

    updateStats();
  }

  function revealArea(startCell) {
    const queue = [startCell];

    while (queue.length > 0) {
      const cell = queue.shift();

      if (cell.revealed || cell.flagged) {
        continue;
      }

      cell.revealed = true;
      revealed += 1;

      if (cell.adjacent === 0) {
        getNeighbors(cell).forEach(function (neighbor) {
          if (!neighbor.revealed && !neighbor.flagged && !neighbor.mine) {
            queue.push(neighbor);
          }
        });
      }
    }
  }

  function revealAllMines() {
    board.forEach(function (row) {
      row.forEach(function (cell) {
        if (cell.mine) {
          cell.revealed = true;
        }
      });
    });
  }

  function checkWin() {
    if (revealed === settings.rows * settings.cols - settings.mines) {
      state = "won";
      stopTimer();
      saveBestTime();
      renderBoard();
    }
  }

  function revealCell(cell) {
    if (state === "won" || state === "game-over" || cell.flagged || cell.revealed) {
      return;
    }

    if (firstMove) {
      placeMines(cell);
      firstMove = false;
      state = "playing";
      startTimer();
    }

    if (cell.mine) {
      cell.revealed = true;
      state = "game-over";
      stopTimer();
      revealAllMines();
      renderBoard();
      return;
    }

    revealArea(cell);
    renderBoard();
    checkWin();
  }

  function toggleFlag(cell) {
    if (state === "won" || state === "game-over" || cell.revealed) {
      return;
    }

    cell.flagged = !cell.flagged;
    flags += cell.flagged ? 1 : -1;
    renderBoard();
  }

  function resetGame() {
    stopTimer();
    settings = difficulties[difficulty];
    state = "ready";
    firstMove = true;
    flags = 0;
    revealed = 0;
    seconds = 0;
    createBoard();
    renderBoard();
  }

  difficultySelect.addEventListener("change", function () {
    difficulty = difficultySelect.value;
    resetGame();
  });

  restartButton.addEventListener("click", resetGame);
  resetGame();
})();
