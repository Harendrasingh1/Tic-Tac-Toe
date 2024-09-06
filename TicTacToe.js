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

let player1Name = "Player 1";
let player2Name = "Player 2";
let turnO = true; // true for Player O, false for Player X
let count = 0; // To Track Draw

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

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  container.classList.add("hide");
  player1NameInput.value = "";
  player2NameInput.value = "";
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
    player1Name = player1NameInput.value.trim();
    player2Name = player2NameInput.value.trim();
    
    if (!player1Name || !player2Name) {
      alert("Please enter names for both players.");
      return;
    }
    
    if (!player1TurnBtn.classList.contains("active") && !player2TurnBtn.classList.contains("active")) {
      alert("Please select which player goes first.");
      return;
    }
  
    turnO = player1TurnBtn.classList.contains("active");
    container.classList.remove("hide");
    player1TurnBtn.disabled = true;
    player2TurnBtn.disabled = true;
    startGameBtn.classList.add("hide"); // Hide start button after the game starts
  };
  
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!box.disabled) {
      box.innerText = turnO ? "O" : "X";
      box.disabled = true;
      count++;
      let isWinner = checkWinner();
      if (isWinner) {
        showWinner(turnO ? player1Name : player2Name);
        player1TurnBtn.classList.remove("active");
        player2TurnBtn.classList.remove("active");
      } else if (count === 9) {
        gameDraw();
      }
      turnO = !turnO;
      player1TurnBtn.classList.toggle("active");
      player2TurnBtn.classList.toggle("active");
    }
  });
});

const gameDraw = () => {
    msg.innerHTML = "🤡😞 Draw -> No One is Smart. 😞🤡"; // Added joker and unhappy emojis
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
  msg.innerHTML = `🔥🏆🎉WOW! ${winner} is the Winner! 🎉🔥🏆`; // Happy emojis with firecrackers
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
  player1TurnBtn.classList.add("active");
  player2TurnBtn.classList.remove("active");
});

player2TurnBtn.addEventListener("click", () => {
  turnO = false;
  player1TurnBtn.classList.remove("active");
  player2TurnBtn.classList.add("active");
});

resetBtn.addEventListener("click", resetGame);
startGameBtn.addEventListener("click", startGame);
newGameBtn.addEventListener("click", resetGame);


const aboutMeBtn = document.querySelector("#about-me-btn");
const aboutMeText = document.querySelector("#about-me-text");

// Toggle About Me section visibility
const toggleAboutMe = () => {
    aboutMeText.classList.toggle("show");
    if (aboutMeText.classList.contains("show")) {
        aboutMeText.style.display = "block";
    } else {
        aboutMeText.style.display = "none";
    }
};

aboutMeBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent event from bubbling up to the document
    toggleAboutMe();
});

// Hide About Me section if clicked outside
document.addEventListener("click", (event) => {
    if (!aboutMeBtn.contains(event.target) && !aboutMeText.contains(event.target)) {
        aboutMeText.classList.remove("show");
        aboutMeText.style.display = "none";
    }
});

