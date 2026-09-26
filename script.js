const dinosaurs = {
  trex: {
    name: "T-Rex",
    greeting: "Roar! I'm T-Rex, the mighty stomp master!",
    activity: "Stomp your feet 3 times like a giant T-Rex!",
    kickoff: "Ready? One, two, three, stomp!",
    cheers: ["Wow, what mighty stomps! You're a dino superstar!", "Fantastic stomping! Give yourself a big dinosaur cheer!"],
  },
  triceratops: {
    name: "Triceratops",
    greeting: "Toot toot! I'm Triceratops, with three terrific horns!",
    activity: "Show me your horns! Shake your head left and right!",
    kickoff: "Show those horns and shake, shake, shake!",
    cheers: ["Terrific horn shaking! You did it!", "Hooray! Your dino wiggle was wonderful!"],
  },
  pterodactyl: {
    name: "Pterodactyl",
    greeting: "Scree! I'm Pterodactyl, soaring way up in the sky!",
    activity: "Flap your arms like wings and fly around the room once!",
    kickoff: "Spread your wings and fly!",
    cheers: ["Super flying! You have speedy wings!", "What a sky-high adventure! Great flapping!"],
  },
  brachiosaurus: {
    name: "Brachiosaurus",
    greeting: "Hello from up high! I'm Brachiosaurus, the tall leaf-muncher!",
    activity: "Reach your hands up high to grab the treetop leaves!",
    kickoff: "Reach up, way up, for those leaves!",
    cheers: ["You reached the very tallest leaves! Amazing!", "Wonderful reaching! You're as tall as a tree!"],
  },
  stegosaurus: {
    name: "Stegosaurus",
    greeting: "Rumble rattle! I'm Stegosaurus, with plates along my back!",
    activity: "Wiggle your bottom and swing your tail like a Stegosaurus!",
    kickoff: "Wiggle and swish that tail!",
    cheers: ["That tail wiggle was terrific!", "You are one wiggly, wonderful dinosaur!"],
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

function speakDino(dino) {
  const cheer = dino.cheers[Math.floor(Math.random() * dino.cheers.length)];
  speak(`${dino.greeting} ${dino.kickoff} ${dino.activity} ${cheer}`);
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

  speakDino(dino);
}

dinoButtons.forEach((button) => {
  button.addEventListener("click", () => playDino(button.dataset.dino));
  button.addEventListener("animationend", (event) => {
    if (event.animationName === "dino-dance") button.classList.remove("is-playing");
  });
});

repeatButton.addEventListener("click", () => {
  if (selectedDino) speakDino(selectedDino);
});

soundToggle.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  soundToggle.setAttribute("aria-pressed", String(voiceEnabled));
  soundToggle.setAttribute("aria-label", voiceEnabled ? "Turn voice off" : "Turn voice on");
  soundLabel.textContent = voiceEnabled ? "Voice on" : "Voice off";
  soundIcon.textContent = voiceEnabled ? "♫" : "♪";

  if (voiceEnabled && selectedDino) {
    speakDino(selectedDino);
  } else if (!voiceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});