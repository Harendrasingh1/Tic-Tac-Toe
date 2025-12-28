let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let startGameBtn = document.querySelector("#start-game");
let player1NameInput = document.querySelector("#player1-name");
let player2NameInput = document.querySelector("#player2-name");
let player1TurnBtn = document.querySelector("#player1-turn");
let player2TurnBtn = document.querySelector("#player2-turn");
let container = document.querySelector(".container");

// New Game Mode UI
let modePvPBtn = document.querySelector("#mode-pvp");
let modePvCBtn = document.querySelector("#mode-pvc");

let player1Name = "Player 1"; // Default Player 1 (O)
let player2Name = "Player 2"; // Default Player 2 (X or Computer)
let turnO = true; // true = Player 1 (O), false = Player 2 (X)
let count = 0; // To Track Draw
let isVsComputer = false; // Default to PvP

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Switch Game Modes
const setGameMode = (vsComputer) => {
  isVsComputer = vsComputer;
  resetGame();

  if (isVsComputer) {
    modePvPBtn.classList.remove("active");
    modePvCBtn.classList.add("active");
    player2NameInput.value = "Computer";
    player2NameInput.disabled = true;
    player2Name = "Computer";
  } else {
    modePvCBtn.classList.remove("active");
    modePvPBtn.classList.add("active");
    player2NameInput.value = "";
    player2NameInput.disabled = false;
    player2Name = "Player 2";
  }
};

modePvPBtn.addEventListener("click", () => setGameMode(false));
modePvCBtn.addEventListener("click", () => setGameMode(true));

const resetGame = () => {
  turnO = true; // Always start with Player 1 (O)
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  container.classList.add("hide");

  if (!isVsComputer) {
    player1NameInput.value = "";
    player2NameInput.value = "";
  } else {
    player1NameInput.value = "";
    player2NameInput.value = "Computer";
  }

  player1TurnBtn.classList.remove("active");
  player2TurnBtn.classList.remove("active");
  player1TurnBtn.disabled = false;
  player2TurnBtn.disabled = false;
  startGameBtn.classList.remove("hide");
  resetBtn.classList.remove("hide");
  player1TurnBtn.classList.remove("hide");
  player2TurnBtn.classList.remove("hide");
  player1NameInput.classList.remove("hide");
  player2NameInput.classList.remove("hide");
};

const startGame = () => {
  player1Name = player1NameInput.value.trim() || "Player 1";
  player2Name = player2NameInput.value.trim();
  if (isVsComputer) player2Name = "Computer";
  if (!player2Name) player2Name = "Player 2";

  // Validate inputs only for PvP
  if (!isVsComputer && (!player1NameInput.value.trim() || !player2NameInput.value.trim())) {
    alert("Please enter names for both players.");
    return;
  }

  // Default turn selection handling
  if (!player1TurnBtn.classList.contains("active") && !player2TurnBtn.classList.contains("active")) {
    // Default to Player 1 if not selected
    player1TurnBtn.classList.add("active");
    turnO = true;
  } else {
    turnO = player1TurnBtn.classList.contains("active");
  }

  container.classList.remove("hide");
  player1TurnBtn.disabled = true;
  player2TurnBtn.disabled = true;
  startGameBtn.classList.add("hide");

  // If Computer starts (unlikely given logic above defaulting to P1, but possible if user selects P2 turn)
  if (isVsComputer && !turnO) {
    setTimeout(computerMove, 500);
  }
};

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    // If it's computer's turn, ignore click
    if (isVsComputer && !turnO) return;

    if (!box.disabled) {
      handleMove(box, index);
    }
  });
});

const handleMove = (box, index) => {
  box.innerText = turnO ? "O" : "X";
  box.disabled = true;
  count++;

  let isWinner = checkWinner();

  if (isWinner) {
    showWinner(turnO ? player1Name : player2Name);
    return;
  }

  if (count === 9) {
    gameDraw();
    return;
  }

  // Switch Turn
  turnO = !turnO;
  updateTurnIndicator();

  // Trigger Computer Move
  if (isVsComputer && !turnO) {
    setTimeout(computerMove, 600);
  }
};

const updateTurnIndicator = () => {
  if (turnO) {
    player1TurnBtn.classList.add("active");
    player2TurnBtn.classList.remove("active");
  } else {
    player1TurnBtn.classList.remove("active");
    player2TurnBtn.classList.add("active");
  }
};

const computerMove = () => {
  if (count === 9 || msgContainer.classList.contains("hide") === false) return; // Game over check

  let availableBoxes = [];
  boxes.forEach((box, index) => {
    if (!box.disabled) availableBoxes.push(index);
  });

  if (availableBoxes.length === 0) return;

  let moveIndex = -1;

  // 1. Try to Win
  moveIndex = findBestMove("X");

  // 2. Block Opponent
  if (moveIndex === -1) {
    moveIndex = findBestMove("O");
  }

  // 3. Random Move
  if (moveIndex === -1) {
    let randomIndex = Math.floor(Math.random() * availableBoxes.length);
    moveIndex = availableBoxes[randomIndex];
  }

  // Execute Move
  let box = boxes[moveIndex];
  handleMove(box, moveIndex);
};

const findBestMove = (symbol) => {
  // Check all win patterns to see if 'symbol' can win in one move
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let valA = boxes[a].innerText;
    let valB = boxes[b].innerText;
    let valC = boxes[c].innerText;

    // Check for 2 matching symbols and 1 empty
    if (valA === symbol && valB === symbol && !boxes[c].innerText) return c;
    if (valA === symbol && valC === symbol && !boxes[b].innerText) return b;
    if (valB === symbol && valC === symbol && !boxes[a].innerText) return a;
  }
  return -1;
};

const gameDraw = () => {
  msg.innerHTML = "🤡😞 Draw -> No One is Smart. 😞🤡";
  msgContainer.classList.remove("hide");
  hideGameElements();
  disableBoxes();
};

const hideGameElements = () => {
  container.classList.add("hide");
  resetBtn.classList.add("hide");
  startGameBtn.classList.add("hide");
  player1TurnBtn.classList.add("hide");
  player2TurnBtn.classList.add("hide");
  player1NameInput.classList.add("hide");
  player2NameInput.classList.add("hide");
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

const showWinner = (winner) => {
  msg.innerHTML = `🔥🏆🎉WOW! ${winner} is the Winner! 🎉🔥🏆`;
  msgContainer.classList.remove("hide");
  hideGameElements();
  disableBoxes();
};

const checkWinner = () => {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return (
      boxes[a].innerText &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[a].innerText === boxes[c].innerText
    );
  });
};

player1TurnBtn.addEventListener("click", () => {
  turnO = true;
  updateTurnIndicator();
});

player2TurnBtn.addEventListener("click", () => {
  turnO = false;
  updateTurnIndicator();
});

resetBtn.addEventListener("click", resetGame);
startGameBtn.addEventListener("click", startGame);
newGameBtn.addEventListener("click", resetGame);

// About Me Logic
const aboutMeBtn = document.querySelector("#about-me-btn");
const aboutMeText = document.querySelector("#about-me-text");

const toggleAboutMe = () => {
  aboutMeText.classList.toggle("show");
};

aboutMeBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleAboutMe();
});

document.addEventListener("click", (event) => {
  if (!aboutMeBtn.contains(event.target) && !aboutMeText.contains(event.target)) {
    aboutMeText.classList.remove("show");
  }
});
