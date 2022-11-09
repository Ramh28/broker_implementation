const io  = require('socket.io-client')

let socket;
let msg = 'saludo desde mi sofa';
let ruta = '/home/room/tv/';
socket = io.connect('http://localhost:3000');

socket.on("connect", () => {
  console.log('cliente conectado: ' + socket.connected); // true
});

socket.on("info", (args)=>{
  console.log(args);
})

socket.emit("SUBSCRIBE", msg, ruta, (response) => {
  console.log(response); // "got it"
});

socket.emit("UNSUBSCRIBE", msg, ruta, (response) => {
  console.log(response); // "got it"
});
