const revealLink = document.querySelector(".primary-link");
const littleMagic = document.querySelector("#little-magic");
const littleNote = document.querySelector("#little-note");
const footer = document.querySelector(".footer");
const magicDialog = document.querySelector(".magic-dialog");
const magicScene = document.querySelector(".magic-scene");
const letterDialog = document.querySelector(".letter-dialog");
const writingDialog = document.querySelector(".writing-dialog");
const pageTransition = document.querySelector(".page-transition");
const pageTransitionCurtain = document.querySelector(".page-transition-curtain");
const pageTransitionHearts = document.querySelector(".page-transition-hearts");
const closingFrame = document.querySelector(".closing-frame");
const backgroundMusic = document.querySelector("#background-music");
const backgroundMusicToggle = document.querySelector("#background-music-toggle");
const letterText = document.querySelector("#letter-text");
const writingStatus = document.querySelector(".writing-status");
const letterStorageKey = "safa-garden-letter-v2";
const defaultLetterText = `Dear Safa,

Hai cantik, gimana hari kamu ? hope u doin well yaa. First of all aku mau minta maaf karna selalu overthink dan punya perasaan untuk selalu sama kamu. I really love u deep in my heart. Perasaan aku, cinta aku, hati aku, pikiran aku gapernah berenti untuk memvisualisasikan diri kamu. May all good thing's come to u tapi lewat aku aja ya jangan lewat cowo lain hehe.

Semoga lekas sembuh yaa, hati nya, pikirannya, fisiknya. Aku selalu ada disini dan selalu ada buat kamu apapun yang diperlukan aku akan provide segalanya buat kamu.

Kalau kamu sedih, senang, bahagia, marah, kesel, apapun perasaan dan mood kamu tolong untuk komunikasiin dan pulang ke aku yaa ? peluk, rangkul, genggam aku seperti kamu pulang kerumah.

Maafin aku yaa atas segala kekurangan, keburukan, atau ganggu nya aku di hidup kamu. I always try to be the best for u dan semoga aku selalu berhasil akan hal itu. Maafin aku juga buat segala mood dan sifat aku yang kurang bagus dan kurang mengenakan diri kamu. Maafin aku juga ya kalau terkadang aku masi belum bisa ngertiin kamu sepenuhnya.

Aku Sayang Kamu, Safa

Warm, Samuel.

Kalau emang dunia kasih aku kesempatan, aku mau jalan di jalan dan keyakinan yang sama untuk ikut kamu dan hidup sama kamu lebih lama lagi.`;
const flowerAndButterflies = ["🦋", "🌸", "🌼", "🌺", "🌷", "💐", "🌻", "🪷"];
const bouquetFlowers = [
  { x: 50, size: 112, bottom: 48, layer: 5, lean: 0, featured: true },
  { x: 34, size: 90, bottom: 45, layer: 4, lean: 10 },
  { x: 66, size: 90, bottom: 45, layer: 4, lean: -10 },
  { x: 26, size: 68, bottom: 16, layer: 3, lean: -6, outer: true },
  { x: 42, size: 68, bottom: 16, layer: 3, lean: -2 },
  { x: 58, size: 68, bottom: 16, layer: 3, lean: 2 },
  { x: 74, size: 68, bottom: 16, layer: 3, lean: 6, outer: true },
];

