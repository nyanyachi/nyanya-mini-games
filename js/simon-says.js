(function () {
  const buttons = Array.from(document.querySelectorAll("[data-simon-color]"));
  const scoreElement = document.getElementById("simon-score");
  const bestElement = document.getElementById("simon-best");
  const messageElement = document.getElementById("simon-message");
  const startButton = document.getElementById("simon-start");
  const replayButton = document.getElementById("simon-replay");

  const colors = ["green", "red", "yellow", "blue"];
  const bestScoreKey = "nyanyaSimonSaysBestScore";
  const flashDuration = 420;
  const flashPause = 180;

  let sequence = [];
  let playerIndex = 0;
  let score = 0;
  let bestScore = Number(localStorage.getItem(bestScoreKey)) || 0;
  let isPlaying = false;
  let isShowingSequence = false;
  let isPlayerInputLocked = false;

  function updateDisplay() {
    scoreElement.textContent = score;
    bestElement.textContent = bestScore;
  }

  function setButtonsDisabled(disabled) {
    buttons.forEach(function (button) {
      button.disabled = disabled;
    });
  }

  function wait(duration) {
    return new Promise(function (resolve) {
      setTimeout(resolve, duration);
    });
  }

  function getButton(color) {
    return buttons.find(function (button) {
      return button.dataset.simonColor === color;
    });
  }

  async function flashButton(color) {
    const button = getButton(color);

    if (!button) {
      return;
    }

    button.classList.add("is-active");
    await wait(flashDuration);
    button.classList.remove("is-active");
    await wait(flashPause);
  }

  function addStep() {
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
  }

  async function showSequence() {
    isShowingSequence = true;
    isPlayerInputLocked = false;
    setButtonsDisabled(true);
    messageElement.textContent = "Watch the sequence.";
    await wait(300);

    for (const color of sequence) {
      await flashButton(color);
    }

    playerIndex = 0;
    isShowingSequence = false;
    setButtonsDisabled(false);
    messageElement.textContent = "Repeat the sequence.";
  }

  function saveBestScore() {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(bestScoreKey, String(bestScore));
    }
  }

  function endGame() {
    isPlaying = false;
    isShowingSequence = false;
    isPlayerInputLocked = false;
    setButtonsDisabled(true);
    saveBestScore();
    updateDisplay();
    messageElement.textContent = "Game Over. Final score: " + score + ".";
    startButton.hidden = true;
    replayButton.hidden = false;
  }

  function startGame() {
    sequence = [];
    playerIndex = 0;
    score = 0;
    isPlaying = true;
    isPlayerInputLocked = false;
    startButton.hidden = true;
    replayButton.hidden = true;
    updateDisplay();
    addStep();
    showSequence();
  }

  async function handlePlayerInput(color) {
    if (!isPlaying || isShowingSequence || isPlayerInputLocked) {
      return;
    }

    isPlayerInputLocked = true;
    setButtonsDisabled(true);
    await flashButton(color);
    setButtonsDisabled(false);
    isPlayerInputLocked = false;

    if (color !== sequence[playerIndex]) {
      window.NyanyaSound?.error();
      endGame();
      return;
    }

    playerIndex += 1;

    if (playerIndex < sequence.length) {
      return;
    }

    score += 1;
    saveBestScore();
    updateDisplay();
    window.NyanyaSound?.success();
    messageElement.textContent = "Correct! Get ready for the next step.";
    addStep();
    showSequence();
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      handlePlayerInput(button.dataset.simonColor);
    });
  });

  startButton.addEventListener("click", startGame);
  replayButton.addEventListener("click", startGame);

  setButtonsDisabled(true);
  updateDisplay();
})();
