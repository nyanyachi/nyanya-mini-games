(function () {
  const diskSelect = document.getElementById("hanoi-disk-count");
  const diskCountElement = document.getElementById("hanoi-disks");
  const movesElement = document.getElementById("hanoi-moves");
  const minimumElement = document.getElementById("hanoi-minimum");
  const timeElement = document.getElementById("hanoi-time");
  const bestElement = document.getElementById("hanoi-best");
  const boardElement = document.getElementById("hanoi-board");
  const messageElement = document.getElementById("hanoi-message");
  const newGameButton = document.getElementById("hanoi-new-game");
  const restartButton = document.getElementById("hanoi-restart");
  const playAgainButton = document.getElementById("hanoi-play-again");

  const bestResultsKey = "nyanyaTowerOfHanoiBestResults";
  const pegNames = ["left", "middle", "right"];

  let diskCount = 3;
  let pegs = [];
  let selectedPeg = null;
  let moves = 0;
  let elapsedSeconds = 0;
  let timerId = null;
  let started = false;
  let completed = false;
  let bestResults = loadBestResults();

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(remainingSeconds).padStart(2, "0");
  }

  function minimumMoves(count) {
    return Math.pow(2, count) - 1;
  }

  function loadBestResults() {
    try {
      const saved = JSON.parse(localStorage.getItem(bestResultsKey));

      if (saved && typeof saved === "object") {
        return saved;
      }
    } catch (error) {
      localStorage.removeItem(bestResultsKey);
    }

    return {};
  }

  function getBestResult() {
    const best = bestResults[String(diskCount)];

    if (
      best &&
      Number.isInteger(best.moves) &&
      Number.isInteger(best.time) &&
      best.moves > 0 &&
      best.time >= 0
    ) {
      return best;
    }

    return null;
  }

  function updateBestDisplay() {
    const best = getBestResult();
    bestElement.textContent = best ? best.moves + " / " + formatTime(best.time) : "--";
  }

  function updateDisplay() {
    diskCountElement.textContent = diskCount;
    movesElement.textContent = moves;
    minimumElement.textContent = minimumMoves(diskCount);
    timeElement.textContent = formatTime(elapsedSeconds);
    updateBestDisplay();
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

  function createStartingPegs() {
    const leftPeg = [];

    for (let disk = diskCount; disk >= 1; disk -= 1) {
      leftPeg.push(disk);
    }

    return [leftPeg, [], []];
  }

  function topDisk(pegIndex) {
    const peg = pegs[pegIndex];
    return peg.length ? peg[peg.length - 1] : null;
  }

  function canMove(sourceIndex, targetIndex) {
    const movingDisk = topDisk(sourceIndex);
    const targetDisk = topDisk(targetIndex);
    return movingDisk !== null && (targetDisk === null || movingDisk < targetDisk);
  }

  function clearSelection() {
    selectedPeg = null;
    renderBoard();
  }

  function saveBestResult() {
    const currentBest = getBestResult();
    const result = { moves: moves, time: elapsedSeconds };
    const isBetter = !currentBest || result.moves < currentBest.moves || (result.moves === currentBest.moves && result.time < currentBest.time);

    if (isBetter) {
      bestResults[String(diskCount)] = result;
      localStorage.setItem(bestResultsKey, JSON.stringify(bestResults));
    }
  }

  function finishGame() {
    completed = true;
    selectedPeg = null;
    stopTimer();
    saveBestResult();
    updateDisplay();
    const perfectMessage = moves === minimumMoves(diskCount) ? " You matched the minimum move count!" : "";
    messageElement.textContent = "Complete! " + diskCount + " disks solved in " + moves + " moves, minimum " + minimumMoves(diskCount) + ", time " + formatTime(elapsedSeconds) + "." + perfectMessage;
    playAgainButton.hidden = false;
    window.NyanyaSound?.success();
    renderBoard();
  }

  function renderBoard() {
    const pegButtons = Array.from(boardElement.querySelectorAll(".hanoi-peg"));

    pegButtons.forEach(function (pegButton, pegIndex) {
      pegButton.innerHTML = "";
      pegButton.classList.toggle("is-selected", selectedPeg === pegIndex);
      pegButton.setAttribute("aria-label", "Peg " + (pegIndex + 1) + " " + pegNames[pegIndex] + ", " + pegs[pegIndex].length + " disks");

      const pegLine = document.createElement("span");
      const pegBase = document.createElement("span");
      const diskStack = document.createElement("span");

      pegLine.className = "hanoi-peg-line";
      pegBase.className = "hanoi-peg-base";
      diskStack.className = "hanoi-disk-stack";

      pegs[pegIndex].slice().reverse().forEach(function (disk) {
        const diskElement = document.createElement("span");
        diskElement.className = "hanoi-disk hanoi-disk-" + disk;
        diskElement.textContent = disk;
        diskStack.appendChild(diskElement);
      });

      pegButton.appendChild(pegLine);
      pegButton.appendChild(diskStack);
      pegButton.appendChild(pegBase);
    });
  }

  function resetGameState() {
    stopTimer();
    pegs = createStartingPegs();
    selectedPeg = null;
    moves = 0;
    elapsedSeconds = 0;
    started = false;
    completed = false;
    playAgainButton.hidden = true;
    messageElement.textContent = "Select the left peg to begin.";
    updateDisplay();
    renderBoard();
  }

  function handlePegSelection(pegIndex) {
    if (completed) {
      return;
    }

    if (selectedPeg === null) {
      if (topDisk(pegIndex) === null) {
        messageElement.textContent = "Choose a peg with a disk.";
        return;
      }

      selectedPeg = pegIndex;
      messageElement.textContent = "Selected peg " + (pegIndex + 1) + ". Choose a destination.";
      renderBoard();
      return;
    }

    if (selectedPeg === pegIndex) {
      selectedPeg = null;
      messageElement.textContent = "Selection cleared.";
      renderBoard();
      return;
    }

    if (!canMove(selectedPeg, pegIndex)) {
      messageElement.textContent = "Invalid move. A larger disk cannot go on a smaller disk.";
      return;
    }

    startTimer();
    pegs[pegIndex].push(pegs[selectedPeg].pop());
    selectedPeg = null;
    moves += 1;
    window.NyanyaSound?.click();
    updateDisplay();

    if (pegs[2].length === diskCount) {
      finishGame();
      return;
    }

    messageElement.textContent = "Move accepted.";
    renderBoard();
  }

  boardElement.addEventListener("click", function (event) {
    const pegButton = event.target.closest(".hanoi-peg");

    if (!pegButton) {
      return;
    }

    handlePegSelection(Number(pegButton.dataset.peg));
  });

  boardElement.addEventListener("keydown", function (event) {
    if (["1", "2", "3", "Escape"].indexOf(event.key) === -1) {
      return;
    }

    event.preventDefault();

    if (event.key === "Escape") {
      clearSelection();
      messageElement.textContent = "Selection cleared.";
      return;
    }

    handlePegSelection(Number(event.key) - 1);
  });

  diskSelect.addEventListener("change", function () {
    diskCount = Number(diskSelect.value);
    resetGameState();
    boardElement.focus();
  });

  newGameButton.addEventListener("click", function () {
    resetGameState();
    boardElement.focus();
  });

  restartButton.addEventListener("click", function () {
    resetGameState();
    boardElement.focus();
  });

  playAgainButton.addEventListener("click", function () {
    resetGameState();
    boardElement.focus();
  });

  resetGameState();
})();
