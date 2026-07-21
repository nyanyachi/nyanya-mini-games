(function () {
  const puzzles = {
    easy: [
      {
        puzzle: "534070902670195008098040507809701003406050701703904006901030280280419005000000000",
        solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
      },
      {
        puzzle: "807902045015038070430605801280190706050286030140350209390801007020703060000000000",
        solution: "867912345915438672432675891283194756759286134146357289394861527521743968678529413"
      },
      {
        puzzle: "091045070308702905705908034026037080103509407079081020607204800804070302000000000",
        solution: "291345678348762915765918234526437189183529467479681523637294851854176392912853746"
      }
    ],
    medium: [
      {
        puzzle: "530070002600095008098000500800701003400050001700904006900030200280019005305080109",
        solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
      },
      {
        puzzle: "800902005015008070400605001200090700700206004040050209090801007500700060670509003",
        solution: "867912345915438672432675891283194756759286134146357289394861527521743968678529413"
      },
      {
        puzzle: "001040600300760005705000030506007080103020407009001020607000801054006002902050046",
        solution: "291345678348762915765918234526437189183529467479681523637294851854176392912853746"
      }
    ],
    hard: [
      {
        puzzle: "500670002070090008090040500800001003400050001700004006900030080200010005300080009",
        solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
      },
      {
        puzzle: "067002040900008070400005001000100700050080030006000200390800007020003060070500403",
        solution: "867912345915438672432675891283194756759286134146357289394861527521743968678529413"
      },
      {
        puzzle: "200000608008060005005900030020030009100500007070080003007004001800100002902003006",
        solution: "291345678348762915765918234526437189183529467479681523637294851854176392912853746"
      }
    ]
  };

  const bestKey = "nyanyaSudokuBestTimes";
  const boardElement = document.getElementById("sudoku-board");
  const difficultySelect = document.getElementById("sudoku-difficulty");
  const statusElement = document.getElementById("sudoku-status");
  const timeElement = document.getElementById("sudoku-time");
  const bestElement = document.getElementById("sudoku-best");
  const mistakesElement = document.getElementById("sudoku-mistakes");
  const messageElement = document.getElementById("sudoku-message");
  const restartButton = document.getElementById("sudoku-restart");
  const newPuzzleButton = document.getElementById("sudoku-new");
  const clearButton = document.getElementById("sudoku-clear");
  const numberButtons = document.querySelectorAll("[data-sudoku-number]");

  let difficulty = "easy";
  let puzzleIndex = 0;
  let puzzle = puzzles[difficulty][puzzleIndex];
  let givens = [];
  let values = [];
  let incorrect = [];
  let selectedIndex = null;
  let state = "ready";
  let mistakes = 0;
  let seconds = 0;
  let timerId = null;
  let bestTimes = loadBestTimes();

  function loadBestTimes() {
    try {
      return JSON.parse(localStorage.getItem(bestKey)) || {};
    } catch (error) {
      return {};
    }
  }

  function saveBestTime() {
    const currentBest = bestTimes[difficulty];

    if (!currentBest || seconds < currentBest) {
      bestTimes[difficulty] = seconds;
      localStorage.setItem(bestKey, JSON.stringify(bestTimes));
    }
  }

  function formatTime(value) {
    if (!value) {
      return "--";
    }

    const minutes = Math.floor(value / 60);
    const remainingSeconds = value % 60;
    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
  }

  function formatRunningTime(value) {
    const minutes = Math.floor(value / 60);
    const remainingSeconds = value % 60;
    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
  }

  function startTimer() {
    if (timerId || state === "solved") {
      return;
    }

    state = "playing";
    timerId = setInterval(function () {
      seconds += 1;
      updateStats();
    }, 1000);
    updateStats();
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function loadPuzzle(index) {
    puzzleIndex = index;
    puzzle = puzzles[difficulty][puzzleIndex];
    givens = puzzle.puzzle.split("").map(function (value) { return value !== "0"; });
    values = puzzle.puzzle.split("").map(function (value) { return value === "0" ? "" : value; });
    incorrect = Array(81).fill(false);
    selectedIndex = null;
    state = "ready";
    mistakes = 0;
    seconds = 0;
    stopTimer();
    renderBoard();
    updateStats();
    messageElement.textContent = "Select an empty cell, then enter a number.";
  }

  function restartPuzzle() {
    loadPuzzle(puzzleIndex);
  }

  function newPuzzle() {
    const list = puzzles[difficulty];
    const nextIndex = list.length > 1 ? (puzzleIndex + 1) % list.length : 0;
    loadPuzzle(nextIndex);
  }

  function getRow(index) {
    return Math.floor(index / 9);
  }

  function getCol(index) {
    return index % 9;
  }

  function getBox(index) {
    return Math.floor(getRow(index) / 3) * 3 + Math.floor(getCol(index) / 3);
  }

  function isPeer(index, selected) {
    return getRow(index) === getRow(selected) || getCol(index) === getCol(selected) || getBox(index) === getBox(selected);
  }

  function selectCell(index) {
    if (state === "solved") {
      return;
    }

    selectedIndex = index;

    if (!givens[index]) {
      startTimer();
    }

    renderBoard();
  }

  function moveSelection(rowOffset, colOffset) {
    const current = selectedIndex === null ? 0 : selectedIndex;
    const nextRow = Math.min(8, Math.max(0, getRow(current) + rowOffset));
    const nextCol = Math.min(8, Math.max(0, getCol(current) + colOffset));
    selectCell(nextRow * 9 + nextCol);
  }

  function setCellValue(value) {
    if (selectedIndex === null || state === "solved" || givens[selectedIndex]) {
      return;
    }

    startTimer();

    const previousValue = values[selectedIndex];
    values[selectedIndex] = value;

    if (value !== puzzle.solution[selectedIndex]) {
      if (previousValue !== value) {
        mistakes += 1;
      }

      incorrect[selectedIndex] = true;
      messageElement.textContent = "That number does not fit this cell. Try another option.";
    } else {
      incorrect[selectedIndex] = false;
      messageElement.textContent = "Good placement. Keep going.";
    }

    renderBoard();
    checkSolved();
    updateStats();
  }

  function clearCell() {
    if (selectedIndex === null || state === "solved" || givens[selectedIndex]) {
      return;
    }

    startTimer();
    values[selectedIndex] = "";
    incorrect[selectedIndex] = false;
    messageElement.textContent = "Cell cleared.";
    renderBoard();
    updateStats();
  }

  function checkSolved() {
    for (let index = 0; index < 81; index += 1) {
      if (values[index] !== puzzle.solution[index]) {
        return;
      }
    }

    state = "solved";
    stopTimer();
    saveBestTime();
    messageElement.textContent = "You solved the puzzle!";
    renderBoard();
    updateStats();
  }

  function updateStats() {
    statusElement.textContent = state === "solved" ? "You Solved It!" : state === "playing" ? "Playing" : "Ready";
    timeElement.textContent = formatRunningTime(seconds);
    bestElement.textContent = formatTime(bestTimes[difficulty]);
    mistakesElement.textContent = mistakes;
  }

  function renderBoard() {
    const selectedValue = selectedIndex === null ? "" : values[selectedIndex];
    boardElement.innerHTML = "";

    values.forEach(function (value, index) {
      const cell = document.createElement("button");
      cell.className = "sudoku-cell";
      cell.type = "button";
      cell.dataset.index = index;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", value ? "Cell " + (index + 1) + ", value " + value : "Cell " + (index + 1) + ", empty");
      cell.textContent = value;

      if (givens[index]) {
        cell.classList.add("is-fixed");
      }

      if (incorrect[index]) {
        cell.classList.add("is-incorrect");
      }

      if (selectedIndex !== null && index !== selectedIndex) {
        if (getRow(index) === getRow(selectedIndex) || getCol(index) === getCol(selectedIndex)) {
          cell.classList.add("is-row-col");
        } else if (getBox(index) === getBox(selectedIndex)) {
          cell.classList.add("is-box");
        }
      }

      if (selectedIndex === index) {
        cell.classList.add("is-selected");
      }

      if (selectedValue && value === selectedValue) {
        cell.classList.add("is-match");
      }

      if (getCol(index) === 2 || getCol(index) === 5) {
        cell.classList.add("box-right");
      }

      if (getRow(index) === 2 || getRow(index) === 5) {
        cell.classList.add("box-bottom");
      }

      if (state === "solved") {
        cell.disabled = true;
      }

      cell.addEventListener("click", function () {
        selectCell(index);
      });

      boardElement.appendChild(cell);
    });
  }

  numberButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setCellValue(button.dataset.sudokuNumber);
    });
  });

  clearButton.addEventListener("click", clearCell);
  restartButton.addEventListener("click", restartPuzzle);
  newPuzzleButton.addEventListener("click", newPuzzle);

  difficultySelect.addEventListener("change", function () {
    difficulty = difficultySelect.value;
    loadPuzzle(0);
  });

  document.addEventListener("keydown", function (event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.key) !== -1) {
      event.preventDefault();

      if (event.key === "ArrowUp") {
        moveSelection(-1, 0);
      } else if (event.key === "ArrowDown") {
        moveSelection(1, 0);
      } else if (event.key === "ArrowLeft") {
        moveSelection(0, -1);
      } else if (event.key === "ArrowRight") {
        moveSelection(0, 1);
      }
    } else if (/^[1-9]$/.test(event.key)) {
      setCellValue(event.key);
    } else if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
      clearCell();
    }
  });

  loadPuzzle(0);
})();
