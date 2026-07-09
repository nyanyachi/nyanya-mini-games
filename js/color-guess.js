(function () {
  const targetColorElement = document.getElementById("target-color");
  const choicesElement = document.getElementById("color-choices");
  const scoreElement = document.getElementById("score");
  const attemptsElement = document.getElementById("total-attempts");
  const bestScoreElement = document.getElementById("best-score");
  const messageElement = document.getElementById("color-message");
  const newRoundButton = document.getElementById("new-round-button");
  const resetStatisticsButton = document.getElementById("reset-statistics-button");

  const bestScoreKey = "nyanyaColorGuessBestScore";

  let score = 0;
  let attempts = 0;
  let bestScore = Number(localStorage.getItem(bestScoreKey)) || 0;
  let targetColor = "";
  let answered = false;

  function triggerAnimation(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function createColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    return `rgb(${red}, ${green}, ${blue})`;
  }

  function shuffle(items) {
    const shuffledItems = items.slice();

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const currentItem = shuffledItems[index];
      shuffledItems[index] = shuffledItems[swapIndex];
      shuffledItems[swapIndex] = currentItem;
    }

    return shuffledItems;
  }

  function updateStats() {
    scoreElement.textContent = score;
    attemptsElement.textContent = attempts;
    bestScoreElement.textContent = bestScore ? bestScore : "--";
  }

  function saveBestScore() {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(bestScoreKey, String(bestScore));
    }
  }

  function createRound() {
    const choices = [createColor(), createColor(), createColor()];
    targetColor = choices[0];
    answered = false;
    targetColorElement.style.background = targetColor;
    choicesElement.innerHTML = "";

    shuffle(choices).forEach(function (choice) {
      const button = document.createElement("button");
      button.className = "color-choice";
      button.type = "button";
      button.dataset.color = choice;
      button.style.background = choice;
      button.setAttribute("aria-label", `Choose ${choice}`);
      choicesElement.appendChild(button);
    });

    messageElement.textContent = "Choose the matching color.";
  }

  choicesElement.addEventListener("click", function (event) {
    const choiceButton = event.target.closest(".color-choice");

    if (!choiceButton || answered) {
      return;
    }

    answered = true;
    attempts += 1;

    if (choiceButton.dataset.color === targetColor) {
      score += 1;
      messageElement.textContent = "Correct!";
      saveBestScore();
      window.NyanyaSound?.success();
      triggerAnimation(choiceButton, "animate-pulse");
    } else {
      messageElement.textContent = "Try again!";
      window.NyanyaSound?.error();
      triggerAnimation(choiceButton, "animate-shake");
    }

    updateStats();
  });

  newRoundButton.addEventListener("click", createRound);

  resetStatisticsButton.addEventListener("click", function () {
    score = 0;
    attempts = 0;
    bestScore = 0;
    localStorage.removeItem(bestScoreKey);
    updateStats();
    messageElement.textContent = "Statistics reset.";
  });

  updateStats();
  createRound();
})();
