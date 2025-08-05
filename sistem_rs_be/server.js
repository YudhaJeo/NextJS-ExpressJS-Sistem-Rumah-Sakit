import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';

config();

const PORT = process.env.PORT;
const EXPRESS_URL = process.env.EXPRESS_PUBLIC_URL;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: EXPRESS_URL,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

function broadcastUpdate() {
  io.emit('antrian-update');
}
app.set('broadcastUpdate', broadcastUpdate);

server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di ${EXPRESS_URL}`);
});
