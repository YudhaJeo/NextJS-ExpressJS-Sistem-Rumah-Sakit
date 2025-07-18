import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';

config();

const port = 4000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
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

server.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});