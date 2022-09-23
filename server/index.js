const { Server } = require("socket.io");

const io = new Server({ cors: { origin: "http://127.0.0.1:3000" } });

io.on("connection", (socket) => {
  console.log(`connect: ${socket.id}`);

  socket.on("join", (name) => {
    console.log(`${name} has joined`);
    io.emit("joined", name);
  });

  socket.on("message", ({ name, message }) => {
    console.log(`${name}: ${message}`);
    io.emit("message", { name, message });
  });

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});

io.listen(5000);

// setInterval(() => {
//   io.emit('date', new Date().toISOString());
// }, 1000);
