(function () {
  const gridSize = 16;
  const tickSpeed = 140;
  const bestKey = "nyanyaSnakeBestScore";
  const boardElement = document.getElementById("snake-board");
  const scoreElement = document.getElementById("snake-score");
  const bestElement = document.getElementById("snake-best");
  const lengthElement = document.getElementById("snake-length");
  const messageElement = document.getElementById("snake-message");
  const restartButton = document.getElementById("snake-restart");
  const countdownElement = document.getElementById("snake-countdown");

  let snake = [];
  let food = null;
  let direction = "right";
  let nextDirection = "right";
  let score = 0;
  let bestScore = Number(localStorage.getItem(bestKey)) || 0;
  let timerId = null;
  let countdownId = null;
  let isGameOver = false;
  let isRunning = false;
  let isCountingDown = false;
  let touchStartX = 0;
  let touchStartY = 0;

  function sameCell(first, second) {
    return first.row === second.row && first.col === second.col;
  }

  function isOpposite(first, second) {
    return (first === "up" && second === "down") ||
      (first === "down" && second === "up") ||
      (first === "left" && second === "right") ||
      (first === "right" && second === "left");
  }

  function setDirection(newDirection) {
    if (!isRunning) {
      return;
    }

    if (!isOpposite(newDirection, direction)) {
      nextDirection = newDirection;
    }
  }

  function getEmptyCells() {
    const cells = [];

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const cell = { row: row, col: col };

        if (!snake.some(function (part) { return sameCell(part, cell); })) {
          cells.push(cell);
        }
      }
    }

    return cells;
  }

  function spawnFood() {
    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0) {
      food = null;
      return;
    }

    food = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  function updateBestScore() {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(bestKey, String(bestScore));
    }
  }

  function hideCountdown() {
    countdownElement.textContent = "";
    countdownElement.hidden = true;
    countdownElement.style.display = "";
    countdownElement.style.visibility = "";
    countdownElement.style.opacity = "";
    countdownElement.style.pointerEvents = "none";
  }

  function renderBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const cell = document.createElement("div");
        const position = { row: row, col: col };
        const snakeIndex = snake.findIndex(function (part) { return sameCell(part, position); });

        cell.className = "snake-cell";
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", "Empty cell");

        if (snakeIndex !== -1) {
          cell.classList.add("is-snake");
          cell.setAttribute("aria-label", snakeIndex === 0 ? "Snake head" : "Snake body");

          if (snakeIndex === 0) {
            cell.classList.add("is-head");
          }
        }

        if (food && sameCell(food, position)) {
          cell.classList.add("is-food");
          cell.setAttribute("aria-label", "Food");
        }

        boardElement.appendChild(cell);
      }
    }

    scoreElement.textContent = score;
    bestElement.textContent = bestScore;
    lengthElement.textContent = snake.length;
  }

  function getNextHead() {
    const head = snake[0];
    const nextHead = { row: head.row, col: head.col };

    if (nextDirection === "up") {
      nextHead.row -= 1;
    } else if (nextDirection === "down") {
      nextHead.row += 1;
    } else if (nextDirection === "left") {
      nextHead.col -= 1;
    } else if (nextDirection === "right") {
      nextHead.col += 1;
    }

    return nextHead;
  }

  function endGame() {
    isGameOver = true;
    isRunning = false;
    clearInterval(timerId);
    timerId = null;
    updateBestScore();
    renderBoard();
    restartButton.hidden = false;
    restartButton.disabled = false;
    restartButton.textContent = "Play Again";
    messageElement.textContent = "Game Over. Press Play Again to try again.";
  }

  function moveSnake() {
    if (isGameOver) {
      return;
    }

    const nextHead = getNextHead();
    const hitWall = nextHead.row < 0 || nextHead.row >= gridSize || nextHead.col < 0 || nextHead.col >= gridSize;

    if (hitWall) {
      endGame();
      return;
    }

    const willEat = food && sameCell(nextHead, food);
    const bodyToCheck = willEat ? snake : snake.slice(0, -1);
    const hitSelf = bodyToCheck.some(function (part) {
      return sameCell(part, nextHead);
    });

    if (hitSelf) {
      endGame();
      return;
    }

    direction = nextDirection;
    snake.unshift(nextHead);

    if (willEat) {
      score += 1;
      updateBestScore();
      spawnFood();
      messageElement.textContent = "Food collected. Keep going.";
    } else {
      snake.pop();
    }

    renderBoard();
  }

  function resetCurrentGame(message) {
    clearInterval(timerId);
    clearInterval(countdownId);
    timerId = null;
    countdownId = null;
    snake = [
      { row: 8, col: 8 },
      { row: 8, col: 7 },
      { row: 8, col: 6 }
    ];
    food = null;
    direction = "right";
    nextDirection = "right";
    score = 0;
    isGameOver = false;
    isRunning = false;
    isCountingDown = false;
    hideCountdown();
    messageElement.textContent = message;
    spawnFood();
    renderBoard();
  }

  function beginMovement() {
    isRunning = true;
    isCountingDown = false;
    hideCountdown();
    messageElement.textContent = "Use arrow keys, WASD, or swipe to steer.";
    timerId = setInterval(moveSnake, tickSpeed);
  }

  function startCountdown() {
    if (isCountingDown) {
      return;
    }

    resetCurrentGame("Starting soon...");
    isCountingDown = true;
    restartButton.disabled = true;
    restartButton.hidden = true;
    countdownElement.style.pointerEvents = "auto";
    countdownElement.hidden = false;
    countdownElement.textContent = "3";

    let count = 3;
    countdownId = setInterval(function () {
      count -= 1;

      if (count > 0) {
        countdownElement.textContent = count;
        return;
      }

      clearInterval(countdownId);
      countdownId = null;
      beginMovement();
    }, 1000);
  }

  function prepareInitialBoard() {
    resetCurrentGame("Press Start Game when you are ready.");
    restartButton.hidden = false;
    restartButton.disabled = false;
    restartButton.textContent = "Start Game";
  }

  document.addEventListener("keydown", function (event) {
    const directions = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      W: "up",
      s: "down",
      S: "down",
      a: "left",
      A: "left",
      d: "right",
      D: "right"
    };

    if (directions[event.key]) {
      event.preventDefault();
      setDirection(directions[event.key]);
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
      setDirection(deltaX > 0 ? "right" : "left");
    } else {
      setDirection(deltaY > 0 ? "down" : "up");
    }
  }, { passive: true });

  restartButton.addEventListener("click", startCountdown);
  prepareInitialBoard();
})();
