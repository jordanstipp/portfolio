const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow session cookies if you need them
  })
);
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
