const danceCards = [...document.querySelectorAll(".dino-card")];
const stageArt = document.querySelector("#dance-stage-art");
const stageName = document.querySelector("#dance-name");
const stageMessage = document.querySelector("#dance-message");
const soundToggle = document.querySelector(".sound-toggle");
const soundLabel = document.querySelector(".sound-label");
const soundIcon = document.querySelector(".sound-icon");
const danceVoices = {
  trex: { greeting: "Roar! I'm T-Rex, the stomp dance champion!", dance: "Let's stomp, bounce, and boogie!", cheers: ["What a mighty dance!", "You stomp like a superstar!"] },
  triceratops: { greeting: "Toot toot! I'm Triceratops, ready to shake my horns!", dance: "Let's wiggle and shake together!", cheers: ["Terrific shaking!", "You have some dino moves!"] },
  pterodactyl: { greeting: "Scree! I'm Pterodactyl, dancing way up high!", dance: "Flap those wings and fly!", cheers: ["What a sky-high dance!", "You fly like a star!"] },
  brachiosaurus: { greeting: "Hello from up high! I'm Brachiosaurus!", dance: "Reach up tall and sway side to side!", cheers: ["You are a tall dancing tree!", "Wonderful reaching and swaying!"] },
  stegosaurus: { greeting: "Rattle rattle! I'm Stegosaurus, with plates on my back!", dance: "Wiggle your tail and shake, shake, shake!", cheers: ["That was a terrific tail wiggle!", "You are one groovy dino!"] },
  ankylosaurus: { greeting: "Thump thump! I'm Ankylosaurus, wearing my bumpy armor!", dance: "Shake your shell and stomp your feet!", cheers: ["What a mighty shell shake!", "You danced like a dino champion!"] },
  spinosaurus: { greeting: "Roar! I'm Spinosaurus, with a big sail on my back!", dance: "Spin around and groove to the beat!", cheers: ["Super spinning!", "You are a dino dance star!"] },
  velociraptor: { greeting: "Rarr! I'm Velociraptor, quick on my dino feet!", dance: "Tap your toes and do a speedy shuffle!", cheers: ["Quick feet! What a fun dance!", "You are faster than a dancing comet!"] },
  parasaurolophus: { greeting: "Whooo! I'm Parasaurolophus, and I love to bob my head!", dance: "Bob your head and sway along!", cheers: ["What a happy head bob!", "You make dancing look dino-mite!"] },
};

let voiceEnabled = true;
let selectedVoiceLine = "";

function speak(text) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88;
  utterance.pitch = 1.18;
  window.speechSynthesis.speak(utterance);
}

function setVoiceEnabled(enabled) {
  voiceEnabled = enabled;
  soundToggle.setAttribute("aria-pressed", String(enabled));
  soundToggle.setAttribute("aria-label", enabled ? "Turn voice off" : "Turn voice on");
  soundLabel.textContent = enabled ? "Voice on" : "Voice off";
  soundIcon.textContent = enabled ? "♫" : "♪";

  if (!enabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  } else if (enabled && selectedVoiceLine) {
    speak(selectedVoiceLine);
  }
}

soundToggle.addEventListener("click", () => setVoiceEnabled(!voiceEnabled));

danceCards.forEach((card) => {
  card.addEventListener("click", () => {
    const name = card.querySelector(".dino-name").textContent;
    const art = card.querySelector(".dino-art").textContent;
    const voice = danceVoices[card.dataset.dino];
    const cheer = voice.cheers[Math.floor(Math.random() * voice.cheers.length)];

    stageArt.textContent = art;
    stageName.textContent = name;
    stageMessage.textContent = `${voice.dance} ${cheer}`;
    selectedVoiceLine = `${voice.greeting} ${voice.dance} ${cheer}`;
    speak(selectedVoiceLine);

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