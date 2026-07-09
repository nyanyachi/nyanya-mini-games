(function () {
  const boardElement = document.getElementById("tic-tac-toe-board");
  const currentPlayerElement = document.getElementById("current-player");
  const messageElement = document.getElementById("tic-tac-toe-message");
  const xWinsElement = document.getElementById("x-wins");
  const oWinsElement = document.getElementById("o-wins");
  const drawsElement = document.getElementById("draws");
  const newGameButton = document.getElementById("new-game-button");
  const resetStatisticsButton = document.getElementById("reset-statistics-button");

  const statsKey = "nyanyaTicTacToeStats";
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let board = createEmptyBoard();
  let currentPlayer = "X";
  let gameOver = false;
  let stats = loadStats();
  let lastMoveIndex = -1;
  let winningCellIndexes = [];

  function createEmptyBoard() {
    return ["", "", "", "", "", "", "", "", ""];
  }

  function loadStats() {
    const savedStats = JSON.parse(localStorage.getItem(statsKey) || "null");

    if (!savedStats) {
      return {
        xWins: 0,
        oWins: 0,
        draws: 0
      };
    }

    return {
      xWins: Number(savedStats.xWins) || 0,
      oWins: Number(savedStats.oWins) || 0,
      draws: Number(savedStats.draws) || 0
    };
  }

  function saveStats() {
    localStorage.setItem(statsKey, JSON.stringify(stats));
  }

  function updateStatsDisplay() {
    xWinsElement.textContent = stats.xWins;
    oWinsElement.textContent = stats.oWins;
    drawsElement.textContent = stats.draws;
  }

  function updateTurnDisplay() {
    currentPlayerElement.textContent = currentPlayer;
  }

  function renderBoard() {
    boardElement.innerHTML = "";

    board.forEach(function (cellValue, index) {
      const cell = document.createElement("button");
      cell.className = "tic-tac-toe-cell";
      cell.type = "button";
      cell.dataset.index = String(index);
      cell.textContent = cellValue;
      cell.setAttribute("aria-label", cellValue ? `Cell ${index + 1}: ${cellValue}` : `Cell ${index + 1}: empty`);

      if (index === lastMoveIndex && cellValue) {
        cell.classList.add("is-placed");
      }

      if (winningCellIndexes.includes(index)) {
        cell.classList.add("is-winning");
      }

      if (cellValue || gameOver) {
        cell.disabled = true;
      }

      boardElement.appendChild(cell);
    });
  }

  function getWinningLine() {
    for (let i = 0; i < winningLines.length; i += 1) {
      const line = winningLines[i];
      const first = board[line[0]];

      if (first && first === board[line[1]] && first === board[line[2]]) {
        return line;
      }
    }

    return [];
  }

  function finishGame(result, winningLine) {
    gameOver = true;
    winningCellIndexes = winningLine || [];

    if (result === "X") {
      stats.xWins += 1;
      messageElement.textContent = "X wins!";
    } else if (result === "O") {
      stats.oWins += 1;
      messageElement.textContent = "O wins!";
    } else {
      stats.draws += 1;
      messageElement.textContent = "Draw!";
    }

    saveStats();
    updateStatsDisplay();
  }

  function startNewGame() {
    board = createEmptyBoard();
    currentPlayer = "X";
    gameOver = false;
    lastMoveIndex = -1;
    winningCellIndexes = [];
    messageElement.textContent = "Player X's turn.";
    updateTurnDisplay();
    renderBoard();
  }

  boardElement.addEventListener("click", function (event) {
    const cell = event.target.closest(".tic-tac-toe-cell");

    if (!cell || gameOver) {
      return;
    }

    const index = Number(cell.dataset.index);

    if (board[index]) {
      return;
    }

    board[index] = currentPlayer;
    lastMoveIndex = index;
    window.NyanyaSound?.click();

    const winningLine = getWinningLine();

    if (winningLine.length) {
      window.NyanyaSound?.success();
      finishGame(currentPlayer, winningLine);
    } else if (board.every(Boolean)) {
      finishGame("Draw", []);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      messageElement.textContent = `Player ${currentPlayer}'s turn.`;
      updateTurnDisplay();
    }

    renderBoard();
  });

  newGameButton.addEventListener("click", startNewGame);

  resetStatisticsButton.addEventListener("click", function () {
    stats = {
      xWins: 0,
      oWins: 0,
      draws: 0
    };
    localStorage.removeItem(statsKey);
    updateStatsDisplay();
    messageElement.textContent = "Statistics reset.";
  });

  updateStatsDisplay();
  updateTurnDisplay();
  renderBoard();
})();
