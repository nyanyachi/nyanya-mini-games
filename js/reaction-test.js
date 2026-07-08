(function () {
  const reactionButton = document.getElementById("reaction-button");
  const latestTimeElement = document.getElementById("latest-time");
  const bestTimeElement = document.getElementById("best-time");
  const attemptsElement = document.getElementById("attempts");
  const messageElement = document.getElementById("reaction-message");
  const resetButton = document.getElementById("reset-stats-button");

  const bestTimeKey = "nyanyaReactionTestBestTime";
  const attemptsKey = "nyanyaReactionTestAttempts";
  const minDelay = 1200;
  const maxDelay = 3600;

  let bestTime = Number(localStorage.getItem(bestTimeKey)) || 0;
  let attempts = Number(localStorage.getItem(attemptsKey)) || 0;
  let latestTime = 0;
  let state = "idle";
  let readyAt = 0;
  let waitTimer = null;

  function formatTime(time) {
    return time ? `${time} ms` : "--";
  }

  function updateDisplay() {
    latestTimeElement.textContent = formatTime(latestTime);
    bestTimeElement.textContent = formatTime(bestTime);
    attemptsElement.textContent = attempts;
  }

  function setState(nextState, label, message) {
    state = nextState;
    reactionButton.textContent = label;
    reactionButton.classList.toggle("is-waiting", nextState === "waiting");
    reactionButton.classList.toggle("is-ready", nextState === "ready");
    messageElement.textContent = message;
  }

  function clearRoundTimer() {
    if (waitTimer) {
      clearTimeout(waitTimer);
      waitTimer = null;
    }
  }

  function startRound() {
    clearRoundTimer();
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    setState("waiting", "Wait...", "Wait for the signal.");
    waitTimer = setTimeout(function () {
      readyAt = Date.now();
      setState("ready", "Click now!", "Click now!");
    }, delay);
  }

  function recordReaction() {
    latestTime = Date.now() - readyAt;
    attempts += 1;

    if (!bestTime || latestTime < bestTime) {
      bestTime = latestTime;
      localStorage.setItem(bestTimeKey, String(bestTime));
    }

    localStorage.setItem(attemptsKey, String(attempts));
    updateDisplay();
    setState("idle", "Start", `Reaction time: ${latestTime} ms.`);
  }

  reactionButton.addEventListener("click", function () {
    if (state === "idle") {
      startRound();
      return;
    }

    if (state === "waiting") {
      clearRoundTimer();
      setState("idle", "Start", "Too early! Start again and wait for the signal.");
      return;
    }

    recordReaction();
  });

  resetButton.addEventListener("click", function () {
    clearRoundTimer();
    bestTime = 0;
    attempts = 0;
    latestTime = 0;
    localStorage.removeItem(bestTimeKey);
    localStorage.removeItem(attemptsKey);
    updateDisplay();
    setState("idle", "Start", "Stats reset. Start a new round when you are ready.");
  });

  updateDisplay();
})();
