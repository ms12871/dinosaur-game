const dinosaurs = {
  trex: {
    name: "T-Rex",
    activity: "Stomp your feet 3 times like a giant T-Rex!",
    kickoff: "Ready? One, two, three, stomp!",
  },
  triceratops: {
    name: "Triceratops",
    activity: "Show me your horns! Shake your head left and right!",
    kickoff: "Show those horns and shake, shake, shake!",
  },
  pterodactyl: {
    name: "Pterodactyl",
    activity: "Flap your arms like wings and fly around the room once!",
    kickoff: "Spread your wings and fly!",
  },
  brachiosaurus: {
    name: "Brachiosaurus",
    activity: "Reach your hands up high to grab the treetop leaves!",
    kickoff: "Reach up, way up, for those leaves!",
  },
  stegosaurus: {
    name: "Stegosaurus",
    activity: "Wiggle your bottom and swing your tail like a Stegosaurus!",
    kickoff: "Wiggle and swish that tail!",
  },
};

const dinoButtons = [...document.querySelectorAll(".dino-card")];
const announcement = document.querySelector("#announcement");
const activityText = document.querySelector("#activity-text");
const activityKicker = document.querySelector("#activity-kicker");
const activityMark = document.querySelector(".activity-mark span");
const repeatButton = document.querySelector(".repeat-button");
const soundToggle = document.querySelector(".sound-toggle");
const soundLabel = document.querySelector(".sound-label");
const soundIcon = document.querySelector(".sound-icon");

let selectedDino = null;
let voiceEnabled = true;

function speak(text) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88;
  utterance.pitch = 1.18;
  window.speechSynthesis.speak(utterance);
}

function playDino(key) {
  const dino = dinosaurs[key];
  if (!dino) return;

  selectedDino = dino;
  announcement.textContent = `${dino.name}!`;
  activityText.textContent = dino.activity;
  activityKicker.textContent = "YOUR DINO MOVE";
  activityMark.textContent = "!";
  repeatButton.disabled = false;

  dinoButtons.forEach((button) => {
    const isSelected = button.dataset.dino === key;
    button.setAttribute("aria-pressed", String(isSelected));
    button.classList.toggle("is-playing", isSelected);
  });

  speak(`${dino.name}! ${dino.kickoff} ${dino.activity}`);
}

dinoButtons.forEach((button) => {
  button.addEventListener("click", () => playDino(button.dataset.dino));
  button.addEventListener("animationend", (event) => {
    if (event.animationName === "dino-dance") button.classList.remove("is-playing");
  });
});

repeatButton.addEventListener("click", () => {
  if (selectedDino) speak(`${selectedDino.name}! ${selectedDino.kickoff} ${selectedDino.activity}`);
});

soundToggle.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  soundToggle.setAttribute("aria-pressed", String(voiceEnabled));
  soundToggle.setAttribute("aria-label", voiceEnabled ? "Turn voice off" : "Turn voice on");
  soundLabel.textContent = voiceEnabled ? "Voice on" : "Voice off";
  soundIcon.textContent = voiceEnabled ? "♫" : "♪";

  if (voiceEnabled && selectedDino) {
    speak(`${selectedDino.name}! ${selectedDino.activity}`);
  } else if (!voiceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});