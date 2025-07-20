// // server.mjs
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import path from "path";
// import { fileURLToPath } from "url";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// // Serve static files from "public"
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "public")));

// io.on("connection", socket => {
//   console.log("User connected:", socket.id);

//   socket.on("join", room => {
//     socket.join(room);
//     socket.to(room).emit("user-joined", socket.id);
//   });

//   socket.on("signal", data => {
//     io.to(data.to).emit("signal", { from: socket.id, signal: data.signal });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// server.listen(5000, () => {
//   console.log("🚀 Signaling server running at https://orbit-meet-4.onrender.com/");
// });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const rooms = {}; // roomId -> [socketIds]

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("join", roomId => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    // Send all existing users to new user
    const otherUsers = rooms[roomId].filter(id => id !== socket.id);
    socket.emit("all-users", otherUsers);

    // Notify others
    socket.to(roomId).emit("user-joined", socket.id);

    // Handle signaling
    socket.on("signal", ({ to, signal }) => {
      io.to(to).emit("signal", { from: socket.id, signal });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socket.to(roomId).emit("user-disconnected", socket.id);
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    });
  });
});

server.listen(5000, () => {
  console.log("🚀 Signaling server running at https://orbit-meet-4.onrender.com/");
});
