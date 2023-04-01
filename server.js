import { WebSocketServer as Server } from 'ws';
import { v4 as uuid } from 'uuid';

const clients = {};
const messages = [];
const port = 8000;

const wss = new Server({ port: port });
wss.on('connection', (ws) => {
  const id = uuid();
  clients[id] = ws;

  ws.send(JSON.stringify(messages));

  ws.on('message', function incoming(rowMessage) {
    const { name, message } = JSON.parse(rowMessage);

    messages.push({ name, message });

    for (const id in clients) {
      clients[id].send(JSON.stringify([{ name, message }]));
    }
  });

  ws.on('close', () => {
    delete clients[id];
  });
});
