const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

function activateTab(tab) {
  tabs.forEach((item, index) => {
    const isActive = item === tab;
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
    panels[index].hidden = !isActive;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    }
  });
});

const soundPatterns = {
  trex: [
    { from: 155, to: 62, duration: 0.52, type: "sawtooth" },
    { from: 105, to: 48, duration: 0.3, type: "triangle" },
  ],
  triceratops: [
    { from: 300, to: 440, duration: 0.16, type: "square" },
    { from: 390, to: 540, duration: 0.17, type: "square" },
    { from: 330, to: 260, duration: 0.19, type: "square" },
  ],
  pterodactyl: [
    { from: 740, to: 980, duration: 0.12, type: "sine" },
    { from: 1060, to: 830, duration: 0.12, type: "sine" },
    { from: 880, to: 1160, duration: 0.15, type: "sine" },
  ],
  brachiosaurus: [
    { from: 230, to: 185, duration: 0.42, type: "triangle" },
    { from: 195, to: 145, duration: 0.42, type: "triangle" },
  ],
  stegosaurus: [
    { from: 520, to: 430, duration: 0.11, type: "sine" },
    { from: 650, to: 540, duration: 0.11, type: "sine" },
    { from: 480, to: 390, duration: 0.16, type: "sine" },
  ],
};

const soundCards = [...document.querySelectorAll("[data-sound-dino]")];
const soundFeedback = document.querySelector("#sound-feedback");
const playSoundButton = document.querySelector("#play-sound");
const replaySoundButton = document.querySelector("#replay-sound");
const nextSoundButton = document.querySelector("#next-sound");
let audioContext = null;
let activeOscillators = [];
let soundAnswer = null;
let previousSound = null;

function playDinoSound(dino) {
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) return false;

  audioContext ??= new AudioContextType();
  if (audioContext.state === "suspended") void audioContext.resume();

  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // The sound may have ended just before the next one was requested.
    }
  });
  activeOscillators = [];

  let startAt = audioContext.currentTime + 0.03;
  soundPatterns[dino].forEach((note) => {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const endAt = startAt + note.duration;

    oscillator.type = note.type;
    oscillator.frequency.setValueAtTime(note.from, startAt);
    oscillator.frequency.exponentialRampToValueAtTime(note.to, endAt);
    volume.gain.setValueAtTime(0.001, startAt);
    volume.gain.linearRampToValueAtTime(0.12, startAt + 0.02);
    volume.gain.exponentialRampToValueAtTime(0.001, endAt);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.addEventListener("ended", () => {
      activeOscillators = activeOscillators.filter((item) => item !== oscillator);
    }, { once: true });
    oscillator.start(startAt);
    oscillator.stop(endAt + 0.02);
    activeOscillators.push(oscillator);
    startAt = endAt + 0.07;
  });

  return true;
}

function startSoundRound() {
  const candidates = soundCards
    .map((card) => card.dataset.soundDino)
    .filter((dino) => dino !== previousSound);
  const nextAnswer = candidates[Math.floor(Math.random() * candidates.length)];

  if (!playDinoSound(nextAnswer)) {
    soundFeedback.textContent = "Sound play is not available in this browser. Count Eggs and Story Time are ready to play.";
    soundFeedback.className = "mode-feedback is-try-again";
    return;
  }

  soundAnswer = nextAnswer;
  previousSound = nextAnswer;
  soundFeedback.textContent = "Listen carefully, then tap the dinosaur you heard.";
  soundFeedback.className = "mode-feedback";
  replaySoundButton.disabled = false;
  nextSoundButton.disabled = true;
  soundCards.forEach((card) => card.setAttribute("aria-pressed", "false"));
}

playSoundButton.addEventListener("click", startSoundRound);
replaySoundButton.addEventListener("click", () => {
  if (soundAnswer && !playDinoSound(soundAnswer)) {
    soundFeedback.textContent = "Sound play is not available in this browser.";
  }
});
nextSoundButton.addEventListener("click", startSoundRound);

soundCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!soundAnswer) {
      soundFeedback.textContent = "First, listen for a dinosaur sound.";
      return;
    }

    if (card.dataset.soundDino === soundAnswer) {
      const name = card.querySelector(".dino-name").textContent;
      soundFeedback.textContent = `You found it! That was the ${name} sound!`;
      soundFeedback.className = "mode-feedback is-correct";
      card.setAttribute("aria-pressed", "true");
      nextSoundButton.disabled = false;
    } else {
      soundFeedback.textContent = "Good guess! Listen again or try a different dinosaur.";
      soundFeedback.className = "mode-feedback is-try-again";
    }
  });
});

