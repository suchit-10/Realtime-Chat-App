import express from "express";
import cors from "cors";
import axios from "axios";
import { Server } from 'ocket.io';

const app = express();
const server = app.listen(3000, () => {
  console.log(`Server is Running on http://localhost:3000`);
});
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

// main request
app.get("/", async (req, res) => {
  res.send(`Check Request`);
});

// authenticate request
app.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  try {
    const response = await axios.put(
      "https://api.chatengine.io/users/",
      {
        username: username,
        secret: username,
        first_name: username,
      },
      {
        headers: {
          "Private-Key": "ff932d29-b57e-4c57-a352-5fb92d4c9b5b",
        },
      }
    );
    return res.send(response.data);
  } catch (e) {
    return res.status(404).json(e.response.data);
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // handle custom events, such as chat messages
  socket.on('chat message', (msg) => {
    console.log('message: ' msg);
    // broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});
