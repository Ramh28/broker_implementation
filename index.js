let express = require('express');
let socket = require('socket.io');

let app = express();
let server = app.listen(3000);
app.use(express.static('public'));
console.log('alo');

let io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log(socket.id);
}
