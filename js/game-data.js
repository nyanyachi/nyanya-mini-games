(function () {
  const DEFAULT_GAME_METADATA = {
    category: "casual",
    difficulty: "easy",
    playTime: "1-5 min",
    isNew: false,
    isPopular: false
  };

  const CATEGORY_LABELS = {
    arcade: "Arcade",
    puzzle: "Puzzle",
    word: "Word",
    casual: "Casual",
    strategy: "Strategy"
  };

  const DIFFICULTY_LABELS = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard"
  };

  const publicGames = [
    { title: "Apple Clicker", description: "Click apples, buy upgrades, and build a higher score with every round.", image: "mini-game-site/apps/optimized/apple-clicker.webp", url: "games/apple-clicker.html", category: "casual", difficulty: "easy", playTime: "1-5 min", isNew: false, isPopular: true },
    { title: "Rock Paper Scissors", description: "Choose your move, challenge the computer, and track your wins, losses, and draws.", image: "mini-game-site/apps/optimized/rock-paper-scissors.webp", url: "games/rock-paper-scissors.html", category: "strategy", difficulty: "easy", playTime: "1-3 min", isNew: false, isPopular: false },
    { title: "Tic-Tac-Toe", description: "Take turns placing X and O, complete a line of three, and avoid a draw.", image: "mini-game-site/apps/optimized/Tic-Tac-Toe.webp", url: "games/tic-tac-toe.html", category: "strategy", difficulty: "medium", playTime: "1-5 min", isNew: false, isPopular: false },
    { title: "Typing Speed Test", description: "Type the displayed text accurately and measure your speed and typing accuracy.", image: "mini-game-site/apps/optimized/Typing-Speed-Test.webp", url: "games/typing-speed-test.html", category: "word", difficulty: "medium", playTime: "1-3 min", isNew: false, isPopular: false },
    { title: "Color Guess", description: "Compare the target color with three choices and test how precisely you recognize colors.", image: "mini-game-site/apps/optimized/Color-Guess.webp", url: "games/color-guess.html", category: "casual", difficulty: "easy", playTime: "Under 1 min", isNew: false, isPopular: false },
    { title: "Coin Flip", description: "Flip a virtual coin and keep track of the total number of heads and tails.", image: "mini-game-site/apps/optimized/Coin-Flip.webp", url: "games/coin-flip.html", category: "casual", difficulty: "easy", playTime: "Under 1 min", isNew: false, isPopular: false },
    { title: "Dice Roller", description: "Roll a six-sided die and review how often each number appears during your session.", image: "mini-game-site/apps/optimized/Dice-Roller.webp", url: "games/dice-roller.html", category: "casual", difficulty: "easy", playTime: "Under 1 min", isNew: false, isPopular: false },
    { title: "Number Guess", description: "Guess a hidden number from 1 to 100 by following the higher and lower hints.", image: "mini-game-site/apps/optimized/number-guess.webp", url: "games/number-guess.html", category: "casual", difficulty: "easy", playTime: "1-3 min", isNew: false, isPopular: false },
    { title: "Minesweeper", description: "Reveal safe cells, flag hidden mines, and clear the board without triggering a mine.", image: "mini-game-site/apps/optimized/minesweeper.webp", url: "games/minesweeper.html", category: "puzzle", difficulty: "medium", playTime: "3-10 min", isNew: false, isPopular: false },
    { title: "Snake", description: "Steer the snake, collect food, grow longer, and avoid crashing.", image: "mini-game-site/apps/optimized/snake.webp", url: "games/snake.html", category: "arcade", difficulty: "medium", playTime: "3-10 min", isNew: false, isPopular: true },
    { title: "2048", description: "Slide matching number tiles, merge values, and try to reach the 2048 tile.", image: "mini-game-site/apps/optimized/2048.webp", url: "games/2048.html", category: "puzzle", difficulty: "medium", playTime: "10+ min", isNew: false, isPopular: true },
    { title: "Hangman", description: "Guess the hidden word letter by letter before six wrong guesses run out.", image: "mini-game-site/apps/optimized/hangman.webp", url: "games/hangman.html", category: "word", difficulty: "medium", playTime: "1-5 min", isNew: true, isPopular: false },
    { title: "Whack-a-Mole", description: "Hit the active target, avoid empty holes, and score as much as possible in 30 seconds.", image: "mini-game-site/apps/optimized/whack-a-mole.webp", url: "games/whack-a-mole.html", category: "arcade", difficulty: "easy", playTime: "Under 1 min", isNew: true, isPopular: false },
    { title: "Sudoku", description: "Complete the 9 x 9 grid so every row, column, and box contains the numbers 1 through 9.", image: "mini-game-site/apps/optimized/sudoku.webp", url: "games/sudoku.html", category: "puzzle", difficulty: "hard", playTime: "10+ min", isNew: false, isPopular: false },
    { title: "Reaction Test", description: "Wait for the signal, react as quickly as possible, and compare your latest and best times.", image: "mini-game-site/apps/optimized/reaction-test.webp", url: "games/reaction-test.html", category: "casual", difficulty: "easy", playTime: "Under 1 min", isNew: false, isPopular: false },
    { title: "Memory Match", description: "Turn over cards, remember their positions, and match all pairs in as few moves as possible.", image: "mini-game-site/apps/optimized/memory-match.webp", url: "games/memory-match.html", category: "puzzle", difficulty: "medium", playTime: "3-10 min", isNew: false, isPopular: false }
  ];

  function withMetadataDefaults(game) {
    return Object.assign({}, DEFAULT_GAME_METADATA, game);
  }

  function getPublicGames() {
    return publicGames.map(withMetadataDefaults).filter(function (game) {
      return game && game.title && game.url && game.image;
    });
  }

  function getFeaturedGroup(game) {
    const normalizedGame = withMetadataDefaults(game || {});

    if (normalizedGame.isNew) {
      return "new";
    }

    if (normalizedGame.isPopular) {
      return "popular";
    }

    return "standard";
  }

  function getDisplayMetadata(game) {
    const normalizedGame = withMetadataDefaults(game || {});

    return {
      badges: [
        normalizedGame.isNew ? "NEW" : "",
        normalizedGame.isPopular ? "POPULAR" : ""
      ].filter(Boolean),
      details: [
        CATEGORY_LABELS[normalizedGame.category] || CATEGORY_LABELS[DEFAULT_GAME_METADATA.category],
        DIFFICULTY_LABELS[normalizedGame.difficulty] || DIFFICULTY_LABELS[DEFAULT_GAME_METADATA.difficulty],
        normalizedGame.playTime || DEFAULT_GAME_METADATA.playTime
      ]
    };
  }

  function appendPill(parent, text, className) {
    const pill = document.createElement("span");
    pill.className = className;
    pill.textContent = text;
    parent.appendChild(pill);
  }

  function renderMetadata(container, game) {
    if (!container || typeof document === "undefined") {
      return;
    }

    const metadata = getDisplayMetadata(game);
    const badgeRow = document.createElement("div");
    const detailRow = document.createElement("div");

    container.innerHTML = "";
    container.classList.add("game-metadata");
    badgeRow.className = "game-card-badges";
    detailRow.className = "metadata-row";

    metadata.badges.forEach(function (badge) {
      const badgeClass = badge === "NEW" ? "metadata-badge-new" : "metadata-badge-popular";
      appendPill(badgeRow, badge, "status-pill metadata-badge " + badgeClass);
    });

    metadata.details.forEach(function (detail) {
      appendPill(detailRow, detail, "category-pill metadata-pill");
    });

    if (metadata.badges.length) {
      container.appendChild(badgeRow);
    }

    container.appendChild(detailRow);
  }

  function getGameByUrl(url) {
    return getPublicGames().find(function (game) {
      return game.url === url;
    });
  }

  function normalizeGameUrl(url) {
    const cleanUrl = String(url || "").replace(/^\.\.\//, "").replace(/^\//, "");
    return cleanUrl.indexOf("games/") === 0 ? cleanUrl : "games/" + cleanUrl;
  }

  function getRelatedGames(currentGameUrl, limit) {
    const normalizedUrl = normalizeGameUrl(currentGameUrl);
    const gameLimit = typeof limit === "number" ? limit : 3;
    const games = getPublicGames();
    const currentGame = getGameByUrl(normalizedUrl);

    return games.map(function (game, index) {
      let score = 0;

      if (currentGame) {
        if (game.category === currentGame.category) {
          score += 8;
        }

        if (game.difficulty === currentGame.difficulty) {
          score += 2;
        }

        if (game.playTime === currentGame.playTime) {
          score += 1;
        }
      }

      if (game.isPopular) {
        score += 1;
      }

      return {
        game: game,
        index: index,
        score: score
      };
    }).filter(function (item) {
      return item.game.url !== normalizedUrl;
    }).sort(function (first, second) {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.index - second.index;
    }).slice(0, gameLimit).map(function (item) {
      return item.game;
    });
  }

  window.NyanyaGameData = {
    defaults: DEFAULT_GAME_METADATA,
    getDisplayMetadata: getDisplayMetadata,
    getFeaturedGroup: getFeaturedGroup,
    getGameByUrl: getGameByUrl,
    getPublicGames: getPublicGames,
    getRelatedGames: getRelatedGames,
    renderMetadata: renderMetadata
  };
})();
