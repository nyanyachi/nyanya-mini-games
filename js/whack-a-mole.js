(function () {
  const DEBUG_MODE = new URLSearchParams(window.location.search).get("debug") === "true";
  const bestScoreKey = "nyanyaWhackBestScore";
  const gameDuration = 30;
  const moveIntervalMs = 700;
  const holeCount = 9;

  const scoreEl = document.getElementById("whack-score");
  const timeEl = document.getElementById("whack-time");
  const bestEl = document.getElementById("whack-best");
  const messageEl = document.getElementById("whack-message");
  const startButton = document.getElementById("whack-start");
  const playAgainButton = document.getElementById("whack-play-again");
  const holes = Array.from(document.querySelectorAll(".whack-hole"));
  const debugPanel = document.getElementById("whack-debug-panel");
  const debugStateEl = document.getElementById("whack-debug-state");
  const debugHoleEl = document.getElementById("whack-debug-hole");
  const debugScoreEl = document.getElementById("whack-debug-score");
  const debugTimeEl = document.getElementById("whack-debug-time");
  const debugHoleSelect = document.getElementById("whack-debug-hole-select");
  const debugStartButton = document.getElementById("whack-debug-start");
  const debugAddScoreButton = document.getElementById("whack-debug-add-score");
  const debugScore20Button = document.getElementById("whack-debug-score-20");
  const debugTime5Button = document.getElementById("whack-debug-time-5");
  const debugMoveButton = document.getElementById("whack-debug-move");
  const debugForceHoleButton = document.getElementById("whack-debug-force-hole");
  const debugGameOverButton = document.getElementById("whack-debug-game-over");
  const debugResetButton = document.getElementById("whack-debug-reset");
  const debugClearBestButton = document.getElementById("whack-debug-clear-best");

  let state = "Ready";
  let score = 0;
  let remainingTime = gameDuration;
  let bestScore = Number(localStorage.getItem(bestScoreKey)) || 0;
  let activeHoleIndex = -1;
  let countdownTimer = null;
  let moveTimer = null;

  function updateDisplay() {
    scoreEl.textContent = score;
    timeEl.textContent = remainingTime;
    bestEl.textContent = bestScore;
    updateDebugDisplay();
  }

  function updateDebugDisplay() {
    if (!DEBUG_MODE || !debugPanel) {
      return;
    }

    debugStateEl.textContent = state;
    debugHoleEl.textContent = activeHoleIndex >= 0 ? activeHoleIndex + 1 : "--";
    debugScoreEl.textContent = score;
    debugTimeEl.textContent = remainingTime;
  }

  function clearTimers() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    if (moveTimer) {
      clearInterval(moveTimer);
      moveTimer = null;
    }
  }

  function renderHoles() {
    holes.forEach(function (hole, index) {
      const isActive = state === "Playing" && index === activeHoleIndex;
      hole.classList.toggle("is-active", isActive);
      hole.textContent = isActive ? "Hit" : "";
      hole.setAttribute("aria-label", isActive ? "Active target in hole " + (index + 1) : "Empty hole " + (index + 1));
    });
  }

  function setState(nextState) {
    state = nextState;
    startButton.hidden = state !== "Ready";
    playAgainButton.hidden = state !== "Finished";
    updateDebugDisplay();
  }

  function setActiveHole(index) {
    activeHoleIndex = index;
    renderHoles();
    updateDebugDisplay();
  }

  function chooseRandomHole() {
    if (holeCount <= 1) {
      return 0;
    }

    let nextIndex = Math.floor(Math.random() * holeCount);

    if (nextIndex === activeHoleIndex) {
      nextIndex = (nextIndex + 1 + Math.floor(Math.random() * (holeCount - 1))) % holeCount;
    }

    return nextIndex;
  }

  function moveTarget() {
    if (state !== "Playing") {
      return;
    }

    setActiveHole(chooseRandomHole());
  }

  function saveBestScore() {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(bestScoreKey, String(bestScore));
    }
  }

  function resetToReady() {
    clearTimers();
    score = 0;
    remainingTime = gameDuration;
    activeHoleIndex = -1;
    setState("Ready");
    renderHoles();
    updateDisplay();
    messageEl.textContent = "Press Start Game when you are ready.";
  }

  function finishGame() {
    if (state === "Finished") {
      return;
    }

    clearTimers();
    remainingTime = Math.max(0, remainingTime);
    activeHoleIndex = -1;
    saveBestScore();
    setState("Finished");
    renderHoles();
    updateDisplay();
    messageEl.textContent = "Time is up. Final score: " + score + ".";
  }

  function startGame() {
    if (state === "Playing") {
      return;
    }

    clearTimers();
    score = 0;
    remainingTime = gameDuration;
    setState("Playing");
    messageEl.textContent = "Hit the active target.";
    updateDisplay();
    moveTarget();

    countdownTimer = setInterval(function () {
      remainingTime = Math.max(0, remainingTime - 1);
      updateDisplay();

      if (remainingTime <= 0) {
        finishGame();
      }
    }, 1000);

    moveTimer = setInterval(moveTarget, moveIntervalMs);
  }

  function addPoint() {
    score += 1;
    updateDisplay();
  }

  function handleHoleClick(index) {
    if (state !== "Playing" || index !== activeHoleIndex) {
      return;
    }

    addPoint();

    if (window.NyanyaSound) {
      window.NyanyaSound.click();
    }

    moveTarget();
  }

  function setupDebugMode() {
    if (!DEBUG_MODE || !debugPanel) {
      return;
    }

    debugPanel.hidden = false;
    updateDebugDisplay();

    debugStartButton.addEventListener("click", startGame);

    debugAddScoreButton.addEventListener("click", function () {
      addPoint();
    });

    debugScore20Button.addEventListener("click", function () {
      score = 20;
      updateDisplay();
    });

    debugTime5Button.addEventListener("click", function () {
      remainingTime = Math.min(5, gameDuration);
      updateDisplay();
    });

    debugMoveButton.addEventListener("click", moveTarget);

    debugForceHoleButton.addEventListener("click", function () {
      const selectedIndex = Number(debugHoleSelect.value);

      if (selectedIndex >= 0 && selectedIndex < holeCount) {
        setActiveHole(selectedIndex);
      }
    });

    debugGameOverButton.addEventListener("click", finishGame);
    debugResetButton.addEventListener("click", resetToReady);

    debugClearBestButton.addEventListener("click", function () {
      bestScore = 0;
      localStorage.removeItem(bestScoreKey);
      updateDisplay();
    });
  }

  holes.forEach(function (hole) {
    const index = Number(hole.getAttribute("data-hole"));

    hole.addEventListener("click", function () {
      handleHoleClick(index);
    });
  });

  startButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);

  resetToReady();
  setupDebugMode();
})();
