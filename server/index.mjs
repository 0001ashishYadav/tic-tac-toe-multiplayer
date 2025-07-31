import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const data = ["", "", "", "", "", "", "", "", ""];

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

const checkWinner = () => {
  let hasWin = false;
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (
      pos1Val !== "" &&
      pos2Val !== "" &&
      pos3Val !== "" &&
      pos1Val === pos2Val &&
      pos2Val === pos3Val
    ) {
      showWinner(pos1Val);
      hasWin = true;
      return;
    }
  }

  if (!hasWin) {
    const allBoxes = [...boxes].every((box) => box.innerText !== "");
    if (allBoxes) {
      msgContainer.classList.remove("hide");
      msg.innerText = "Match Drawn";
    }
  }
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("input", (e) => {
    console.log(e);
    io.emit("data", data);
    io.emit("win", "apple is winner");
  });
});

httpServer.listen(5000, (e) => {
  if (e) {
    return console.log(e);
  }
  console.log("server started on 5000");
});
