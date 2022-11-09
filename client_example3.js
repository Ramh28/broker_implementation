const io  = require('socket.io-client')

let socket;
let msg = 'saludo desde mi sofa';
let ruta = '/home/room/tv/';
let ruta2 = '/home/room/luces/';
socket = io.connect('http://localhost:3000');

socket.on("connect", () => {
  console.log('cliente conectado: ' + socket.connected); // true
});

socket.emit("SUBSCRIBE", msg, ruta, (response) => {
  console.log(response); // "got it"
});

socket.on("xsss", (args) => {
    console.log(args);
  })

socket.emit("UNSUBSCRIBE", msg, ruta, (response) => {
  console.log(response); // "got it"
});
