const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.send("OK"));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Listen for direct socket emissions from clients
  socket.on("emoji", (emoji) => {
    console.log("Received emoji from client:", emoji);
    // Re-broadcast to everyone
    io.emit("emoji", emoji);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
