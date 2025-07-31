const socket = io("ws://localhost:5000");

let boxes = document.querySelectorAll(".box");

socket.on("data", (data) => {
  console.log(data);
});
socket.on("win", (win) => {
  console.log(win);
});

boxes.forEach((box, i) => {
  box.addEventListener("click", function () {
    socket.emit("input", i);
  });
});
