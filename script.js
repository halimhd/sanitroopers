// ===============================
// PETUALANGAN PILAH SAMPAH
// File ini sengaja dibuat sederhana agar mudah diedit di GitHub.
// ===============================

// ---------- Menu mobile ----------
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle?.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// ---------- Text-to-speech ----------
document.querySelectorAll(".listen-btn").forEach(button => {
  button.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      alert("Fitur suara belum didukung oleh browser ini.");
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(button.dataset.speech);
    speech.lang = "id-ID";
    speech.rate = 0.95;
    window.speechSynthesis.speak(speech);
  });
});

// ---------- GAME PILAH SAMPAH ----------
const trashItems = [
  { emoji: "🍌", name: "Kulit pisang", type: "organic" },
  { emoji: "🍂", name: "Daun kering", type: "organic" },
  { emoji: "🍎", name: "Sisa apel", type: "organic" },
  { emoji: "🍚", name: "Sisa nasi", type: "organic" },
  { emoji: "🥬", name: "Sisa sayuran", type: "organic" },
  { emoji: "🥤", name: "Gelas plastik", type: "inorganic" },
  { emoji: "🧴", name: "Botol plastik", type: "inorganic" },
  { emoji: "🥫", name: "Kaleng minuman", type: "inorganic" },
  { emoji: "🛍️", name: "Kantong plastik", type: "inorganic" },
  { emoji: "📦", name: "Kemasan kardus", type: "inorganic" }
];

const scoreEl = document.querySelector("#score");
const streakEl = document.querySelector("#streak");
const timerEl = document.querySelector("#timer");
const trashEl = document.querySelector("#trash-item");
const trashNameEl = document.querySelector("#trash-name");
const messageEl = document.querySelector("#game-message");
const startBtn = document.querySelector("#start-game");
const restartBtn = document.querySelector("#restart-game");
const progressBar = document.querySelector("#progress-bar");
const binButtons = document.querySelectorAll(".game-bin");

let score = 0;
let streak = 0;
let timeLeft = 45;
let currentTrash = null;
let gameTimer = null;
let playing = false;
let totalAnswered = 0;

function randomTrash() {
  return trashItems[Math.floor(Math.random() * trashItems.length)];
}

function showTrash() {
  currentTrash = randomTrash();
  trashEl.textContent = currentTrash.emoji;
  trashNameEl.textContent = currentTrash.name;
}

function updateGameUI() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  timerEl.textContent = timeLeft;
  progressBar.style.width = `${(timeLeft / 45) * 100}%`;
}

function startGame() {
  score = 0;
  streak = 0;
  timeLeft = 45;
  totalAnswered = 0;
  playing = true;
  startBtn.classList.add("hidden");
  restartBtn.classList.add("hidden");
  messageEl.textContent = "Pilih tempat sampah yang benar! 🌱";
  showTrash();
  updateGameUI();

  clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    timeLeft--;
    updateGameUI();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(gameTimer);
  playing = false;
  progressBar.style.width = "0%";
  messageEl.innerHTML = `⏰ Waktu habis! Skormu <b>${score}</b> dengan streak terbaik <b>${streak}</b>.`;
  restartBtn.classList.remove("hidden");
  binButtons.forEach(btn => btn.disabled = true);
}

function answerBin(selectedType, button) {
  if (!playing || !currentTrash) return;

  const correct = selectedType === currentTrash.type;
  button.classList.remove("correct", "wrong");
  void button.offsetWidth;
  button.classList.add(correct ? "correct" : "wrong");

  if (correct) {
    score += 10 + Math.min(streak * 2, 20);
    streak++;
    totalAnswered++;
    messageEl.textContent = ["Mantap! 🎉", "Benar! Kamu hebat! ⭐", "Tepat sekali! 🌱", "Pilahannya benar! ♻️"][Math.floor(Math.random() * 4)];
    setTimeout(() => {
      button.classList.remove("correct");
      if (playing) showTrash();
    }, 300);
  } else {
    score = Math.max(0, score - 5);
    streak = 0;
    messageEl.textContent = `Ups! ${currentTrash.name} termasuk ${currentTrash.type === "organic" ? "ORGANIK 🟢" : "ANORGANIK 🔵"}.`;
    setTimeout(() => button.classList.remove("wrong"), 350);
  }
  updateGameUI();
}

