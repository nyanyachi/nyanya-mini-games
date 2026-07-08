(function () {
  const scoreElement = document.getElementById("score");
  const bestScoreElement = document.getElementById("best-score");
  const pointsPerClickElement = document.getElementById("points-per-click");
  const appleButton = document.getElementById("apple-button");
  const upgradeButton = document.getElementById("upgrade-button");
  const resetButton = document.getElementById("reset-button");
  const messageElement = document.getElementById("game-message");

  const bestScoreKey = "nyanyaAppleClickerBestScore";
  const upgradeCost = 50;

  let score = 0;
  let pointsPerClick = 1;
  let bestScore = Number(localStorage.getItem(bestScoreKey)) || 0;

  function updateDisplay() {
    scoreElement.textContent = score;
    bestScoreElement.textContent = bestScore;
    pointsPerClickElement.textContent = pointsPerClick;
    upgradeButton.disabled = score < upgradeCost;
    upgradeButton.textContent = `Upgrade: ${upgradeCost} points`;
  }

  function saveBestScore() {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(bestScoreKey, String(bestScore));
    }
  }

  appleButton.addEventListener("click", function () {
    score += pointsPerClick;
    saveBestScore();
    messageElement.textContent = `+${pointsPerClick} point${pointsPerClick === 1 ? "" : "s"}!`;
    updateDisplay();
  });

  upgradeButton.addEventListener("click", function () {
    if (score < upgradeCost) {
      messageElement.textContent = "You need 50 points for an upgrade.";
      return;
    }

    score -= upgradeCost;
    pointsPerClick += 1;
    messageElement.textContent = `Upgrade bought. Each click is now worth ${pointsPerClick} points.`;
    updateDisplay();
  });

  resetButton.addEventListener("click", function () {
    score = 0;
    pointsPerClick = 1;
    messageElement.textContent = "Current run reset. Your best score stays saved.";
    updateDisplay();
  });

  updateDisplay();
})();
