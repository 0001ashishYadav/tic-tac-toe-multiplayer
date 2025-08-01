const socket = io("ws://localhost:5000");

const userId = prompt("enter ID");
if (userId) {
  socket.emit("info", userId);
}

const userEl = document.getElementById("user");

userEl.innerHTML = `You are user ${userId}`;

const boxes = document.querySelectorAll(".box");
const winnerPopup = document.querySelector(".winner-popup");
const winnerPrg = document.getElementById("winner-prg");
const resetBtn = document.getElementById("reset-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const turnPrg = document.getElementById("turn-prg");

resetBtn.addEventListener("click", () => {
  socket.emit("reset", "reset");
  console.log("reset clicked");
});

playAgainBtn.addEventListener("click", () => {
  socket.emit("reset", "reset");
  winnerPopup.classList.add("hide");
});

socket.on("data", (data) => {
  boxes.forEach((box, i) => {
    box.innerHTML = data[i];
  });
});

socket.on("win", (win) => {
  winnerPrg.innerHTML = win;
  winnerPopup.classList.remove("hide");
});

socket.on("draw", (draw) => {
  console.log(draw);
});

socket.on("turn", (turn) => {
  console.log(turn);
  turnPrg.innerHTML = turn;
});

boxes.forEach((box, i) => {
  box.addEventListener("click", function () {
    socket.emit("input", i);
  });
});
