(function () {
  const boardElement = document.getElementById("sliding-board");
  const movesElement = document.getElementById("sliding-moves");
  const timeElement = document.getElementById("sliding-time");
  const bestMovesElement = document.getElementById("sliding-best-moves");
  const bestTimeElement = document.getElementById("sliding-best-time");
  const messageElement = document.getElementById("sliding-message");
  const newGameButton = document.getElementById("sliding-new-game");
  const restartButton = document.getElementById("sliding-restart");

  const size = 4;
  const tileCount = size * size;
  const emptyTile = 0;
  const solvedBoard = Array.from({ length: tileCount }, function (_, index) {
    return index === tileCount - 1 ? emptyTile : index + 1;
  });
  const bestResultKey = "nyanyaSlidingPuzzleBestResult";

  let board = solvedBoard.slice();
  let initialBoard = solvedBoard.slice();
  let moves = 0;
  let elapsedSeconds = 0;
  let timerId = null;
  let started = false;
  let completed = false;
  let bestResult = loadBestResult();

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(remainingSeconds).padStart(2, "0");
  }

  function loadBestResult() {
    try {
      const saved = JSON.parse(localStorage.getItem(bestResultKey));

      if (
        saved &&
        Number.isInteger(saved.moves) &&
        Number.isInteger(saved.time) &&
        saved.moves > 0 &&
        saved.time >= 0
      ) {
        return saved;
      }
    } catch (error) {
      localStorage.removeItem(bestResultKey);
    }

    return null;
  }

  function updateBestDisplay() {
    bestMovesElement.textContent = bestResult ? bestResult.moves : "--";
    bestTimeElement.textContent = bestResult ? formatTime(bestResult.time) : "--:--";
  }

  function updateDisplay() {
    movesElement.textContent = moves;
    timeElement.textContent = formatTime(elapsedSeconds);
    updateBestDisplay();
  }

  function isSolved(currentBoard) {
    return currentBoard.every(function (value, index) {
      return value === solvedBoard[index];
    });
  }

  function getRow(index) {
    return Math.floor(index / size);
  }

  function getColumn(index) {
    return index % size;
  }

  function isAdjacent(firstIndex, secondIndex) {
    const rowDistance = Math.abs(getRow(firstIndex) - getRow(secondIndex));
    const columnDistance = Math.abs(getColumn(firstIndex) - getColumn(secondIndex));
    return rowDistance + columnDistance === 1;
  }

  function swapTiles(tileIndex, emptyIndex) {
    const nextBoard = board.slice();
    nextBoard[emptyIndex] = nextBoard[tileIndex];
    nextBoard[tileIndex] = emptyTile;
    board = nextBoard;
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    if (started) {
      return;
    }

    started = true;
    timerId = setInterval(function () {
      elapsedSeconds += 1;
      updateDisplay();
    }, 1000);
  }

  function resetRoundState() {
    stopTimer();
    moves = 0;
    elapsedSeconds = 0;
    started = false;
    completed = false;
    updateDisplay();
  }

  function saveBestResult() {
    const result = { moves: moves, time: elapsedSeconds };
    const isBetter = !bestResult || result.moves < bestResult.moves || (result.moves === bestResult.moves && result.time < bestResult.time);

    if (isBetter) {
      bestResult = result;
      localStorage.setItem(bestResultKey, JSON.stringify(bestResult));
    }
  }

  function renderBoard(movedIndex) {
    boardElement.innerHTML = "";

    board.forEach(function (value, index) {
      const cell = document.createElement("button");
      const row = getRow(index) + 1;
      const column = getColumn(index) + 1;

      cell.className = "sliding-puzzle-tile";
      cell.type = "button";
      cell.dataset.index = String(index);
      cell.setAttribute("role", "gridcell");

      if (value === emptyTile) {
        cell.classList.add("is-empty");
        cell.disabled = true;
        cell.setAttribute("aria-label", "Empty space at row " + row + ", column " + column);
      } else {
        cell.textContent = value;
        cell.setAttribute("aria-label", "Tile " + value + " at row " + row + ", column " + column);
      }

      if (movedIndex === index) {
        cell.classList.add("is-moving");
      }

      boardElement.appendChild(cell);
    });
  }

  function finishPuzzle() {
    completed = true;
    stopTimer();
    saveBestResult();
    updateDisplay();
    messageElement.textContent = "Complete! You solved the puzzle in " + moves + " moves and " + formatTime(elapsedSeconds) + ".";
    window.NyanyaSound?.success();
    renderBoard();
  }

  function moveTile(tileIndex) {
    if (completed) {
      return false;
    }

    const emptyIndex = board.indexOf(emptyTile);

    if (!isAdjacent(tileIndex, emptyIndex)) {
      return false;
    }

    startTimer();
    swapTiles(tileIndex, emptyIndex);
    moves += 1;
    window.NyanyaSound?.click();
    updateDisplay();

    if (isSolved(board)) {
      finishPuzzle();
    } else {
      messageElement.textContent = "Keep going.";
      renderBoard(emptyIndex);
    }

    return true;
  }

  function getMovableIndexes(currentBoard) {
    const emptyIndex = currentBoard.indexOf(emptyTile);
    return currentBoard.map(function (_, index) {
      return index;
    }).filter(function (index) {
      return isAdjacent(index, emptyIndex);
    });
  }

  function createShuffledBoard() {
    let shuffled = solvedBoard.slice();
    let previousEmptyIndex = -1;

    do {
      shuffled = solvedBoard.slice();
      previousEmptyIndex = -1;

      for (let step = 0; step < 180; step += 1) {
        const emptyIndex = shuffled.indexOf(emptyTile);
        let movableIndexes = getMovableIndexes(shuffled).filter(function (index) {
          return index !== previousEmptyIndex;
        });

        if (!movableIndexes.length) {
          movableIndexes = getMovableIndexes(shuffled);
        }

        const tileIndex = movableIndexes[Math.floor(Math.random() * movableIndexes.length)];
        shuffled[emptyIndex] = shuffled[tileIndex];
        shuffled[tileIndex] = emptyTile;
        previousEmptyIndex = emptyIndex;
      }
    } while (isSolved(shuffled));

    return shuffled;
  }

  function startNewGame() {
    board = createShuffledBoard();
    initialBoard = board.slice();
    resetRoundState();
    messageElement.textContent = "Puzzle shuffled. Make your first move to start the timer.";
    renderBoard();
    boardElement.focus();
  }

  function restartCurrentPuzzle() {
    board = initialBoard.slice();
    resetRoundState();
    messageElement.textContent = "Restarted this puzzle. Make your first move to start the timer.";
    renderBoard();
    boardElement.focus();
  }

  function getTileIndexForArrow(key) {
    const emptyIndex = board.indexOf(emptyTile);
    const emptyRow = getRow(emptyIndex);
    const emptyColumn = getColumn(emptyIndex);

    if (key === "ArrowUp" && emptyRow < size - 1) {
      return emptyIndex + size;
    }

    if (key === "ArrowDown" && emptyRow > 0) {
      return emptyIndex - size;
    }

    if (key === "ArrowLeft" && emptyColumn < size - 1) {
      return emptyIndex + 1;
    }

    if (key === "ArrowRight" && emptyColumn > 0) {
      return emptyIndex - 1;
    }

    return -1;
  }

  boardElement.addEventListener("click", function (event) {
    const tile = event.target.closest(".sliding-puzzle-tile");

    if (!tile || tile.classList.contains("is-empty")) {
      return;
    }

    moveTile(Number(tile.dataset.index));
  });

  boardElement.addEventListener("keydown", function (event) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const tileIndex = getTileIndexForArrow(event.key);

    if (tileIndex >= 0) {
      moveTile(tileIndex);
    }
  });

  newGameButton.addEventListener("click", startNewGame);
  restartButton.addEventListener("click", restartCurrentPuzzle);

  startNewGame();
})();
