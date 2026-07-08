(function () {
  const choiceButtons = document.querySelectorAll("[data-choice]");
  const winsElement = document.getElementById("wins");
  const lossesElement = document.getElementById("losses");
  const drawsElement = document.getElementById("draws");
  const roundMessageElement = document.getElementById("round-message");
  const choiceMessageElement = document.getElementById("choice-message");
  const resetButton = document.getElementById("reset-statistics-button");

  const storageKey = "nyanyaRockPaperScissorsStats";
  const choices = ["rock", "paper", "scissors"];
  const winningMoves = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
  };

  let stats = loadStats();

  function loadStats() {
    let savedStats = {};

    try {
      savedStats = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (error) {
      savedStats = {};
    }

    return {
      wins: Number(savedStats.wins) || 0,
      losses: Number(savedStats.losses) || 0,
      draws: Number(savedStats.draws) || 0
    };
  }

  function saveStats() {
    localStorage.setItem(storageKey, JSON.stringify(stats));
  }

  function updateDisplay() {
    winsElement.textContent = stats.wins;
    lossesElement.textContent = stats.losses;
    drawsElement.textContent = stats.draws;
  }

  function formatChoice(choice) {
    return choice.charAt(0).toUpperCase() + choice.slice(1);
  }

  function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    let result = "Draw";

    if (playerChoice === computerChoice) {
      stats.draws += 1;
    } else if (winningMoves[playerChoice] === computerChoice) {
      stats.wins += 1;
      result = "Win";
    } else {
      stats.losses += 1;
      result = "Lose";
    }

    saveStats();
    updateDisplay();
    roundMessageElement.textContent = result;
    choiceMessageElement.textContent = `You chose ${formatChoice(playerChoice)}. Computer chose ${formatChoice(computerChoice)}.`;
  }

  choiceButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      playRound(button.dataset.choice);
    });
  });

  resetButton.addEventListener("click", function () {
    stats = {
      wins: 0,
      losses: 0,
      draws: 0
    };
    localStorage.removeItem(storageKey);
    updateDisplay();
    roundMessageElement.textContent = "Statistics reset.";
    choiceMessageElement.textContent = "";
  });

  updateDisplay();
})();
