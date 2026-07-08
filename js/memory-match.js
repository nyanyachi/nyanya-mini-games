(function () {
  const boardElement = document.getElementById("memory-board");
  const movesElement = document.getElementById("moves");
  const matchesElement = document.getElementById("matches");
  const bestMovesElement = document.getElementById("best-moves");
  const messageElement = document.getElementById("memory-message");
  const newGameButton = document.getElementById("new-game-button");
  const resetStatisticsButton = document.getElementById("reset-statistics-button");

  const bestMovesKey = "nyanyaMemoryMatchBestMoves";
  const symbols = ["Apple", "Star", "Heart", "Moon"];

  let cards = [];
  let flippedCards = [];
  let moves = 0;
  let matches = 0;
  let bestMoves = Number(localStorage.getItem(bestMovesKey)) || 0;
  let locked = false;

  function shuffle(items) {
    const shuffled = items.slice();

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const currentItem = shuffled[index];
      shuffled[index] = shuffled[swapIndex];
      shuffled[swapIndex] = currentItem;
    }

    return shuffled;
  }

  function updateDisplay() {
    movesElement.textContent = moves;
    matchesElement.textContent = matches;
    bestMovesElement.textContent = bestMoves ? bestMoves : "--";
  }

  function renderBoard() {
    boardElement.innerHTML = "";

    cards.forEach(function (card, index) {
      const button = document.createElement("button");
      button.className = "memory-card";
      button.type = "button";
      button.dataset.index = String(index);
      button.textContent = card.revealed || card.matched ? card.symbol : "?";
      button.setAttribute("aria-label", card.revealed || card.matched ? `Card ${card.symbol}` : "Hidden card");

      if (card.revealed || card.matched) {
        button.classList.add("is-revealed");
      }

      if (card.matched) {
        button.classList.add("is-matched");
        button.disabled = true;
      }

      boardElement.appendChild(button);
    });
  }

  function saveBestMoves() {
    if (!bestMoves || moves < bestMoves) {
      bestMoves = moves;
      localStorage.setItem(bestMovesKey, String(bestMoves));
    }
  }

  function startNewGame() {
    cards = shuffle(symbols.concat(symbols)).map(function (symbol) {
      return {
        symbol: symbol,
        revealed: false,
        matched: false
      };
    });
    flippedCards = [];
    moves = 0;
    matches = 0;
    locked = false;
    messageElement.textContent = "Find all 4 matching pairs.";
    updateDisplay();
    renderBoard();
  }

  function hideUnmatchedCards() {
    flippedCards.forEach(function (cardIndex) {
      cards[cardIndex].revealed = false;
    });
    flippedCards = [];
    locked = false;
    messageElement.textContent = "Try again.";
    renderBoard();
  }

  function handleCardClick(cardIndex) {
    const card = cards[cardIndex];

    if (locked || card.revealed || card.matched) {
      return;
    }

    card.revealed = true;
    flippedCards.push(cardIndex);
    renderBoard();

    if (flippedCards.length < 2) {
      return;
    }

    moves += 1;
    const firstCard = cards[flippedCards[0]];
    const secondCard = cards[flippedCards[1]];

    if (firstCard.symbol === secondCard.symbol) {
      firstCard.matched = true;
      secondCard.matched = true;
      flippedCards = [];
      matches += 1;
      messageElement.textContent = "Match found!";

      if (matches === symbols.length) {
        saveBestMoves();
        messageElement.textContent = `Complete! You matched every pair in ${moves} moves.`;
      }

      updateDisplay();
      renderBoard();
      return;
    }

    locked = true;
    messageElement.textContent = "Not a match.";
    updateDisplay();
    setTimeout(hideUnmatchedCards, 850);
  }

  boardElement.addEventListener("click", function (event) {
    const cardButton = event.target.closest(".memory-card");

    if (!cardButton) {
      return;
    }

    handleCardClick(Number(cardButton.dataset.index));
  });

  newGameButton.addEventListener("click", startNewGame);

  resetStatisticsButton.addEventListener("click", function () {
    bestMoves = 0;
    localStorage.removeItem(bestMovesKey);
    updateDisplay();
    messageElement.textContent = "Statistics reset.";
  });

  startNewGame();
})();
