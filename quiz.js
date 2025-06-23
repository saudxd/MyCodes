const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("btn");
const timerDisplay = document.getElementById("timer");
const ques = document.getElementById("ques");
let Questions = [];
let currQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;

// Handle Start Button Click
startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";       // Hide start button
    submitBtn.style.display = "inline";    // Show submit button
    timerDisplay.style.display = "block";  // Show timer
    fetchQuestions();                      // Start quiz
});

// Fetch quiz questions
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) throw new Error("Unable to fetch data");
        const data = await response.json();
        Questions = data.results;
        loadQues();
    } catch (error) {
        console.log(error);
        ques.innerHTML = `<h5>${error.message}</h5>`;
    }
}

// Load each question
function loadQues() {
    if (Questions.length === 0) {
        ques.innerHTML = `<h5 style="color: red;">Unable to fetch data. Please try again!</h5>`;
        return;
    }

    startTimer(); // Start 30s timer

    let questionText = Questions[currQuestion].question
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

    ques.innerText = questionText;

    const opt = document.getElementById("opt");
    opt.innerHTML = "";

    const correct = Questions[currQuestion].correct_answer;
    const incorrect = Questions[currQuestion].incorrect_answers;
    const options = [correct, ...incorrect].sort(() => Math.random() - 0.5);

    options.forEach((option) => {
        const div = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");

        input.type = "radio";
        input.name = "answer";
        input.value = option;
        label.textContent = option;

        div.appendChild(input);
        div.appendChild(label);
        opt.appendChild(div);
    });
}

// Timer per question
function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up!");
            nextQuestion();
        }
    }, 1000);
}

// Load score and answers
function loadScore() {
    timerDisplay.style.display = "none";
    submitBtn.style.display = "none";
    const totalScore = document.getElementById("score");
    totalScore.innerHTML = `<p>You scored ${score} out of ${Questions.length}</p>`;
    totalScore.innerHTML += `<h3>Correct Answers:</h3>`;
    Questions.forEach((q, i) => {
        totalScore.innerHTML += `<p>${i + 1}. ${q.correct_answer}</p>`;
    });
}

// Next question
function nextQuestion() {
    clearInterval(timer);
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").remove();
        ques.remove();
        submitBtn.remove();
        loadScore();
    }
}

// Check selected answer
function checkAns() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        if (selected.value === Questions[currQuestion].correct_answer) score++;
        nextQuestion();
    } else {
        alert("Please select an answer.");
    }
}
