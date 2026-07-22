(function () {
  const DEBUG_MODE = new URLSearchParams(window.location.search).get("debug") === "true";

  const words = [
    "apple", "banana", "garden", "window", "puzzle", "planet", "cookie", "school",
    "family", "summer", "winter", "rocket", "button", "flower", "bridge", "camera",
    "island", "orange", "pencil", "rabbit", "silver", "turtle", "yellow", "forest",
    "castle", "letter", "monkey", "smooth", "basket", "candle", "dinner", "engine",
    "guitar", "honey", "jungle", "kitten", "ladder", "mirror", "noodle", "pocket",
    "rainbow", "soccer", "travel", "velvet", "wizard"
  ];

  const maxMistakes = 6;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const statusEl = document.getElementById("hangman-status");
  const mistakesEl = document.getElementById("hangman-mistakes");
  const progressEl = document.getElementById("hangman-progress");
  const wordEl = document.getElementById("hangman-word");
  const lettersEl = document.getElementById("hangman-letters");
  const messageEl = document.getElementById("hangman-message");
  const newGameButton = document.getElementById("hangman-new-game");
  const debugPanel = document.getElementById("hangman-debug-panel");
  const debugAnswerEl = document.getElementById("hangman-debug-answer");
  const debugWordInput = document.getElementById("hangman-debug-word");
  const debugForceWordButton = document.getElementById("hangman-debug-force-word");
  const debugAddMistakeButton = document.getElementById("hangman-debug-add-mistake");
  const debugSetFiveButton = document.getElementById("hangman-debug-set-five");
  const debugRevealButton = document.getElementById("hangman-debug-reveal");
  const debugForceLossButton = document.getElementById("hangman-debug-force-loss");
  const debugRestartForcedButton = document.getElementById("hangman-debug-restart-forced");
  const debugRandomButton = document.getElementById("hangman-debug-random");

  let currentWord = "";
  let guessedLetters = new Set();
  let mistakes = 0;
  let gameOver = false;
  let lastWord = "";
  let forcedWord = "";

  function chooseWord() {
    let nextWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

    if (words.length > 1) {
      while (nextWord === lastWord) {
        nextWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
      }
    }

    lastWord = nextWord;
    return nextWord;
  }

  function startNewGame(wordOverride) {
    if (wordOverride) {
      forcedWord = wordOverride;
    }

    currentWord = forcedWord || chooseWord();
    guessedLetters = new Set();
    mistakes = 0;
    gameOver = false;

    statusEl.textContent = "Playing";
    messageEl.textContent = "Choose a letter to begin.";
    renderProgress();
    renderWord();
    renderLetters();
    updateMistakes();
    updateDebugAnswer();
  }

  function renderProgress() {
    progressEl.innerHTML = "";

    for (let index = 0; index < maxMistakes; index += 1) {
      const step = document.createElement("span");
      step.className = "hangman-progress-step";
      step.setAttribute("aria-hidden", "true");

      if (index < mistakes) {
        step.classList.add("is-missed");
      }

      progressEl.appendChild(step);
    }
  }

  function renderWord(revealWord) {
    wordEl.innerHTML = "";

    currentWord.split("").forEach(function (letter) {
      const slot = document.createElement("span");
      slot.className = "hangman-letter-slot";
      slot.textContent = revealWord || guessedLetters.has(letter) ? letter : "";
      slot.setAttribute("aria-label", slot.textContent ? letter : "Hidden letter");
      wordEl.appendChild(slot);
    });
  }

  function renderLetters() {
    lettersEl.innerHTML = "";

    alphabet.forEach(function (letter) {
      const button = document.createElement("button");
      button.className = "hangman-letter-button";
      button.type = "button";
      button.textContent = letter;
      button.setAttribute("data-letter", letter);

      if (guessedLetters.has(letter)) {
        button.disabled = true;
        button.classList.add(currentWord.includes(letter) ? "is-correct" : "is-wrong");
      }

      if (gameOver) {
        button.disabled = true;
      }

      button.addEventListener("click", function () {
        guessLetter(letter);
      });

      lettersEl.appendChild(button);
    });
  }

  function updateMistakes() {
    mistakes = Math.min(mistakes, maxMistakes);
    mistakesEl.textContent = mistakes + " / " + maxMistakes;
  }

  function updateDebugAnswer() {
    if (DEBUG_MODE && debugAnswerEl) {
      debugAnswerEl.textContent = currentWord || "--";
    }
  }

  function finishWin() {
    gameOver = true;
    statusEl.textContent = "Win";
    messageEl.textContent = "You solved the word: " + currentWord + ".";
    renderWord();
    renderLetters();
    updateDebugAnswer();
  }

  function finishLoss() {
    mistakes = maxMistakes;
    gameOver = true;
    statusEl.textContent = "Lost";
    messageEl.textContent = "Game over. The word was " + currentWord + ".";
    updateMistakes();
    renderProgress();
    renderWord(true);
    renderLetters();
    updateDebugAnswer();
  }

  function guessLetter(letter) {
    if (gameOver || guessedLetters.has(letter) || !alphabet.includes(letter)) {
      return;
    }

    guessedLetters.add(letter);

    if (currentWord.includes(letter)) {
      messageEl.textContent = "Good guess. " + letter + " is in the word.";
      if (window.NyanyaSound) {
        window.NyanyaSound.success();
      }
    } else {
      mistakes = Math.min(mistakes + 1, maxMistakes);
      messageEl.textContent = "No " + letter + ". Try another letter.";
      if (window.NyanyaSound) {
        window.NyanyaSound.error();
      }
    }

    updateMistakes();
    renderProgress();
    renderWord();
    checkRoundEnd();
    renderLetters();
  }

  function checkRoundEnd() {
    const won = currentWord.split("").every(function (letter) {
      return guessedLetters.has(letter);
    });

    if (won) {
      finishWin();
      return;
    }

    if (mistakes >= maxMistakes) {
      finishLoss();
    }
  }

  function getCleanForcedWord() {
    const value = debugWordInput.value.trim().toUpperCase();

    if (!/^[A-Z]+$/.test(value)) {
      messageEl.textContent = "Debug word must use letters A to Z only.";
      return "";
    }

    return value;
  }

  function setupDebugMode() {
    if (!DEBUG_MODE || !debugPanel) {
      return;
    }

    debugPanel.hidden = false;
    updateDebugAnswer();

    debugForceWordButton.addEventListener("click", function () {
      const word = getCleanForcedWord();

      if (word) {
        startNewGame(word);
      }
    });

    debugPanel.querySelectorAll("[data-hangman-debug-word]").forEach(function (button) {
      button.addEventListener("click", function () {
        const word = button.getAttribute("data-hangman-debug-word");
        debugWordInput.value = word;
        startNewGame(word);
      });
    });

    debugAddMistakeButton.addEventListener("click", function () {
      if (gameOver) {
        return;
      }

      mistakes = Math.min(mistakes + 1, maxMistakes);
      messageEl.textContent = "Debug added one incorrect guess.";
      updateMistakes();
      renderProgress();
      checkRoundEnd();
      renderLetters();
    });

    debugSetFiveButton.addEventListener("click", function () {
      if (gameOver) {
        return;
      }

      mistakes = Math.min(5, maxMistakes);
      messageEl.textContent = "Debug set mistakes to 5.";
      updateMistakes();
      renderProgress();
    });

    debugRevealButton.addEventListener("click", function () {
      currentWord.split("").forEach(function (letter) {
        guessedLetters.add(letter);
      });
      checkRoundEnd();
    });

    debugForceLossButton.addEventListener("click", finishLoss);

    debugRestartForcedButton.addEventListener("click", function () {
      if (forcedWord) {
        startNewGame(forcedWord);
      } else {
        const word = getCleanForcedWord();

        if (word) {
          startNewGame(word);
        }
      }
    });

    debugRandomButton.addEventListener("click", function () {
      forcedWord = "";
      debugWordInput.value = "";
      startNewGame();
    });
  }

  document.addEventListener("keydown", function (event) {
    const letter = event.key.toUpperCase();

    if (/^[A-Z]$/.test(letter)) {
      guessLetter(letter);
    }
  });

  newGameButton.addEventListener("click", function () {
    startNewGame();
  });
  startNewGame();
  setupDebugMode();
})();
