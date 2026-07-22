(function () {
  const categoryImages = {
    "Game Release": "mini-game-site/news/new_game.png",
    "Bug Fix": "mini-game-site/news/bug_fixed.png",
    "Update Complete": "mini-game-site/news/update_complete.png",
    "Performance": "mini-game-site/news/performance.png",
    "Maintenance": "mini-game-site/news/maintenance.png",
    "Under Development": "mini-game-site/news/under_development.png",
    "Stay Tuned": "mini-game-site/news/stay_tuned.png",
    "Thank You": "mini-game-site/news/thank_you.png"
  };

  const categories = [
    "Game Release",
    "Bug Fix",
    "Update Complete",
    "Performance",
    "Maintenance",
    "Under Development",
    "Stay Tuned",
    "Thank You"
  ];

  const newsPosts = [
    {
      section: "July 2026",
      title: "Whack-a-Mole Game Released",
      date: "July 21, 2026",
      category: "Game Release",
      description: [
        "Whack-a-Mole is now available on Nyanya Mini Games. Hit the active target in a 3 x 3 grid, avoid empty holes, and build your score before the 30-second timer ends.",
        "The game includes score tracking, Best Score saving in the browser, keyboard-accessible hole buttons, touch-friendly controls, and responsive layout support."
      ],
      link: { href: "games/whack-a-mole.html", label: "Play Whack-a-Mole" }
    },
    {
      section: "July 2026",
      title: "Hangman Game Released",
      date: "July 21, 2026",
      category: "Game Release",
      description: [
        "Hangman is now available as a new word game. Guess letters, reveal every matching character, and solve the hidden word before six incorrect guesses are used.",
        "The game includes clickable A to Z letter buttons, keyboard letter input on desktop browsers, repeated-letter handling, and clear win and loss messages."
      ],
      link: { href: "games/hangman.html", label: "Play Hangman" }
    },
    {
      section: "July 2026",
      title: "Sudoku Game Released",
      date: "July 20, 2026",
      category: "Game Release",
      description: [
        "Sudoku is now available on Nyanya Mini Games. Fill every row, column, and 3 x 3 box with the numbers 1 through 9 without duplicates.",
        "Players can choose from three difficulty levels: Easy, Medium, and Hard.",
        "The game includes keyboard controls, an on-screen number pad, mistake tracking, a timer, best-time saving for each difficulty, and responsive mobile support."
      ],
      link: { href: "games/sudoku.html", label: "Play Sudoku" }
    },
    {
      section: "July 2026",
      title: "Minesweeper Game Released",
      date: "July 20, 2026",
      category: "Game Release",
      description: [
        "Minesweeper is now available on Nyanya Mini Games. Reveal every safe cell, use flags to mark suspected mines, and clear the board without triggering a mine.",
        "Players can choose from three difficulty levels: Beginner uses a 9 x 9 board with 10 mines, Intermediate uses a 16 x 16 board with 40 mines, and Expert uses a 30 x 16 board with 99 mines.",
        "The game supports desktop and mobile controls, including right-click flags and mobile long-press flagging. Best completion times are saved separately for each difficulty."
      ],
      link: { href: "games/minesweeper.html", label: "Play Minesweeper" }
    },
    {
      section: "July 2026",
      title: "2048 Game Released",
      date: "July 19, 2026",
      category: "Game Release",
      description: [
        "2048 is now available as a new puzzle game on Nyanya Mini Games. Players slide numbered tiles, merge matching values, try to reach 2048, and can continue building even larger tiles after that milestone.",
        "Highlights include smooth keyboard and swipe controls, score tracking, Best Score saving in the browser, and a responsive board that works on desktop and mobile screens."
      ],
      link: { href: "games/2048.html", label: "Play 2048" }
    },
    {
      section: "July 2026",
      title: "Snake Game Released",
      date: "July 19, 2026",
      category: "Game Release",
      description: [
        "Snake is now available as a classic grid-based game where players guide the snake, collect food, grow longer, and try to beat their best score.",
        "Highlights include Arrow Keys and WASD controls, mobile swipe controls, Score, Length and Best Score tracking, a Start Game button, and a short 3 &rarr; 2 &rarr; 1 countdown before each round begins."
      ],
      link: { href: "games/snake.html", label: "Play Snake" }
    },
    {
      section: "July 2026",
      title: "Major Update",
      category: "Update Complete",
      description: [
        "Nyanya Mini Games reached 10 playable browser games. The collection now gives visitors a broader mix of quick activities, including reaction, memory, typing, board, color, clicker, logic, and luck-based games.",
        'You can browse the full collection on the <a href="games.html">Games page</a>.'
      ]
    },
    {
      section: "July 2026",
      title: "New Games Added",
      category: "Game Release",
      description: [
        "Coin Flip, Dice Roller, Tic-Tac-Toe, Typing Speed Test, and Color Guess were added to the library. These games expanded the site beyond the first clicker and reaction-style experiences, giving players more ways to play short sessions from the browser."
      ]
    },
    {
      section: "July 2026",
      title: "Previous Game Additions",
      category: "Game Release",
      description: [
        "Memory Match, Number Guess, Reaction Test, and Rock Paper Scissors were added before the latest group of games. Together with Apple Clicker, they helped shape the site into a small multi-game collection instead of a single-game project."
      ]
    },
    {
      section: "July 2026",
      title: "Website and Navigation Improvements",
      category: "Maintenance",
      description: [
        "The site added a dedicated Games page, a News & Updates page, and clearer navigation. Apple Clicker was moved into the Games library so the home page could focus on the broader collection while keeping the original game easy to find.",
        "SEO-related maintenance was also completed, including canonical URLs, sitemap and robots.txt updates, Cloudflare Pages optimization, and Google Search Console improvements."
      ]
    },
    {
      section: "July 2026",
      title: "Library and Content Improvements",
      category: "Update Complete",
      description: [
        "The Games library now uses original game illustrations where available, clearer category labels, and more specific card descriptions. These updates make it easier to understand what each game offers before opening it.",
        'Supporting pages such as <a href="about.html">About</a> and <a href="contact.html">Contact</a> were also improved so visitors can better understand the project and send useful feedback.'
      ]
    },
    {
      section: "July 2026",
      title: "Visual and Usability Improvements",
      category: "Performance",
      description: [
        "Lightweight animations and optional sound effects were added across the games. The updates are intended to make interactions feel clearer while keeping the site fast and comfortable to use.",
        "Responsive layout and UI consistency were improved so the games and supporting pages remain usable on desktop and mobile browsers."
      ]
    },
    {
      section: "July 2026",
      title: "Current Status",
      category: "Under Development",
      description: [
        "The site currently has 15 playable games, a responsive layout, SEO-focused page metadata, Google Search Console configuration, and AdSense review in progress."
      ]
    },
    {
      section: "Earlier",
      title: "Website Launch",
      category: "Stay Tuned",
      description: [
        "Nyanya Mini Games launched as a lightweight browser game website focused on simple, quick-play experiences."
      ]
    },
    {
      section: "Earlier",
      title: "Apple Clicker Released",
      category: "Game Release",
      description: [
        "Apple Clicker was released as the first game. It introduced the site's casual play style with a straightforward clicker loop, saved score progress, and quick browser access."
      ]
    },
    {
      section: "Earlier",
      title: "Games Page Introduced",
      category: "Stay Tuned",
      description: [
        "The Games page was introduced to give the growing collection a central place where visitors can find available games and see what is still being prepared."
      ]
    }
  ];

  function getCategoryImage(category) {
    return categoryImages[category];
  }

  function createCategoryCard(category, onSelect) {
    const card = document.createElement("button");
    const image = document.createElement("img");
    const label = document.createElement("span");

    card.className = "news-category-card";
    card.type = "button";
    card.dataset.category = category;
    card.setAttribute("aria-pressed", "false");
    image.src = getCategoryImage(category);
    image.width = 72;
    image.height = 72;
    image.loading = "lazy";
    image.alt = category + " category image";
    label.textContent = category;

    card.appendChild(image);
    card.appendChild(label);
    card.addEventListener("click", function () {
      onSelect(category);
    });
    return card;
  }

  function createPost(post) {
    const article = document.createElement("article");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const heading = document.createElement("div");
    const title = document.createElement("h3");
    const category = document.createElement("span");

    article.className = "news-post-card";
    article.dataset.category = post.category;
    image.className = "news-entry-icon";
    image.src = getCategoryImage(post.category);
    image.width = 72;
    image.height = 72;
    image.loading = "lazy";
    image.alt = post.category + " category image";
    content.className = "news-post-content";
    heading.className = "news-entry-heading";
    title.textContent = post.title;
    category.className = "news-entry-category";
    category.textContent = post.category;

    heading.appendChild(category);
    heading.appendChild(title);
    content.appendChild(heading);

    if (post.date) {
      const date = document.createElement("p");
      date.className = "news-entry-date";
      date.innerHTML = "<strong>Release date:</strong> " + post.date;
      content.appendChild(date);
    }

    post.description.forEach(function (description) {
      const paragraph = document.createElement("p");
      paragraph.innerHTML = description;
      content.appendChild(paragraph);
    });

    if (post.link) {
      const actions = document.createElement("p");
      const link = document.createElement("a");
      actions.className = "news-entry-actions";
      link.className = "button primary";
      link.href = post.link.href;
      link.textContent = post.link.label;
      actions.appendChild(link);
      content.appendChild(actions);
    }

    article.appendChild(image);
    article.appendChild(content);
    return article;
  }

  function setActiveCategory(categoryList, postsElement, selectedCategory) {
    const buttons = categoryList.querySelectorAll(".news-category-card");
    const posts = postsElement.querySelectorAll(".news-post-card");
    const headings = postsElement.querySelectorAll(".news-month-heading");

    buttons.forEach(function (button) {
      const isActive = button.dataset.category === selectedCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    posts.forEach(function (post) {
      post.hidden = selectedCategory ? post.dataset.category !== selectedCategory : false;
    });

    headings.forEach(function (heading) {
      let next = heading.nextElementSibling;
      let hasVisiblePost = false;

      while (next && !next.classList.contains("news-month-heading")) {
        if (next.classList.contains("news-post-card") && !next.hidden) {
          hasVisiblePost = true;
          break;
        }

        next = next.nextElementSibling;
      }

      heading.hidden = !hasVisiblePost;
    });
  }

  function renderNews() {
    const categoryList = document.getElementById("news-category-list");
    const postsElement = document.getElementById("news-posts");
    let currentSection = "";
    let activeCategory = "";

    if (!categoryList || !postsElement) {
      return;
    }

    categories.forEach(function (category) {
      categoryList.appendChild(createCategoryCard(category, function (selectedCategory) {
        activeCategory = activeCategory === selectedCategory ? "" : selectedCategory;
        setActiveCategory(categoryList, postsElement, activeCategory);
      }));
    });

    newsPosts.forEach(function (post) {
      if (post.section !== currentSection) {
        const sectionHeading = document.createElement("h3");
        sectionHeading.className = "news-month-heading";
        sectionHeading.textContent = post.section;
        postsElement.appendChild(sectionHeading);
        currentSection = post.section;
      }

      postsElement.appendChild(createPost(post));
    });
  }

  renderNews();
})();
