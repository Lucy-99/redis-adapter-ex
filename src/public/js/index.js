const mainForm = document.querySelector("#main-form");
const formInput = document.querySelector("input");

const socket = io();
socket.connect(`ws://${window.location.host}`);
socket.on("connect", () => {
  console.log(socket.id);
});

mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(formInput.value);
  console.log(mainForm.target);
  socket.emit("join", { room: formInput.value });
  if (mainForm.target === "chat") {
    handleChat(formInput.value);
  }
});

function handleChat(room) {
  console.log("going to room", room);
  const sock = io("/chat");
  sock.emit("join", { room });
}
