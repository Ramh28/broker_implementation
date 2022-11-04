const io = require('socket.io-client');

let socket;

socket = io.connect('http://localhost:3000');