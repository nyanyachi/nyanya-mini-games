(function () {
  const size = 4;
  const bestKey = "nyanya2048BestScore";
  const boardElement = document.getElementById("board-2048");
  const scoreElement = document.getElementById("score-2048");
  const bestElement = document.getElementById("best-2048");
  const messageElement = document.getElementById("message-2048");
  const restartButton = document.getElementById("restart-2048");
  const debugPanel = document.getElementById("debug-2048");

  let board = [];
  let score = 0;
  let bestScore = Number(localStorage.getItem(bestKey)) || 0;
  let gameOver = false;
  let won = false;
  let touchStartX = 0;
  let touchStartY = 0;

  function createEmptyBoard() {
    return Array.from({ length: size }, function () {
      return Array(size).fill(0);
    });
  }

  function getEmptyCells() {
    const cells = [];

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        if (board[row][col] === 0) {
          cells.push({ row: row, col: col });
        }
      }
    }

    return cells;
  }

  function addTile(value) {
    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0) {
      return false;
    }

    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[cell.row][cell.col] = value;
    return true;
  }

  function addRandomTile() {
    addTile(Math.random() < 0.9 ? 2 : 4);
  }

  function updateBestScore() {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(bestKey, String(bestScore));
    }
  }

  function renderBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const value = board[row][col];
        const tile = document.createElement("div");
        tile.className = "tile-2048";
        tile.setAttribute("role", "gridcell");
        tile.setAttribute("aria-label", value ? "Tile " + value : "Empty tile");

        if (value) {
          tile.textContent = value;
          tile.dataset.value = String(value);

          if (value >= 32768) {
            tile.classList.add("is-max-tile");
          }
        }

        boardElement.appendChild(tile);
      }
    }

    scoreElement.textContent = score;
    bestElement.textContent = bestScore;
  }

  function slideLine(line) {
    const values = line.filter(function (value) {
      return value !== 0;
    });
    const merged = [];
    let gained = 0;

    for (let index = 0; index < values.length; index += 1) {
      if (values[index] === values[index + 1]) {
        const mergedValue = values[index] * 2;
        merged.push(mergedValue);
        gained += mergedValue;
        index += 1;
      } else {
        merged.push(values[index]);
      }
    }

    while (merged.length < size) {
      merged.push(0);
    }

    return { line: merged, gained: gained };
  }

  function boardsMatch(first, second) {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        if (first[row][col] !== second[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  function canMove() {
    if (getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const value = board[row][col];

        if ((row < size - 1 && board[row + 1][col] === value) || (col < size - 1 && board[row][col + 1] === value)) {
          return true;
        }
      }
    }

    return false;
  }

  function checkState() {
    if (!won && board.some(function (row) { return row.includes(2048); })) {
      won = true;
      messageElement.textContent = "You reached 2048!";
      return;
    }

    if (!canMove()) {
      gameOver = true;
      messageElement.textContent = "Game Over. Restart to try again.";
    }
  }

  function move(direction) {
    if (gameOver) {
      return;
    }

    const previousBoard = board.map(function (row) {
      return row.slice();
    });
    let gainedScore = 0;
    const nextBoard = createEmptyBoard();

    for (let index = 0; index < size; index += 1) {
      let line;

      if (direction === "left" || direction === "right") {
        line = board[index].slice();

        if (direction === "right") {
          line.reverse();
        }

        const result = slideLine(line);
        gainedScore += result.gained;

        if (direction === "right") {
          result.line.reverse();
        }

        nextBoard[index] = result.line;
      } else {
        line = [];

        for (let row = 0; row < size; row += 1) {
          line.push(board[row][index]);
        }

        if (direction === "down") {
          line.reverse();
        }

        const result = slideLine(line);
        gainedScore += result.gained;

        if (direction === "down") {
          result.line.reverse();
        }

        for (let row = 0; row < size; row += 1) {
          nextBoard[row][index] = result.line[row];
        }
      }
    }

    if (boardsMatch(previousBoard, nextBoard)) {
      return;
    }

    board = nextBoard;
    score += gainedScore;
    addRandomTile();
    updateBestScore();
    messageElement.textContent = "Keep going.";
    renderBoard();
    checkState();
  }

  function startGame() {
    board = createEmptyBoard();
    score = 0;
    gameOver = false;
    won = false;
    messageElement.textContent = "Use arrow keys or swipe to start.";
    addRandomTile();
    addRandomTile();
    renderBoard();
  }

  document.addEventListener("keydown", function (event) {
    const directions = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down"
    };

    if (directions[event.key]) {
      event.preventDefault();
      move(directions[event.key]);
    }
  });

  boardElement.addEventListener("touchstart", function (event) {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  boardElement.addEventListener("touchend", function (event) {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const minSwipe = 30;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < minSwipe) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      move(deltaX > 0 ? "right" : "left");
    } else {
      move(deltaY > 0 ? "down" : "up");
    }
  }, { passive: true });

  function setBoardForDebug(nextBoard, nextScore, nextMessage) {
    board = nextBoard;
    score = nextScore;
    gameOver = false;
    won = false;
    messageElement.textContent = nextMessage;
    updateBestScore();
    renderBoard();
    checkState();
  }

  function initDebugMode() {
    if (!debugPanel || new URLSearchParams(window.location.search).get("debug") !== "true") {
      return;
    }

    debugPanel.hidden = false;

    debugPanel.querySelectorAll("[data-debug-tile]").forEach(function (button) {
      button.addEventListener("click", function () {
        const value = Number(button.dataset.debugTile);

        if (addTile(value)) {
          gameOver = false;
          won = false;
          messageElement.textContent = "Debug tile " + value + " added.";
          renderBoard();
          checkState();
        } else {
          messageElement.textContent = "Debug: no empty tile available.";
        }
      });
    });

    document.getElementById("debug-force-win-2048").addEventListener("click", function () {
      setBoardForDebug([
        [2048, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ], score, "Debug: win forced.");
    });

    document.getElementById("debug-force-game-over-2048").addEventListener("click", function () {
      board = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2]
      ];
      gameOver = false;
      won = false;
      messageElement.textContent = "Debug: game over forced.";
      renderBoard();
      checkState();
    });

    document.getElementById("debug-clear-board-2048").addEventListener("click", function () {
      board = createEmptyBoard();
      score = 0;
      gameOver = false;
      won = false;
      messageElement.textContent = "Debug: board cleared.";
      renderBoard();
    });
  }

  restartButton.addEventListener("click", startGame);
  initDebugMode();
  startGame();
})();
