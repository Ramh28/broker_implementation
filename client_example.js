const io = require('socket.io-client');

let socket;

socket = io.connect('https://guileless-muffin-fffeee.netlify.app/');

socket.emit("CONNECT", "topico", (response) => {
  console.log("CONNACK")
});

socket.emit("SUBSCRIBE", "/cocina/lucesAltas", (response) => {
  console.log(response);
});

socket.emit("PUBLISH", "/cocina/termometro", "79", (response) => {
  console.log(response);
})