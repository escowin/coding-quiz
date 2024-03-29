// variables
const quizContainerEl = document.getElementById("quiz-container");
const rulesContainerEl = document.getElementById("rules-container");
const startButtonEl = document.getElementById("start-button");
const timerEl = document.getElementById("timer");
const questionContainerEl = document.createElement("section");
const questionEl = document.createElement("h2");

let currentQuestionIndex = 0;
let points = 0;
let scoreboard = [];
let initials = "";
let time = questions.length * 10;
let timer;

// functions
function currentYear() {
  year = new Date().getFullYear();
  const yearEl = document.getElementById("year");
  yearEl.innerText = year;

  console.log(`
  \u00a9 ${year} Edwin M. Escobar
  https://github.com/escowin/coding-quiz
  `);
}

// quiz functions
function startQuiz() {
  // remove #rules-container from dom
  quizContainerEl.innerHTML = "";

  // create & post #question-container in its place
  questionContainerEl.setAttribute("id", "question-container");
  questionContainerEl.className = "container";
  quizContainerEl.appendChild(questionContainerEl);

  // randomize the questions array; pass the random array as an argument
  let random = questions.sort(() => Math.random() - 0.5);
  getQuestion(random);

  // start the countdown timer
  countdownTimer(time);
  timer = setInterval(countdownTimer, 1000);
}

// quiz timer
function countdownTimer() {
  time;
  time--;
  
  time >= 10
    ? (timerEl.textContent = `${time}s`)
    : time < 10 && time >= 0
    ? (timerEl.textContent = `0${time}s`)
    : endQuiz(points);
}

// - get the current question from questions array
function getQuestion(random) {
  // current question & its corresponding answers
  let question = random[currentQuestionIndex].question;
  let answers = random[currentQuestionIndex].answers;

  // displays question
  questionEl.setAttribute("id", "question");
  questionEl.className = "container";
  questionEl.textContent = question;

  // displays available answers
  let answersEl = document.createElement("div");
  answersEl.setAttribute("id", "answers");
  answersEl.className = "container";

  questionContainerEl.appendChild(questionEl);
  questionContainerEl.appendChild(answersEl);

  // iterate through answers index; display each index
  for (let i = 0; i < answers.length; i++) {
    let answer = answers[i].choice;
    let correct = answers[i].correct;

    const answerEl = document.createElement("p");
    answerEl.setAttribute("data-correct", correct);
    answerEl.className = "answer";
    answerEl.textContent = `${i + 1}. ${answer}`;

    answersEl.appendChild(answerEl);

    // selecting an answer
    answerEl.addEventListener("click", () => {
      const choice = answerEl.getAttribute("data-correct");

      // button flashes green; add a point
      if (choice === "true") {
        quizContainerEl.className = "container correct";
        points++;
      } else {
        // button flashes red;
        quizContainerEl.className = "container incorrect";
      }
      nextQuestion(random);
    });
  }
}

// logic.next-question | clears out previous html; increases the index number; runs getQuestion again to display the next question in this array.
function nextQuestion(random) {
  questionContainerEl.innerHTML = "";
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
  } else {
    getQuestion(random);
  }
}

// logic.end-quiz | removes question container; allows user to save score
function endQuiz() {
  clearInterval(timer);
  timerEl.textContent = "---";
  timerEl.className = "clear";
  quizContainerEl.className = "container";
  quizContainerEl.innerHTML = "";

  //   undim scoreboardBtn; if user clicks the button, run displayScoreboard
  const scoreboardBtn = document.getElementById("scoreboard-btn");
  scoreboardBtn.className = "button btn-active";
  saveScore();
}

function saveScore() {
  const saveFormEl = document.createElement("form");
  saveFormEl.setAttribute("id", "save-form");
  saveFormEl.className = "container";
  saveFormEl.innerHTML = `
  <h2 class='subheader'>Game fin.</h2>
  <div id='initials-container'>
    <label for='initials'>Initials</label>
    <input type='text' name='name' id='initials-input' required placeholder="AA">
    <p id='points'>${points}pts</p>
  </div>
  <button type='submit' class='button active' id='save-button'>save</button>
  `;
  quizContainerEl.appendChild(saveFormEl);

  saveFormEl.addEventListener("submit", formSubmitHandler);
}

function formSubmitHandler(event) {
  event.preventDefault();
  const initialsInputEl = document.getElementById("initials-input");
  console.log(initialsInputEl.value);
  let score = points;
  initials = initialsInputEl.value.trim();

  // if (initials !== '' {
  //   const highscores = JSON.parse(localStorage.getItem("score")) || [];
  // })

  scoreboard.push({ initials, score });
  // localStorage.setItem('initials', initials);
  displayScoreboard();
}

function displayScoreboard() {
  quizContainerEl.innerHTML = "";

  const scoreboardEl = document.createElement("section");

  scoreboardEl.setAttribute("id", "scoreboard");
  scoreboardEl.className = "container";

  const scoreboardHeaderEl = document.createElement("article");
  scoreboardHeaderEl.setAttribute("id", "scoreboard-header");
  scoreboardHeaderEl.innerHTML = `<h2>High scores</h2>
  <p class='rank'>Rank
  <p>Initials</p>
  <p class='score'>Score</p>`;

  scoreboardEl.appendChild(scoreboardHeaderEl);
  for (let i = 0; i < scoreboard.length; i++) {
    let rank = i + 1;

    const savedScoredEl = document.createElement("div");
    savedScoredEl.className = "saved-score";
    if (rank < 10) {
      savedScoredEl.innerHTML = `
      <p class='rank'>0${rank}.</p>
      <p class='initials'>${scoreboard[i].initials}</p>
      <p class='score'>${scoreboard[i].score} pts</p>`;
    } else {
      savedScoredEl.innerHTML = `
      <p class='rank'>${rank}</p>
      <p class='initials'>${scoreboard[i].initials}</p>
      <p class='score'>${scoreboard[i].score} pts</p>`;
    }

    scoreboardEl.appendChild(savedScoredEl);
  }

  quizContainerEl.appendChild(scoreboardEl);

  // replay | reset the index & display functional replay button
  currentQuestionIndex = 0;

  const replayButtonEl = document.createElement("button");
  replayButtonEl.setAttribute("id", "replay-button");
  replayButtonEl.className = "button active";
  replayButtonEl.textContent = "play again?";
  replayButtonEl.addEventListener("click", startQuiz);

  quizContainerEl.appendChild(replayButtonEl);

  // populate scoreboard with previous scores pulled from local storage
}

// calls
currentYear();
startButtonEl.addEventListener("click", startQuiz);
