(function () {
  if (!window.NyanyaGameData) {
    return;
  }

  const details = document.querySelector("[data-game-details]");
  const relatedGames = document.querySelector("[data-related-games]");
  const pageName = window.location.pathname.split("/").pop();
  const gameUrl = "games/" + pageName;
  const game = window.NyanyaGameData.getGameByUrl(gameUrl);

  function toPageHref(game) {
    return game.url.replace("games/", "");
  }

  function toImageSrc(game) {
    return "../" + game.image;
  }

  function createRelatedCard(game) {
    const article = document.createElement("article");
    const image = document.createElement("img");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const link = document.createElement("a");

    article.className = "game-card related-game-card";
    image.className = "game-icon game-card-image";
    image.src = toImageSrc(game);
    image.width = 180;
    image.height = 180;
    image.loading = "lazy";
    image.alt = game.title + " mini game artwork";
    title.textContent = game.title;
    description.textContent = game.description;
    link.className = "button secondary";
    link.href = toPageHref(game);
    link.textContent = "Play now";

    article.appendChild(image);
    article.appendChild(title);
    article.appendChild(description);
    article.appendChild(link);
    return article;
  }

  if (details && game) {
    window.NyanyaGameData.renderMetadata(details, game);
  }

  if (relatedGames && window.NyanyaGameData.getRelatedGames) {
    relatedGames.innerHTML = "";
    window.NyanyaGameData.getRelatedGames(gameUrl, 3).forEach(function (relatedGame) {
      relatedGames.appendChild(createRelatedCard(relatedGame));
    });
  }
})();
