const socket = io("ws://localhost:5000");

const userId = prompt("enter ID");
if (userId) {
  socket.emit("info", userId);
}

const boxes = document.querySelectorAll(".box");
const winnerPopup = document.querySelector(".winner-popup");
const winnerPrg = document.getElementById("winner-prg");
const resetBtn = document.getElementById("reset-btn");
const turnPrg = document.getElementById("turn-prg");

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