binButtons.forEach(button => {
  button.addEventListener("click", () => answerBin(button.dataset.bin, button));
});

// Keyboard support: tekan Enter/Space saat item aktif untuk memulai/menyegarkan fokus.
trashEl.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (!playing) startGame();
  }
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  binButtons.forEach(btn => btn.disabled = false);
  startGame();
});

updateGameUI();

// ---------- KUIS ----------
const quizQuestions = [
  {
    q: "Kulit pisang sebaiknya masuk ke tempat sampah...",
    options: ["Si Hijau / Organik", "Si Biru / Anorganik", "Tidak perlu dipilah"],
    answer: 0,
    explanation: "Benar! Kulit pisang berasal dari makhluk hidup dan termasuk sampah organik."
  },
  {
    q: "Manakah yang termasuk sampah anorganik?",
    options: ["Daun kering", "Sisa nasi", "Botol plastik"],
    answer: 2,
    explanation: "Benar! Botol plastik termasuk sampah anorganik."
  },
  {
    q: "Apa manfaat memilah sampah dari sumbernya?",
    options: ["Memudahkan pengelolaan dan pengolahan sampah", "Membuat sampah semakin banyak", "Membuat semua sampah tercampur"],
    answer: 0,
    explanation: "Tepat! Pemilahan dari sumber membantu sampah dikelola sesuai jenisnya."
  }
];

let quizIndex = 0;
let quizScore = 0;
const questionNumber = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const answersEl = document.querySelector("#answers");
const feedbackEl = document.querySelector("#quiz-feedback");
const nextQuestion = document.querySelector("#next-question");
const quizProgress = document.querySelector("#quiz-progress");

function renderQuestion() {
  const item = quizQuestions[quizIndex];
  questionNumber.textContent = `Pertanyaan ${quizIndex + 1} dari ${quizQuestions.length}`;
  questionText.textContent = item.q;
  answersEl.innerHTML = "";
  feedbackEl.textContent = "";
  nextQuestion.classList.add("hidden");
  quizProgress.style.width = `${(quizIndex / quizQuestions.length) * 100}%`;

  item.options.forEach((option, i) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = option;
    button.addEventListener("click", () => chooseAnswer(i));
    answersEl.appendChild(button);
  });
}

function chooseAnswer(selected) {
  const item = quizQuestions[quizIndex];
  const buttons = [...answersEl.children];
  buttons.forEach(btn => btn.disabled = true);

  if (selected === item.answer) {
    quizScore++;
    buttons[selected].classList.add("correct");
    feedbackEl.textContent = "🎉 " + item.explanation;
  } else {
    buttons[selected].classList.add("wrong");
    buttons[item.answer].classList.add("correct");
    feedbackEl.textContent = "💡 " + item.explanation;
  }

  quizProgress.style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
  nextQuestion.classList.remove("hidden");
  nextQuestion.textContent = quizIndex === quizQuestions.length - 1 ? "🏁 Lihat Hasil" : "Pertanyaan Berikutnya →";
}

nextQuestion.addEventListener("click", () => {
  if (quizIndex < quizQuestions.length - 1) {
    quizIndex++;
    renderQuestion();
  } else {
    questionNumber.textContent = "Kuis selesai!";
    questionText.textContent = `Skormu ${quizScore} dari ${quizQuestions.length} 🌟`;
    answersEl.innerHTML = `<p style="text-align:center;color:#5d6e68">Hebat! Coba ulangi kuis untuk mendapatkan skor penuh.</p>`;
    feedbackEl.textContent = quizScore === quizQuestions.length
      ? "🏆 Semua benar! Kamu siap menjadi Pahlawan Sampah!"
      : "🌱 Tidak apa-apa. Baca bagian Belajar lalu coba lagi.";
    nextQuestion.textContent = "🔄 Ulangi Kuis";
    nextQuestion.onclick = () => {
      quizIndex = 0;
      quizScore = 0;
      nextQuestion.onclick = null;
      renderQuestion();
    };
  }
});

renderQuestion();
