(function () {
  const totalFlipsElement = document.getElementById("total-flips");
  const headsCountElement = document.getElementById("heads-count");
  const tailsCountElement = document.getElementById("tails-count");
  const coinDisplayElement = document.getElementById("coin-display");
  const messageElement = document.getElementById("coin-message");
  const flipCoinButton = document.getElementById("flip-coin-button");
  const resetStatisticsButton = document.getElementById("reset-statistics-button");

  const statsKey = "nyanyaCoinFlipStats";

  let stats = loadStats();

  function loadStats() {
    const savedStats = JSON.parse(localStorage.getItem(statsKey) || "null");

    if (!savedStats) {
      return {
        total: 0,
        heads: 0,
        tails: 0
      };
    }

    return {
      total: Number(savedStats.total) || 0,
      heads: Number(savedStats.heads) || 0,
      tails: Number(savedStats.tails) || 0
    };
  }

  function saveStats() {
    localStorage.setItem(statsKey, JSON.stringify(stats));
  }

  function updateDisplay() {
    totalFlipsElement.textContent = stats.total;
    headsCountElement.textContent = stats.heads;
    tailsCountElement.textContent = stats.tails;
  }

  flipCoinButton.addEventListener("click", function () {
    window.NyanyaSound?.flip();
    const result = Math.random() < 0.5 ? "Heads" : "Tails";

    stats.total += 1;

    if (result === "Heads") {
      stats.heads += 1;
    } else {
      stats.tails += 1;
    }

    coinDisplayElement.textContent = result === "Heads" ? "H" : "T";
    coinDisplayElement.classList.remove("is-flipping");
    void coinDisplayElement.offsetWidth;
    coinDisplayElement.classList.add("is-flipping");
    messageElement.textContent = result;
    saveStats();
    updateDisplay();
  });

  resetStatisticsButton.addEventListener("click", function () {
    stats = {
      total: 0,
      heads: 0,
      tails: 0
    };
    localStorage.removeItem(statsKey);
    coinDisplayElement.textContent = "";
    coinDisplayElement.classList.remove("is-flipping");
    messageElement.textContent = "Statistics reset.";
    updateDisplay();
  });

  updateDisplay();
})();
