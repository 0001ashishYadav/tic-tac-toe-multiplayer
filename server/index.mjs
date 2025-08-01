import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const clients = {};

let turn = "1";

let isWinnerAnnounced = false;

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
  for (let pattern of winPatterns) {
    const v1 = data[pattern[0]];
    const v2 = data[pattern[1]];
    const v3 = data[pattern[2]];

    if (v1 !== "" && v2 !== "" && v3 !== "" && v1 === v2 && v2 === v3) {
      if (v1 === "0") {
        io.emit("win", "user 2 (0) is the winner");
        isWinnerAnnounced = true;
      } else {
        io.emit("win", "user 1 (X) is the winner");
        isWinnerAnnounced = true;
      }
      turn = "";
      setTimeout(() => {
        turn = "1";
        data.fill("");
      }, 5000);
    }
  }
};

const checkMatchDraw = () => {
  if (data.every((item) => item !== "") && !isWinnerAnnounced) {
    io.emit("draw", "Match Draw");
    turn = "";
    setTimeout(() => {
      turn = "1";
      data.fill("");
    }, 5000);
  }
};

const checkTurn = () => {
  if (turn === "1") {
    io.emit("turn", "user 1 (X), it's your turn");
  } else if (turn === "2") {
    io.emit("turn", "user 2 (0), it's your turn");
  } else {
    io.emit("turn", "Match Over");
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

    if (e >= 0 && e < 9) {
      const clientId = clients[socket.id];
      if (clientId) {
        if (turn === "1" && clientId === turn) {
          data[e] = "X";
          turn = "2";
        } else if (turn === "2" && clientId === turn) {
          data[e] = "0";
          turn = "1";
        }
        checkWinner();
        checkMatchDraw();
        checkTurn();
      }
    }
    io.emit("data", data);
  });

  socket.on("info", (userId) => {
    if (!userId || userId > 2 || userId < 0) {
      return;
    }
    clients[socket.id] = userId;
    console.log(clients);
  });

  socket.on("reset", () => {
    data.fill("");
    turn = "1";
    isWinnerAnnounced = false;
    io.emit("data", data);
    io.emit("turn", "user 1 (X), it's your turn");
    // io.emit("win", "");
  });
});

httpServer.listen(5000, (e) => {
  if (e) {
    return console.log(e);
  }
  console.log("server started on 5000");
});
