const wikiURL = "https://en.wikipedia.org/wiki/";

document.addEventListener("DOMContentLoaded", function () {
  const quoteTextElement = document.getElementById("quote-text");
  const characterInfoElement = document.getElementById("quote-character");
  const characterLink = document.getElementById("character-link");

  function renderQuote(quoteData) {
    quoteTextElement.textContent = `"${quoteData.sentence}"`;
    if (quoteData.character.house.name !== null) {
      characterInfoElement.textContent = `${quoteData.character.house.name}`;
    } else {
      characterInfoElement.textContent = "";
    }

    renderImage(quoteData.character.name);
  }

  fetch("https://api.gameofthronesquotes.xyz/v1/random/")
    .then((response) => response.json())
    .then((data) => {
      renderQuote(data);
    })
    .catch((error) => {
      console.error("Error fetching quote data:", error);
    });

  function renderImage(characterName) {
    const formattedCharacterName = characterName.replace(" ", "_");
    characterLink.href = `${wikiURL}${formattedCharacterName}`;
    characterLink.textContent = `${characterName}`;
  }

  const refreshButton = document.getElementById("refresh-button");
  refreshButton.addEventListener("click", function () {
    location.reload();
  });
});
