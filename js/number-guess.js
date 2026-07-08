(function () {
  const form = document.getElementById("guess-form");
  const guessInput = document.getElementById("guess-input");
  const attemptsElement = document.getElementById("attempts");
  const bestScoreElement = document.getElementById("best-score");
  const messageElement = document.getElementById("guess-message");
  const newGameButton = document.getElementById("new-game-button");
  const resetStatisticsButton = document.getElementById("reset-statistics-button");

  const bestScoreKey = "nyanyaNumberGuessBestScore";

  let targetNumber = createTargetNumber();
  let attempts = 0;
  let bestScore = Number(localStorage.getItem(bestScoreKey)) || 0;
  let roundComplete = false;

  function createTargetNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function updateDisplay() {
    attemptsElement.textContent = attempts;
    bestScoreElement.textContent = bestScore ? bestScore : "--";
  }

  function startNewGame() {
    targetNumber = createTargetNumber();
    attempts = 0;
    roundComplete = false;
    guessInput.value = "";
    guessInput.disabled = false;
    messageElement.textContent = "Make your first guess.";
    updateDisplay();
    guessInput.focus();
  }

  function saveBestScore() {
    if (!bestScore || attempts < bestScore) {
      bestScore = attempts;
      localStorage.setItem(bestScoreKey, String(bestScore));
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (roundComplete) {
      messageElement.textContent = "Correct! Start a new game to play again.";
      return;
    }

    const guess = Number(guessInput.value);

    if (guess < 1 || guess > 100) {
      messageElement.textContent = "Enter a number between 1 and 100.";
      return;
    }

    attempts += 1;

    if (guess > targetNumber) {
      messageElement.textContent = "Too High";
    } else if (guess < targetNumber) {
      messageElement.textContent = "Too Low";
    } else {
      messageElement.textContent = "Correct!";
      roundComplete = true;
      guessInput.disabled = true;
      saveBestScore();
    }

    updateDisplay();
  });

  newGameButton.addEventListener("click", startNewGame);

  resetStatisticsButton.addEventListener("click", function () {
    bestScore = 0;
    localStorage.removeItem(bestScoreKey);
    updateDisplay();
    messageElement.textContent = "Statistics reset.";
  });

  updateDisplay();
})();
