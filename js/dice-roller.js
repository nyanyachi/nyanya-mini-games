(function () {
  const diceFaceElement = document.getElementById("dice-face");
  const lastRollElement = document.getElementById("last-roll");
  const totalRollsElement = document.getElementById("total-rolls");
  const messageElement = document.getElementById("dice-message");
  const rollDiceButton = document.getElementById("roll-dice-button");
  const resetStatisticsButton = document.getElementById("reset-statistics-button");
  const countElements = [
    document.getElementById("count-1"),
    document.getElementById("count-2"),
    document.getElementById("count-3"),
    document.getElementById("count-4"),
    document.getElementById("count-5"),
    document.getElementById("count-6")
  ];

  const statsKey = "nyanyaDiceRollerStats";
  const pipPositions = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };

  let stats = loadStats();

  function triggerAnimation(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function loadStats() {
    const savedStats = JSON.parse(localStorage.getItem(statsKey) || "null");

    if (!savedStats) {
      return {
        lastRoll: 0,
        total: 0,
        counts: [0, 0, 0, 0, 0, 0]
      };
    }

    const counts = Array.isArray(savedStats.counts) ? savedStats.counts.slice(0, 6).map(function (count) {
      return Number(count) || 0;
    }) : [0, 0, 0, 0, 0, 0];

    while (counts.length < 6) {
      counts.push(0);
    }

    return {
      lastRoll: Number(savedStats.lastRoll) || 0,
      total: Number(savedStats.total) || 0,
      counts: counts
    };
  }

  function saveStats() {
    localStorage.setItem(statsKey, JSON.stringify(stats));
  }

  function renderDiceFace(value) {
    diceFaceElement.innerHTML = "";

    if (!value) {
      return;
    }

    pipPositions[value].forEach(function (position) {
      const pip = document.createElement("span");
      pip.className = `dice-pip pip-${position}`;
      diceFaceElement.appendChild(pip);
    });
  }

  function updateDisplay() {
    lastRollElement.textContent = stats.lastRoll || "--";
    totalRollsElement.textContent = stats.total;

    countElements.forEach(function (element, index) {
      element.textContent = stats.counts[index] || 0;
    });

    renderDiceFace(stats.lastRoll);
  }

  rollDiceButton.addEventListener("click", function () {
    window.NyanyaSound?.roll();
    const roll = Math.floor(Math.random() * 6) + 1;

    stats.lastRoll = roll;
    stats.total += 1;
    stats.counts[roll - 1] += 1;
    messageElement.textContent = `You rolled ${roll}.`;

    saveStats();
    updateDisplay();
    triggerAnimation(diceFaceElement, "is-rolling");
  });

  resetStatisticsButton.addEventListener("click", function () {
    stats = {
      lastRoll: 0,
      total: 0,
      counts: [0, 0, 0, 0, 0, 0]
    };
    localStorage.removeItem(statsKey);
    messageElement.textContent = "Statistics reset.";
    updateDisplay();
  });

  updateDisplay();
})();
