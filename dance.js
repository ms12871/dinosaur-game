const danceCards = [...document.querySelectorAll(".dino-card")];
const stageArt = document.querySelector("#dance-stage-art");
const stageName = document.querySelector("#dance-name");
const stageMessage = document.querySelector("#dance-message");

danceCards.forEach((card) => {
  card.addEventListener("click", () => {
    const name = card.querySelector(".dino-name").textContent;
    const art = card.querySelector(".dino-art").textContent;

    stageArt.textContent = art;
    stageName.textContent = name;
    stageMessage.textContent = `${name} is dancing! Pick another dino to switch dancers.`;

    danceCards.forEach((otherCard) => {
      otherCard.setAttribute("aria-pressed", String(otherCard === card));
    });

    stageArt.classList.remove("is-dancing");
    void stageArt.offsetWidth;
    stageArt.classList.add("is-dancing");
  });
});

stageArt.addEventListener("animationend", () => {
  stageArt.classList.remove("is-dancing");
});