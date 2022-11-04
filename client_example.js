import { io } from "socket.io-client";

const socket = io("http://localhost:3300");

socket.emit("Hola desde el cliente. ", 5, "6", {7: Uint8Array.from([8])});

socket.on("hello from server", (...args) => {

});