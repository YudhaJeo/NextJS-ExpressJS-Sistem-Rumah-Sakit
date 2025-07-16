import app from './src/app.js';
import { config } from 'dotenv';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws'; 

config();

const port = 4000;
const server = createServer(app);

const wss = new WebSocketServer({ server, path: '/api/ws' });

wss.on('connection', (ws) => {
  console.log('🔌 Klien WebSocket tersambung');

  ws.on('message', (message) => {
    console.log('📩 Pesan diterima:', message.toString());
  });

  ws.on('close', () => {
    console.log('❌ Koneksi WebSocket ditutup');
  });
});

function broadcastUpdate() {
  console.log('📡 Broadcasting update ke', wss.clients.size, 'klien...');
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) { 
      client.send(JSON.stringify({ type: 'update' }));
    }
  });
}

app.set('broadcastUpdate', broadcastUpdate);

server.listen(port, () => {
  console.log(`🚀 Server berjalan pada http://localhost:${port}`);
});