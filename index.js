let express = require('express');
let socket = require('socket.io');

let app = express();
let server = app.listen(3000);

app.use(express.static('public'));

let topics = [];

const io = socket(server);

io.sockets.on('connection', newConnection);

function AddTopic(topic, message){
    console.log("agregue un topico");
    topics.push( io.of(topic) );
}

function subscribeToTopic(topic, socket){

    topics.forEach(element => {
        if(topic == element.name){
            console.log("entre en subscribeToTopic");
            
            element.on("connection", () => {
                console.log("subscrito");
            })
        }
    })
}

function newConnection(socket){

    socket.on("CONNECT", (arg, callback) => {
        console.log(arg);
        callback("CONNACK");
    });
    
    socket.on("PUBLISH", (topic, message, callback) => {
        console.log(topic);

        if(topics.length == 0){
            AddTopic(topic, message);
            console.log("agregue un nuevo topic");
        } else {
            topics.forEach(element => {
            
                if(topic == element){
                    console.log("Entre acá");
                } else {
                    console.log("Entre en el else");
                    AddTopic(topic, message);
                }
            });
        }
        
        topics.forEach(element => {
            console.log("entre");
            if(topic == element.name){
                console.log("entre");
                console.log(element.sockets.size);
            }
        })

        callback("PUBACK");
    });

    socket.on("SUBSCRIBE", (topic, callback) => {
        
        if(topics.length == 0){

            AddTopic(topic, null);
            subscribeToTopic(topic, socket);
            
            console.log(topics.length);

            topics.forEach( element => {

                console.log("Im here");

                if(element.name == topic ){
                    console.log("entre aqui mrc")
                }

                console.log(element.sockets.size);
            })
        } else {

        }
        callback("SUBACK");
    });

    socket.on("UNSUBSCRIBE", (arg, callback) => {
        console.log(arg);
        callback("UNSUBACK");
    });

    socket.on("DISCONNECT", (callback) => {
        callback("DISCONNECTED.");
        socket.disconnect();
    });
}
