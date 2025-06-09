const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lifes: document.querySelector("#lifes"),
    gameOverScreen: document.querySelector("#game-over-screen"),
    finalMessage: document.querySelector("#final-message"),
    restartButton: document.querySelector("#restart-btn"),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
    life: 0,
  },
  actions: {
    timerId: null,
    countDownTimerId: null,
  },
};

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    endGame("Gamer Over! O seu resultado foi: " + state.values.result);
  }
}

function playSound(audioName) {
  let audio = new Audio(`/src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenerHitbox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
      } else {
        state.values.life--;
        updateHearts();

        if (state.values.life <= 0) {
          clearInterval(state.actions.countDownTimerId);
          clearInterval(state.actions.timerId);
          endGame(
            "Game Over! Você perdeu todas as vidas. Pontuação: " +
              state.values.result
          );
        }
      }
    });
  });
}

function endGame(message) {
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);

  state.view.finalMessage.textContent =
    message + " Pontuação final: " + state.values.result;
  state.view.gameOverScreen.style.display = "flex";

  const currentHighScore = localStorage.getItem("highScore") || 0;

  if (state.values.result > currentHighScore) {
    localStorage.setItem("highScore", state.values.result);
    state.view.finalMessage.textContent =
      message + " 🏆 Novo recorde: " + state.values.result;
  } else {
    state.view.finalMessage.textContent =
      message +
      " Pontuação final: " +
      state.values.result +
      " | Recorde atual: " +
      currentHighScore;
  }
}

function updateHearts() {
  state.view.lifes.innerHTML = "❤️".repeat(state.values.life);
}

function initialize() {
  state.values.life = 3;
  updateHearts();
  addListenerHitbox();
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
  state.view.restartButton.addEventListener("click", () => {
    window.location.reload();
  });
  const savedScore = localStorage.getItem("highScore") || 0;
  document.querySelector("#high-score").textContent = savedScore;
}

initialize();
