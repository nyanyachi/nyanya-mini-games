(function () {
  const targetTextElement = document.getElementById("target-text");
  const typingInput = document.getElementById("typing-input");
  const timeSecondsElement = document.getElementById("time-seconds");
  const wpmElement = document.getElementById("wpm");
  const accuracyElement = document.getElementById("accuracy");
  const bestWpmElement = document.getElementById("best-wpm");
  const messageElement = document.getElementById("typing-message");
  const startTestButton = document.getElementById("start-test-button");
  const newTextButton = document.getElementById("new-text-button");
  const resetStatisticsButton = document.getElementById("reset-statistics-button");

  const texts = [
    "Small games make quick breaks brighter.",
    "Nyanya Mini Games runs in your browser.",
    "Focus on the words and type with care.",
    "A steady rhythm can improve typing speed."
  ];
  const bestWpmKey = "nyanyaTypingSpeedBestWpm";

  let textIndex = 0;
  let targetText = texts[textIndex];
  let startTime = 0;
  let timerId = 0;
  let running = false;
  let bestWpm = Number(localStorage.getItem(bestWpmKey)) || 0;

  function triggerAnimation(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function updateBestDisplay() {
    bestWpmElement.textContent = bestWpm ? bestWpm : "--";
  }

  function calculateAccuracy(typedText) {
    if (!typedText.length) {
      return 100;
    }

    let correctCharacters = 0;
    const compareLength = Math.max(typedText.length, targetText.length);

    for (let index = 0; index < typedText.length; index += 1) {
      if (typedText[index] === targetText[index]) {
        correctCharacters += 1;
      }
    }

    return Math.max(0, Math.round((correctCharacters / compareLength) * 100));
  }

  function calculateWpm(seconds, characterCount) {
    if (!seconds) {
      return 0;
    }

    return Math.round((characterCount / 5) / (seconds / 60));
  }

  function updateProgress() {
    const elapsedSeconds = running ? (Date.now() - startTime) / 1000 : Number(timeSecondsElement.textContent);
    const typedText = typingInput.value;

    timeSecondsElement.textContent = elapsedSeconds.toFixed(1);
    wpmElement.textContent = calculateWpm(elapsedSeconds, typedText.length);
    accuracyElement.textContent = calculateAccuracy(typedText);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = 0;
    running = false;
  }

  function finishTest() {
    stopTimer();
    updateProgress();

    const finalWpm = Number(wpmElement.textContent);

    if (finalWpm > bestWpm) {
      bestWpm = finalWpm;
      localStorage.setItem(bestWpmKey, String(bestWpm));
      updateBestDisplay();
    }

    typingInput.disabled = true;
    startTestButton.disabled = false;
    messageElement.textContent = "Complete!";
    window.NyanyaSound?.success();
    triggerAnimation(messageElement, "animate-pop");
  }

  function resetRound(message) {
    stopTimer();
    typingInput.value = "";
    typingInput.disabled = true;
    startTestButton.disabled = false;
    timeSecondsElement.textContent = "0.0";
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100";
    messageElement.textContent = message;
  }

  function setTargetText() {
    targetText = texts[textIndex];
    targetTextElement.textContent = targetText;
  }

  startTestButton.addEventListener("click", function () {
    resetRound("Type the text exactly.");
    running = true;
    startTime = Date.now();
    typingInput.disabled = false;
    startTestButton.disabled = true;
    typingInput.focus();
    timerId = setInterval(updateProgress, 100);
  });

  typingInput.addEventListener("input", function () {
    if (!running) {
      return;
    }

    updateProgress();

    if (typingInput.value === targetText) {
      finishTest();
    }
  });

  newTextButton.addEventListener("click", function () {
    textIndex = (textIndex + 1) % texts.length;
    setTargetText();
    resetRound("New text loaded. Press Start Test when you are ready.");
  });

  resetStatisticsButton.addEventListener("click", function () {
    bestWpm = 0;
    localStorage.removeItem(bestWpmKey);
    updateBestDisplay();
    resetRound("Statistics reset.");
  });

  setTargetText();
  updateBestDisplay();
  resetRound("Press Start Test when you are ready.");
})();