const flowerStage = document.querySelector(".flower-stage");
bouquetFlowers.forEach(({ x, size, bottom, layer, lean, featured, outer }, index) => {
  const flower = document.createElement("div");
  flower.className = `flower${featured ? " featured" : ""}${outer ? " outer" : ""}`;
  flower.setAttribute("role", "button");
  flower.setAttribute("tabindex", "0");
  flower.setAttribute("aria-label", "Bunga matahari kecil, klik untuk kejutan");
  flower.style.setProperty("--x", `${x}%`);
  flower.style.setProperty("--size", `${size}px`);
  flower.style.setProperty("--bottom", `${bottom}px`);
  flower.style.setProperty("--stem-length", `${Math.max(28, bottom + size * 2.03 - 120)}px`);
  flower.style.setProperty("--layer", layer);
  flower.style.setProperty("--lean", `${lean}deg`);
  flower.style.setProperty("--bloom-index", index);
  flower.innerHTML = '<div class="flower-back"></div><div class="flower-center"></div><div class="stem"></div><i class="leaf left"></i><i class="leaf right"></i>';
  flowerStage.append(flower);
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const meadow = document.querySelector(".meadow");
const meadowFlowers = [
  { x: 7, size: 37, height: 110 },
  { x: 21, size: 46, height: 145 },
  { x: 37, size: 34, height: 98 },
  { x: 51, size: 50, height: 156 },
  { x: 66, size: 36, height: 112 },
  { x: 81, size: 44, height: 137 },
  { x: 94, size: 34, height: 99 },
];
meadowFlowers.forEach(({ x, size, height }, index) => {
  const flower = document.createElement("span");
  flower.className = "meadow-flower";
  flower.style.setProperty("--x", `${x}%`);
  flower.style.setProperty("--size", `${size}px`);
  flower.style.setProperty("--plant-height", `${height}px`);
  flower.style.setProperty("--sway-delay", `${-index * .43}s`);
  flower.innerHTML = '<span class="meadow-stem"></span><span class="meadow-leaf left"></span><span class="meadow-leaf right"></span><span class="meadow-bloom"><span class="meadow-center"></span></span>';
  for (let petalIndex = 0; petalIndex < 12; petalIndex += 1) {
    const petal = document.createElement("span");
    petal.className = "meadow-petal";
    petal.style.transform = `translateX(-50%) rotate(${petalIndex * 30}deg)`;
    flower.querySelector(".meadow-bloom").append(petal);
  }
  meadow.append(flower);
});

const gardenButterflies = [];
let butterflyRunId = 0;
const butterflyTransform = (x, y, angle, scale = 1) =>
  `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const butterflyLandingPoint = (flower) => {
  const meadowBounds = meadow.getBoundingClientRect();
  const bloomBounds = flower.querySelector(".meadow-bloom").getBoundingClientRect();
  const scale = meadowBounds.width / meadow.offsetWidth;
  return {
    x: (bloomBounds.left + bloomBounds.width * .8 - meadowBounds.left) / scale,
    y: (bloomBounds.top + bloomBounds.height * .3 - meadowBounds.top) / scale,
  };
};

const flyButterfly = async (butterfly, runId, start, flower) => {
  const end = butterflyLandingPoint(flower);
  const direction = end.x >= start.x ? 1 : -1;
  const control = {
    x: (start.x + end.x) / 2,
    y: Math.max(12, Math.min(start.y, end.y) - 65),
  };
  const angle = direction * 13;
  const endTransform = butterflyTransform(end.x, end.y, angle, .82);
  const animation = butterfly.element.animate([
    { transform: butterflyTransform(start.x, start.y, -angle, .8) },
    { transform: butterflyTransform(control.x, control.y, angle, 1.08), offset: .48 },
    { transform: endTransform },
  ], {
    duration: 1500 + Math.random() * 600,
    easing: "ease-in-out",
    fill: "forwards",
  });
  butterfly.animation = animation;
  try {
    await animation.finished;
  } catch (error) {
    if (animation.playState !== "idle") throw error;
    return null;
  }
  if (runId !== butterflyRunId) return null;

  butterfly.position = end;
  butterfly.element.style.transform = endTransform;
  animation.cancel();
  butterfly.animation = null;
  butterfly.element.classList.add("is-perched");
  await wait(1200 + Math.random() * 900);
  butterfly.element.classList.remove("is-perched");
  return end;
};

const animateButterfly = async (butterfly, runId, flowers) => {
  let position = {
    x: meadow.clientWidth * (butterfly.index === 0 ? .03 : .97),
    y: meadow.clientHeight * (butterfly.index === 0 ? .44 : .57),
  };
  let previousFlower = null;

  while (runId === butterflyRunId && !reducedMotion.matches) {
    if (document.hidden) {
      await wait(300);
      continue;
    }

    const destinations = flowers.filter((flower) => flower !== previousFlower);
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    const landing = await flyButterfly(butterfly, runId, position, destination);
    if (!landing) return;
    position = landing;
    previousFlower = destination;
  }
};

const stopGardenButterflies = () => {
  butterflyRunId += 1;
  gardenButterflies.forEach(({ animation, element }) => {
    animation?.cancel();
    element.remove();
  });
  gardenButterflies.length = 0;
};

const startGardenButterflies = () => {
  stopGardenButterflies();
  if (reducedMotion.matches) return;

  const flowers = [...meadow.querySelectorAll(".meadow-flower")];
  for (let index = 0; index < 2; index += 1) {
    const element = document.createElement("span");
    element.className = "garden-butterfly";
    element.innerHTML = '<span class="butterfly-wings">🦋</span>';
    element.setAttribute("aria-hidden", "true");
    meadow.append(element);
    const butterfly = { element, index, animation: null };
    gardenButterflies.push(butterfly);
    animateButterfly(butterfly, butterflyRunId, flowers);
  }
};
startGardenButterflies();
document.addEventListener("visibilitychange", () => {
  gardenButterflies.forEach(({ animation }) => {
    if (!animation) return;
    if (document.hidden) animation.pause();
    else animation.play();
  });
});
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) stopGardenButterflies();
  else startGardenButterflies();
});

const loveSymbols = ["💖", "💗", "💕", "💘", "🌸", "🌼", "🌺", "🌻", "🌷", "🪷"];
const maxLoveParticles = 24;
let loveParticleTimer;

const releaseLoveParticle = () => {
  if (document.hidden || reducedMotion.matches) return;
  if (document.querySelectorAll(".love-particle").length >= maxLoveParticles) return;

  const flowers = [...flowerStage.querySelectorAll(".flower")];
  const flower = flowers[Math.floor(Math.random() * flowers.length)];
  const bloom = flower.querySelector(".flower-back").getBoundingClientRect();
  const particle = document.createElement("span");
  particle.className = "love-particle";
  particle.textContent = loveSymbols[Math.floor(Math.random() * loveSymbols.length)];
  particle.setAttribute("aria-hidden", "true");
  particle.style.setProperty("--start-x", `${bloom.left + bloom.width / 2}px`);
  particle.style.setProperty("--start-y", `${bloom.top + bloom.height / 2}px`);
  particle.style.setProperty("--particle-color", `hsl(${Math.floor(Math.random() * 360)} 72% 58%)`);
  particle.style.setProperty("--particle-size", `${16 + Math.random() * 14}px`);
  particle.style.setProperty("--particle-duration", `${3.8 + Math.random() * 1.8}s`);
  particle.style.setProperty("--drift", `${Math.round(Math.random() * 150 - 75)}px`);
  particle.style.setProperty("--rise", `${-220 - Math.random() * 220}px`);
  particle.style.setProperty("--turn", `${Math.round(Math.random() * 70 - 35)}deg`);
  document.body.append(particle);
  particle.addEventListener("animationend", () => particle.remove(), { once: true });
};

const stopLoveParticles = () => {
  window.clearInterval(loveParticleTimer);
  document.querySelectorAll(".love-particle").forEach((particle) => particle.remove());
};
const startLoveParticles = () => {
  stopLoveParticles();
  if (reducedMotion.matches) return;
  loveParticleTimer = window.setInterval(releaseLoveParticle, 300);
};
startLoveParticles();
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopLoveParticles();
  else startLoveParticles();
});
reducedMotion.addEventListener("change", startLoveParticles);

const finishPageEntrance = () => {
  document.body.classList.remove("page-entering");
};
flowerStage.lastElementChild.addEventListener("animationend", finishPageEntrance, { once: true });

revealLink.addEventListener("click", (event) => {
  event.preventDefault();
  littleMagic.hidden = false;
  littleMagic.classList.add("is-revealing");
  littleMagic.querySelector(".moment-card").addEventListener("animationend", () => {
    littleMagic.classList.remove("is-revealing");
  }, { once: true });
  littleMagic.scrollIntoView({ behavior: "smooth" });
});

for (let index = 0; index < 48; index += 1) {
  const particle = document.createElement("span");
  particle.className = "magic-particle";
  particle.textContent = flowerAndButterflies[index % flowerAndButterflies.length];
  particle.setAttribute("aria-hidden", "true");
  particle.style.setProperty("--x", `${Math.random() * 100}%`);
  particle.style.setProperty("--size", `${20 + Math.random() * 25}px`);
  particle.style.setProperty("--duration", `${7 + Math.random() * 7}s`);
  particle.style.setProperty("--delay", `${-Math.random() * 14}s`);
  particle.style.setProperty("--drift", `${Math.round(Math.random() * 160 - 80)}px`);
  particle.style.setProperty("--hue", `${Math.round(Math.random() * 300)}deg`);
  magicScene.append(particle);
}

document.querySelector("#open-magic").addEventListener("click", () => {
  magicDialog.showModal();
});
document.querySelector(".magic-next").addEventListener("click", () => {
  magicDialog.close();
});
magicDialog.addEventListener("close", () => {
  littleNote.hidden = false;
  footer.hidden = false;
  littleNote.classList.add("is-revealing");
  footer.classList.add("is-revealing");
  littleNote.querySelector(".moment-card").addEventListener("animationend", () => {
    littleNote.classList.remove("is-revealing");
  }, { once: true });
  footer.addEventListener("animationend", () => {
    footer.classList.remove("is-revealing");
  }, { once: true });
  littleNote.scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#open-letter").addEventListener("click", () => {
  letterDialog.showModal();
});
const letterEnvelope = document.querySelector(".letter-envelope");
letterEnvelope.addEventListener("click", (event) => {
  if (event.target.closest(".letter-paper") && letterDialog.classList.contains("is-opening")) {
    writingStatus.textContent = "";
    writingDialog.showModal();
    letterText.setSelectionRange(0, 0);
    letterText.focus({ preventScroll: true });
    letterText.scrollTop = 0;
    return;
  }
  if (letterDialog.classList.contains("is-opening")) return;
  letterDialog.classList.add("is-opening");
  letterEnvelope.setAttribute("aria-expanded", "true");
});
document.querySelector(".letter-close").addEventListener("click", () => {
  letterDialog.close();
});
letterDialog.addEventListener("click", (event) => {
  if (event.target === letterDialog) letterDialog.close();
});
letterDialog.addEventListener("close", () => {
  letterDialog.classList.remove("is-opening");
  letterEnvelope.setAttribute("aria-expanded", "false");
});

try {
  letterText.value = window.localStorage.getItem(letterStorageKey) ?? defaultLetterText;
} catch (error) {
  letterText.value = defaultLetterText;
  writingStatus.textContent = "Could not load a saved letter in this browser.";
}
document.querySelector(".writing-dismiss").addEventListener("click", () => {
  writingDialog.close();
});
const updateMusicToggle = () => {
  const isPlaying = !backgroundMusic.paused;
  backgroundMusicToggle.setAttribute("aria-label", isPlaying ? "Pause song" : "Play song");
  backgroundMusicToggle.setAttribute("aria-pressed", String(isPlaying));
  backgroundMusicToggle.querySelector(".music-toggle-label").textContent = isPlaying ? "Pause song" : "Play song";
  closingFrame.contentWindow.postMessage({ type: "music-state", playing: isPlaying }, "*");
};
const playBackgroundMusic = () => {
  backgroundMusic.play().catch((error) => {
    updateMusicToggle();
    if (error.name !== "AbortError") {
      console.error("Could not start the background music.", error);
    }
  });
};
const toggleBackgroundMusic = () => {
  if (backgroundMusic.paused) {
    playBackgroundMusic();
  } else {
    backgroundMusic.pause();
  }
};
backgroundMusicToggle.addEventListener("click", toggleBackgroundMusic);
backgroundMusic.addEventListener("play", updateMusicToggle);
backgroundMusic.addEventListener("pause", updateMusicToggle);
window.addEventListener("message", (event) => {
  if (event.data?.type === "music-toggle") toggleBackgroundMusic();
  if (event.data?.type === "music-state-request") updateMusicToggle();
});
closingFrame.addEventListener("load", () => {
  closingFrame.contentWindow.postMessage({ type: "music-state-request" }, "*");
});
const setMusicStartTime = () => {
  if (backgroundMusic.duration > 50) {
    backgroundMusic.currentTime = 50;
  } else {
    console.error("The background music is shorter than 00:50.");
  }
};
if (backgroundMusic.readyState >= HTMLMediaElement.HAVE_METADATA) {
  setMusicStartTime();
} else {
  backgroundMusic.addEventListener("loadedmetadata", setMusicStartTime, { once: true });
}
playBackgroundMusic();
writingDialog.addEventListener("click", (event) => {
  if (event.target === writingDialog) writingDialog.close();
});
writingDialog.addEventListener("close", () => {
  if (pageTransition.open) return;
  if (letterDialog.open) letterDialog.close();

  for (let index = 0; index < 28; index += 1) {
    const heart = document.createElement("span");
    heart.className = "page-transition-heart";
    heart.textContent = "♥";
    heart.style.left = `${(index * 37) % 96}%`;
    heart.style.fontSize = `${20 + (index % 4) * 9}px`;
    heart.style.setProperty("--fall-delay", `${(index % 6) * 90}ms`);
    heart.style.setProperty("--fall-duration", `${1900 + (index % 4) * 180}ms`);
    pageTransitionHearts.append(heart);
  }

  pageTransition.showModal();
});
pageTransition.addEventListener("cancel", (event) => {
  event.preventDefault();
});
pageTransitionCurtain.addEventListener("animationend", () => {
  pageTransition.classList.add("is-finished");
}, { once: true });

document.querySelectorAll(".flower").forEach((flower) => {
  const petals = flower.querySelector(".flower-back");
  for (let index = 0; index < 12; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.transform = `translateX(-50%) rotate(${index * 30}deg)`;
    petals.append(petal);
  }

  const sprinkle = (event) => {
    const bounds = flower.getBoundingClientRect();
    const x = event.clientX || bounds.left + bounds.width / 2;
    const y = event.clientY || bounds.top + bounds.height / 3;
    ["✿", "✦", "🌼", "✧"].forEach((symbol, index) => {
      const bit = document.createElement("span");
      bit.className = "petal-pop";
      bit.textContent = symbol;
      bit.style.left = `${x + (index - 1.5) * 13}px`;
      bit.style.top = `${y}px`;
      bit.style.setProperty("--dx", `${(index - 1.5) * 30}px`);
      document.body.append(bit);
      bit.addEventListener("animationend", () => bit.remove(), { once: true });
    });
  };
  flower.addEventListener("click", sprinkle);
  flower.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      sprinkle(event);
    }
  });
});
