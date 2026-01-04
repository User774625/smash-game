const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
  console.log('Spieler verbunden:', socket.id);
  
  // Neuer Spieler
  players[socket.id] = { id: socket.id, x: 100, y: 400, width: 40, height: 60, vx: 0, vy: 0, color: `hsl(${Math.random()*360},70%,50%)`, onGround: false };
  
  socket.emit('allPlayers', players);
  
  socket.on('playerUpdate', (playerData) => {
    if (players[socket.id]) {
      players[socket.id].x = playerData.x;
      players[socket.id].y = playerData.y;
      players[socket.id].vx = playerData.vx;
      players[socket.id].vy = playerData.vy;
      players[socket.id].onGround = playerData.onGround;
    }
    io.emit('allPlayers', players);  // Broadcast an ALLE
  });
  
  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('allPlayers', players);
    console.log('Spieler getrennt');
  });
});

server.listen(3000, () => console.log('Smash Server auf localhost:3000'));
