const questions = [
  { emoji: "🍌", text: "Kulit pisang", answer: "organik" },
  { emoji: "🧴", text: "Botol plastik", answer: "anorganik" },
  { emoji: "🍂", text: "Daun kering", answer: "organik" },
  { emoji: "🥫", text: "Kaleng minuman", answer: "anorganik" },
  { emoji: "🥬", text: "Sisa sayuran", answer: "organik" }
];

let current = 0;
let answered = false;

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const objectEmoji = document.getElementById("objectEmoji");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextButton");
const progressBar = document.getElementById("progressBar");

function loadQuestion() {
  const q = questions[current];
  questionNumber.textContent = `Pertanyaan ${current + 1} dari ${questions.length}`;
  questionText.textContent = q.text;
  objectEmoji.textContent = q.emoji;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.hidden = true;
  answered = false;
  progressBar.style.width = `${((current + 1) / questions.length) * 100}%`;
}

document.querySelectorAll(".answer").forEach(button => {
  button.addEventListener("click", () => {
    if (answered) return;
    answered = true;

    const selected = button.dataset.answer;
    const correct = selected === questions[current].answer;

    if (correct) {
      feedback.textContent = "🎉 Benar! Kamu sudah tahu tempatnya.";
      feedback.classList.add("correct");
    } else {
      const correctName = questions[current].answer === "organik" ? "Si Hijau (organik)" : "Si Biru (anorganik)";
      feedback.textContent = `Belum tepat. Jawaban yang sesuai: ${correctName}.`;
      feedback.classList.add("wrong");
    }

    nextButton.hidden = false;
    nextButton.textContent = current === questions.length - 1
      ? "Lihat Hasil →"
      : "Pertanyaan Berikutnya →";
  });
});

nextButton.addEventListener("click", () => {
  if (current < questions.length - 1) {
    current++;
    loadQuestion();
  } else {
    questionNumber.textContent = "Kuis selesai!";
    questionText.textContent = "Hebat! Terima kasih sudah belajar memilah sampah.";
    objectEmoji.textContent = "♻️";
    document.querySelector(".answer-buttons").style.display = "none";
    feedback.textContent = "Ingat: kenali, pisahkan, lalu masukkan ke tempat yang tepat.";
    feedback.className = "feedback correct";
    nextButton.textContent = "Ulangi Kuis";
    nextButton.onclick = () => {
      current = 0;
      document.querySelector(".answer-buttons").style.display = "grid";
      nextButton.onclick = null;
      loadQuestion();
    };
  }
});

document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("active");
  });
});

loadQuestion();
