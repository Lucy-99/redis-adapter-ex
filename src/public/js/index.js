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
  socket.emit("join", { room: formInput.value });
});
