const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const fs = require('fs');
const { Socket } = require('socket.io-client');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('\n' + socket.id);
  console.log('\n' + socket.conn.remoteAddress + '\n')

  socket.on('chat message', (msg) => {
    msg.ip=socket.conn.remoteAddress;
    io.emit('chat message', msg);
    // socket.emit('chat message', msg);
    console.log('\n message: ' + msg);

    fs.appendFile('./logs.txt', 'autor: ' + socket.conn.remoteAddress + ' evento: ' + msg.event + '\n', (error)=>{
      if (error){
        throw error;
      }
      console.log(msg.event);
    })


  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});