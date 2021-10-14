const express = require("express");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const { createClient } = require("redis");
const redisAdapter = require("@socket.io/redis-adapter");

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(redisAdapter(pubClient, subClient));

server.listen(3030, () => {
  console.log("http://localhost:3030");
});

setInterval(async () => {
  const loggedInSockets = await io.of("/").adapter.sockets(new Set());
  console.log("online:", loggedInSockets);
}, 1000);

io.on("connection", async (socket) => {
  console.log(socket.id);
  // const loggedInSockets = await io.of("/").adapter.sockets(new Set());
  // console.log("online:", loggedInSockets);
  // socket.on("disconnect", async () => {
  //   console.log("disconnected:", socket.id);
  //   const loggedInSockets = await io.of("/").adapter.sockets(new Set());
  //   console.log("online:", loggedInSockets);
  // });
  // socket.on("join", async ({ room }) => {
  //   console.log(`joining ${socket.id}=>${room}`);
  //   await io.of("/").adapter.remoteJoin(socket.id, room);
  //   const socketInRoom = await io.in(room).allSockets();
  //   console.log(`sockets in ${room}`, socketInRoom);
  // });
});

const chat = io.of("/chat");
chat.on("connection", (socket) => {
  console.log("->chat", socket.id);
  socket.on("join", async ({ room }) => {
    console.log(`joining ${socket.id}=>${room}`);
    await io.of("/chat").adapter.remoteJoin(socket.id, room);
    const socketInRoom = await io.of("/chat").in(room).allSockets();
    console.log(`sockets in ${room}`, socketInRoom);
  });
});
