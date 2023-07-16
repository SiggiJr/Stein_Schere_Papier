"use strict";

const selectionOptions = document.querySelectorAll(".selection_option");
const roundsCounterContainer = document.querySelector(".rounds_counter_container");
const roundsOptions = document.querySelectorAll("input[name='rounds']");
const roundsOutput = document.querySelector(".rounds_output");
const scoreContainer = document.querySelector(".score_container");
const scoreOutput = document.querySelector(".score");
const textOutputContainer = document.querySelector(".text_output_container");
const selectionContainer = document.querySelector(".selection_container");
const restartBtn = document.querySelector(".restart");
const brunnenBtn = document.querySelector(".brunnen");
console.log(brunnenBtn);

let maxRounds = 0;
let roundsCounter = 0;
let playerScore = 0;
let computerScore = 0;
let gameRunning = false;
let keyInput = "";
let keyInputArray = [];
let konamiCodeActive = false;
let lastKeypress;
let currentKeypress;

const playRound = (event) => {
  if (!gameRunning) {
    startGame();
  }

  roundsCounter++;

  const resultMatrix = preparationPhase(event);

  resultMatrix[2] = resultMatrix[0] - resultMatrix[1];

  circleColor(event, resultMatrix[2], roundsCounter);

  resolutionPhase(resultMatrix);

  updateScoreRounds();

  const gameOver = checkGameOver();

  textOutputContainer.innerHTML = textOutput(
    resultMatrix[0],
    resultMatrix[1],
    resultMatrix[2],
    playerScore,
    computerScore,
    gameOver
  );

  if (gameOver) {
    selectionOptions.forEach((option) => {
      option.removeEventListener("click", playRound);
    });
    brunnenBtn.removeEventListener("click", easyPoint);
  }
};

//# ===== Startet das Spiel =====

const startGame = () => {
  selectMaxRounds();
  roundsCounterContainer.classList.add("hidden");
  roundsOutput.classList.remove("hidden");
  gameRunning = true;
};

const selectMaxRounds = () => {
  roundsOptions.forEach((option) => {
    if (option.checked) {
      maxRounds = Number(option.value);
    }
  });
};

//# ===== gibt User und Comp Auswahl zurück =====

const preparationPhase = (event) => {
  const userChoice = Number(event.target.dataset.value);
  const computerChoice = Math.floor(Math.random() * 3);
  return [userChoice, computerChoice];
};

//# ===== Färbt User Auswahl je nach Rundenausgang =====

const circleColor = (event, result, roundsCounter) => {
  let colorClass = "";
  if (result === 1 || result === -2) {
    event.target.classList.add("win");
    colorClass = "win";
  } else if (result === 2 || result === -1) {
    event.target.classList.add("lose");
    colorClass = "lose";
  } else if (result === 0 && roundsCounter >= 1) {
    event.target.classList.add("draw");
    colorClass = "draw";
  }

  setTimeout(() => {
    event.target.classList.remove(colorClass);
  }, 800);
};

//# ==== Fügt Punkte hinzu =====

const resolutionPhase = (resultMatrix) => {
  if (resultMatrix[2] === 1 || resultMatrix[2] === -2) {
    playerScore++;
  } else if (resultMatrix[2] === 2 || resultMatrix[2] === -1) {
    computerScore++;
  }
};

const updateScoreRounds = () => {
  roundsOutput.textContent = `${roundsCounter} / ${maxRounds}`;

  scoreOutput.textContent = `${playerScore} : ${computerScore}`;
};

//# ===== Überprüft ob das Spiel beendet ist =====

const checkGameOver = () => {
  let gameOver = false;
  if (playerScore > maxRounds / 2 || computerScore > maxRounds / 2 || roundsCounter === maxRounds) {
    gameOver = true;
  }
  return gameOver;
};

//# ===== bestimmt den Text Output =====