const eggDisplay = document.querySelector("#egg-display");
const countFeedback = document.querySelector("#count-feedback");
const nextCountButton = document.querySelector("#next-count");
const countButtons = [...document.querySelectorAll("[data-count]")];
const countWords = ["zero", "one", "two", "three", "four", "five"];
let eggAnswer = 0;

function startCountRound() {
  eggAnswer = Math.floor(Math.random() * 5) + 1;
  eggDisplay.setAttribute("aria-label", `${eggAnswer} dinosaur ${eggAnswer === 1 ? "egg" : "eggs"}`);
  eggDisplay.replaceChildren(...Array.from({ length: eggAnswer }, () => {
    const egg = document.createElement("span");
    egg.className = "egg";
    egg.setAttribute("aria-hidden", "true");
    egg.textContent = "🥚";
    return egg;
  }));
  countFeedback.textContent = "Count each egg, then choose a number.";
  countFeedback.className = "mode-feedback";
  countButtons.forEach((button) => { button.disabled = false; });
  nextCountButton.hidden = true;
}

countButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const guess = Number(button.dataset.count);
    if (guess === eggAnswer) {
      countFeedback.textContent = `Yes! You counted ${countWords[eggAnswer]} ${eggAnswer === 1 ? "egg" : "eggs"}!`;
      countFeedback.className = "mode-feedback is-correct";
      countButtons.forEach((choice) => { choice.disabled = true; });
      nextCountButton.hidden = false;
    } else {
      countFeedback.textContent = "Let's count together. Have another try!";
      countFeedback.className = "mode-feedback is-try-again";
    }
  });
});

nextCountButton.addEventListener("click", startCountRound);
startCountRound();

const storyChapters = [
  {
    art: "🦖",
    prompt: "Milo hears a tiny roar in the jungle. How should Milo find the new friend?",
    choices: [
      { text: "Follow the little footprints", result: "Milo follows the footprints past the fern leaves." },
      { text: "Ask Ptera to peek from the sky", result: "Ptera flaps up high and spots a friend by the river." },
    ],
  },
  {
    art: "🌿",
    prompt: "A little river is in the way. How can everyone cross?",
    choices: [
      { text: "Hop across the stepping stones", result: "Hop, hop! Everyone reaches the other side." },
      { text: "Make a big leaf boat", result: "The leaf boat gently floats everyone across." },
    ],
  },
  {
    art: "🦕",
    prompt: "They found their new friend! What should the dinos do together?",
    choices: [
      { text: "Share a berry picnic", result: "They share sweet berries and tell silly dino stories." },
      { text: "Have a friendly dance", result: "They stomp, flap, and wiggle together." },
    ],
  },
];

const storyArt = document.querySelector("#story-art");
const storyPrompt = document.querySelector("#story-prompt");
const storyChoices = document.querySelector("#story-choices");
const storyResponse = document.querySelector("#story-response");
const storyNextButton = document.querySelector("#story-next");
let storyChapterIndex = 0;

function showStoryChapter() {
  const chapter = storyChapters[storyChapterIndex];
  storyArt.textContent = chapter.art;
  storyPrompt.textContent = chapter.prompt;
  storyResponse.textContent = "";
  storyNextButton.hidden = true;
  storyChoices.hidden = false;
  storyChoices.replaceChildren(...chapter.choices.map((choice) => {
    const button = document.createElement("button");
    button.className = "story-choice";
    button.type = "button";
    button.textContent = choice.text;
    button.addEventListener("click", () => {
      const isLastChapter = storyChapterIndex === storyChapters.length - 1;
      storyResponse.textContent = isLastChapter
        ? `${choice.result} The new friends wave goodbye. The end!`
        : choice.result;
      storyChoices.hidden = true;
      storyNextButton.hidden = false;
      storyNextButton.textContent = isLastChapter ? "Tell it again ↻" : "Next part →";
    });
    return button;
  }));
}

storyNextButton.addEventListener("click", () => {
  storyChapterIndex = storyChapterIndex === storyChapters.length - 1 ? 0 : storyChapterIndex + 1;
  showStoryChapter();
});

showStoryChapter();