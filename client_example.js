import { io } from 'socket.io-client'

let socket;

socket = io.connect('http://localhost:3000');

socket.emit("CONNECT", "topico", (response) => {
  console.log("CONNACK")
});

socket.emit("SUBSCRIBE", "home/cocina/lucesAltas", (response) => {
  console.log(response);
});

socket.emit("PUBLISH", "home/kitchen/room_lights", "79", (response) => {
  console.log(response);
})
