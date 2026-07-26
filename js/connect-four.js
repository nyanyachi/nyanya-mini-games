(function () {
  const boardElement = document.getElementById("connect-four-board");
  const turnElement = document.getElementById("connect-four-turn");
  const statusElement = document.getElementById("connect-four-status");
  const messageElement = document.getElementById("connect-four-message");
  const restartButton = document.getElementById("connect-four-restart");

  const rows = 6;
  const columns = 7;
  const players = {
    red: "Red",
    yellow: "Yellow"
  };

  let board = [];
  let currentPlayer = "red";
  let gameOver = false;

  function createEmptyBoard() {
    return Array.from({ length: rows }, function () {
      return Array(columns).fill("");
    });
  }

  function updateStatus(text) {
    turnElement.textContent = gameOver ? "--" : players[currentPlayer];
    statusElement.textContent = text;
  }

  function renderBoard(lastMove) {
    boardElement.innerHTML = "";

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const cell = document.createElement("button");
        const value = board[row][column];

        cell.className = "connect-four-cell";
        cell.type = "button";
        cell.dataset.column = String(column);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", "Column " + (column + 1) + ", row " + (row + 1));

        if (value) {
          cell.classList.add("is-" + value);
          cell.setAttribute("aria-label", players[value] + " piece in column " + (column + 1) + ", row " + (row + 1));
        }

        if (lastMove && lastMove.row === row && lastMove.column === column) {
          cell.classList.add("is-dropping");
        }

        if (gameOver || board[0][column]) {
          cell.disabled = true;
        }

        boardElement.appendChild(cell);
      }
    }
  }

  function getOpenRow(column) {
    for (let row = rows - 1; row >= 0; row -= 1) {
      if (!board[row][column]) {
        return row;
      }
    }

    return -1;
  }

  function countDirection(row, column, rowStep, columnStep, player) {
    let count = 0;
    let currentRow = row + rowStep;
    let currentColumn = column + columnStep;

    while (
      currentRow >= 0 &&
      currentRow < rows &&
      currentColumn >= 0 &&
      currentColumn < columns &&
      board[currentRow][currentColumn] === player
    ) {
      count += 1;
      currentRow += rowStep;
      currentColumn += columnStep;
    }

    return count;
  }

  function hasWinner(row, column, player) {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1]
    ];

    return directions.some(function (direction) {
      const total = 1 +
        countDirection(row, column, direction[0], direction[1], player) +
        countDirection(row, column, -direction[0], -direction[1], player);

      return total >= 4;
    });
  }

  function isDraw() {
    return board[0].every(Boolean);
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === "red" ? "yellow" : "red";
  }

  function playColumn(column) {
    if (gameOver) {
      return;
    }

    const row = getOpenRow(column);

    if (row === -1) {
      messageElement.textContent = "That column is full. Choose another column.";
      return;
    }

    board[row][column] = currentPlayer;
    window.NyanyaSound?.click();

    if (hasWinner(row, column, currentPlayer)) {
      gameOver = true;
      messageElement.textContent = players[currentPlayer] + " wins!";
      updateStatus(players[currentPlayer] + " wins");
      renderBoard({ row: row, column: column });
      window.NyanyaSound?.success();
      return;
    }

    if (isDraw()) {
      gameOver = true;
      messageElement.textContent = "Draw. The board is full.";
      updateStatus("Draw");
      renderBoard({ row: row, column: column });
      return;
    }

    switchPlayer();
    messageElement.textContent = players[currentPlayer] + " turn. Choose a column.";
    updateStatus("Playing");
    renderBoard({ row: row, column: column });
  }

  function restartGame() {
    board = createEmptyBoard();
    currentPlayer = "red";
    gameOver = false;
    messageElement.textContent = "Red starts. Choose a column.";
    updateStatus("Playing");
    renderBoard();
  }

  boardElement.addEventListener("click", function (event) {
    const cell = event.target.closest(".connect-four-cell");

    if (!cell) {
      return;
    }

    playColumn(Number(cell.dataset.column));
  });

  restartButton.addEventListener("click", restartGame);

  restartGame();
})();
