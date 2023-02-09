// 페이지에서 실행할 자바스크립트

const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");

//* backend와 연결
const socket = new WebSocket(`ws://${window.location.host}`);


function makeMessage(type, payload){
  const msg = {type, payload};
  return JSON.stringify(msg);
}

const handleOpen = () => {
  console.log("Connected to Server");
};
const handleMessage = (msg) => {
  const li = document.createElement("li");
  li.innerText = msg.data;
  messageList.append(li);
};
const handleClose = () => {
  console.log("disconnected from server");
};

//* connetion이 open일때 실행되는 이벤트
socket.addEventListener("open", handleOpen);

//* backend로 부터 메시지를 받았을 때 실행되는 이벤트
socket.addEventListener("message", handleMessage);

//* 서버가 오프랑니이 됐을 때 실행되는 이벤트
socket.addEventListener("close", handleClose);

//* back으로 메시지를 보내는 것
// setTimeout(() => {
//   socket.send("hello from the Browser");
// }, 3000);

const handleSubmit = (e) => {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
};

function handleNickSubmit(e) {
  e.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";

}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