const textOutput = (userChoice, computerChoice, result, playerScore, computerScore, gameOver) => {
  let winner;
  let loser;
  let outputHTML;
  let choices = [userChoice, computerChoice];
  let i = 0;
  choices.forEach((choice) => {
    switch (choices[i]) {
      case 0:
        choices[i] = "Stein";
        break;

      case 1:
        choices[i] = "Papier";
        break;
      case 2:
        choices[i] = "Schere";
        break;
    }
    i++;
  });

  if (gameOver && playerScore > computerScore) {
    outputHTML = `<h2>User gewinnt</h2>`;
    scoreContainer.classList.add("win");
  } else if (gameOver && playerScore < computerScore) {
    outputHTML = `<h2>Computer gewinnt</h2>`;
    scoreContainer.classList.add("lose");
  } else if (gameOver && playerScore === computerScore) {
    outputHTML = `<h2>Unentschieden</h2>`;
    scoreContainer.classList.add("draw");
  } else if (result === -2 || result === 1) {
    winner = "User";
    loser = "Comp";
    outputHTML = `<h2>${choices[0]}<sup>${winner}</sup> schlägt ${choices[1]}<sup>${loser}</sup></h2>`;
  } else if (result === 2 || result === -1) {
    winner = "Comp";
    loser = "User";
    outputHTML = `<h2>${choices[1]}<sup>${winner}</sup> schlägt ${choices[0]}<sup>${loser}</sup></h2>`;
  } else if (result === 0) {
    outputHTML = `<h2>Unentschieden</h2>`;
  }
  return outputHTML;
};

//# ===== Reset-Btn =====

const resetBtn = () => {
  roundsCounter = 0;
  playerScore = 0;
  computerScore = 0;
  scoreOutput.textContent = `${playerScore} : ${computerScore}`;
  scoreContainer.classList = "score_container";

  roundsCounterContainer.classList.remove("hidden");
  roundsOutput.classList.add("hidden");
  gameRunning = false;

  roundsOptions.forEach((option) => {
    if (option.value === "5") {
      option.checked = true;
    }
  });

  textOutputContainer.innerHTML = "<h2>Let's play</h2>";

  selectionOptions.forEach((option) => {
    option.addEventListener("click", playRound);
  });

  if (konamiCode) {
    brunnenBtn.addEventListener("click", easyPoint);
  }
};

//# ===== Konami Code =====

const easyPoint = (event) => {
  if (!gameRunning) {
    startGame();
  }
  roundsCounter++;
  playerScore++;
  circleColor(event, 1, roundsCounter);
  updateScoreRounds();
  const gameOver = checkGameOver();

  if (gameOver) {
    selectionOptions.forEach((option) => {
      option.removeEventListener("click", playRound);
    });
    brunnenBtn.removeEventListener("click", easyPoint);
  }
  if (!gameOver) {
    textOutputContainer.innerHTML = "<h2>User bekommt einen Punkt</h2>";
  } else if (gameOver && playerScore > computerScore) {
    textOutputContainer.innerHTML = `<h2>User gewinnt</h2>`;
    scoreContainer.classList.add("win");
  } else if (gameOver && playerScore < computerScore) {
    textOutputContainer.innerHTML = `<h2>Computer gewinnt</h2>`;
    scoreContainer.classList.add("lose");
  } else if (gameOver && playerScore === computerScore) {
    textOutputContainer.innerHTML = `<h2>Unentschieden</h2>`;
    scoreContainer.classList.add("draw");
  }
};

const konamiCode = (event) => {
  currentKeypress = Date.now();

  if (currentKeypress - lastKeypress > 5000) {
    keyInputArray = [];
  }
  keyInputArray.push(event.key);
  keyInput = keyInputArray.join(",");

  if (
    keyInput.includes("ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a,Enter") &&
    !konamiCodeActive
  ) {
    konamiCodeActive = true;
    brunnenBtn.classList.remove("hidden");
    keyInputArray = [];
  } else if (
    keyInput.includes("ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a,Enter") &&
    konamiCodeActive
  ) {
    konamiCodeActive = false;
    brunnenBtn.classList.add("hidden");
    keyInputArray = [];
  }
  lastKeypress = Date.now();
};

selectionOptions.forEach((option) => {
  option.addEventListener("click", playRound);
});

restartBtn.addEventListener("click", resetBtn);

brunnenBtn.addEventListener("click", easyPoint);

document.body.addEventListener("keydown", konamiCode);
