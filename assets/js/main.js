"use strict";

const selectionOptions = document.querySelectorAll(".selection_option");
const RoundsOptions = document.querySelectorAll("input[name='rounds']");
const scoreOutput = document.querySelector(".score");
const roundsCounterContainer = document.querySelector(".rounds_counter_conatiner");
const textOutputContainer = document.querySelector(".text_output_container");
const restartBtn = document.querySelector(".restart");

let maxRounds = 5;
let roundsCounter = 0;
let playerScore = 0;
let computerScore = 0;

const playRound = (event) => {
  const userChoice = Number(event.target.dataset.value);
  const computerChoice = Math.floor(Math.random() * 3);

  const result = userChoice - computerChoice;

  if (result === 1 || result === -2) {
    playerScore++;
  } else if (result === 2 || result === -1) {
    computerScore++;
  }
  roundsCounter++;

  roundsCounterContainer.textContent = `${roundsCounter} / ${maxRounds}`;

  scoreOutput.textContent = `User ${playerScore} : ${computerScore} Computer`;

  const gameOver = checkGameOver(playerScore, computerScore, maxRounds, roundsCounter);

  textOutputContainer.innerHTML = textOutput(userChoice, computerChoice, result, playerScore, computerScore, gameOver);

  if (gameOver) {
    selectionOptions.forEach((option) => {
      option.removeEventListener("click", playRound);
    });
  }
};

//# ===== Überprüft ob das Spiel beendet ist =====

const checkGameOver = (playerScore, computerScore, maxRounds, roundsCounter) => {
  let gameOver = false;
  if (playerScore > maxRounds / 2 || computerScore > maxRounds / 2 || roundsCounter === maxRounds) {
    gameOver = true;
  }
  return gameOver;
};

//# ===== Funktion bestimmt den Text Output =====

const textOutput = (userChoice, computerChoice, result, playerScore, computerScore, gameOver) => {
  let userOutput;
  let computerOutput;
  let winner;
  let loser;
  let outputHTML;
  switch (userChoice) {
    case 0:
      userOutput = "Stein";
      break;

    case 1:
      userOutput = "Papier";
      break;
    case 2:
      userOutput = "Schere";
      break;
  }

  switch (computerChoice) {
    case 0:
      computerOutput = "Stein";
      break;

    case 1:
      computerOutput = "Papier";
      break;
    case 2:
      computerOutput = "Schere";
      break;
  }

  if (gameOver && playerScore > computerScore) {
    outputHTML = `<h2>User gewinnt</h2>`;
  } else if (gameOver && playerScore < computerScore) {
    outputHTML = `<h2>Computer gewinnt</h2>`;
  } else if ((gameOver && playerScore === computerScore) || result === 0) {
    outputHTML = `<h2>Unentschieden</h2>`;
  } else if (result === -2 || result === 1) {
    winner = "User";
    loser = "Comp";
    outputHTML = `<h2>${userOutput}<sup>${winner}</sup> schlägt ${computerOutput}<sup>${loser}</sup></h2>`;
  } else if (result === 2 || result === -1) {
    winner = "Comp";
    loser = "User";
    outputHTML = `<h2>${computerOutput}<sup>${winner}</sup> schlägt ${userOutput}<sup>${loser}</sup></h2>`;
  }

  return outputHTML;
};

RoundsOptions.forEach((option) => {
  option.addEventListener("change", (event) => {
    maxRounds = Number(event.target.value);
  });
});

selectionOptions.forEach((option) => {
  option.addEventListener("click", playRound);
});

restartBtn.addEventListener("click", () => {
  location.reload();
});
