import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("listening on http://localhost:3000");

//* http서버에 접근
const server = http.createServer(app);
//* 접근한 http서버 위에 webSoket 서버를 만들었음
const wss = new WebSocket.Server({ server });

function onSocketClose() {
  console.log("disconnected from the Browser");
}

//? 연결된 사용자들
const sockets = [];

wss.on("connection", (socket) => {
  // socket은 사용자라고 할 수 있는데 그 사용자를 sockets로 push
  sockets.push(socket);
  socket["nickname"] = "아무개";
  //* 브라우저가 연결되었을 때
  console.log("Connected to Browser");

  //* 브라우저 창이 닫혔을 때
  socket.on("close", onSocketClose);

  //* 브라우저에서 메시지를 보냈을 때
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((asocket) =>
          asocket.send(`${socket.nickname} :  ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload.toString("utf8");
    }
  });

  //* 서버에서 브라우저로 메시지를 보내는 것
});
server.listen(3000, handleListen);
