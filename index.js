import express from 'express';

import { Server } from 'socket.io';

const app = express();

let server = app.listen(3000);

app.use(express.static('public'));

/* Arreglo de topicos principales 
    ej. Home/
        Edif/
*/

let topics = [];

const io = new Server(server);

function getTopics(complete_topic){
    
    let topics = complete_topic.split('/');

    return topics;
}

function searchTopics(topics, arrayOfTopics){

    let arrayTopics = arrayOfTopics;

    if(topics.length == 0){
        return false;
    }

    if(arrayTopics.length == 0){
        console.log("Encontraste el destino boludo");
        return true;
    }

    for (let index = 0; index < topics.length; index++){
        if( topics[index].topic_name == arrayTopics[0] ){
            arrayTopics.shift();
            searchTopics(topics[index].subTopic, arrayTopics);
        }
    }
}
//clase topico.

class topic {

    // Este constructor se aplica a las diferentes aplicaciones a las cuales se deban aplicar.

    constructor(topic_name){
        this.topic_name = topic_name;
        this.suscribers = [];
        this.subTopic = [];
        this.SavedMessage;
        this.lastWillMessage = "service disconnected.";
    }

    addSubscriber(ID_client){
        this.suscribers.push(ID_client);
    }

    setSavedMessage(SavedMessage){
        if(this.suscribers.length == 0){
            this.SavedMessage = SavedMessage;
        }

    }

    writeLastWillMessage(){
        return(lastWillMessage);
    }

    sendMessageToSubscribers(){
        return this.SavedMessage
    }
    //funcion que crea sub topicos.

    //Mode 1: Subscrpcion.
    //Mode 0: Publicacion.
    
    createSubTopics(arrayOfTopics, ID_client, message, mode){

        if(arrayOfTopics.length == 0 && mode == 0){

            this.setSavedMessage(message);
            return;
        }

        if(arrayOfTopics.length == 0){
            return;
        }

        let boolean = false;

        let index;

        console.log(arrayOfTopics);

        for(let i = 0; i < this.subTopic.length; i++){

            if( this.subTopic[i].topic_name == arrayOfTopics[0] ){
                boolean = true;
                index = i;
            }
        }

        if(boolean == true ){
            arrayOfTopics.shift();
            this.subTopic[index].createSubTopics(arrayOfTopics, ID_client, message, 0);
        } else 
        if (boolean == false){

            let newTopic = new topic(arrayOfTopics[0]);

            this.subTopic.push(newTopic);

            for (let i = 0; i < this.subTopic.length; i++) {
                
                if(this.subTopic[i].topic_name == arrayOfTopics[0]){
                    arrayOfTopics.shift();
                    this.subTopic[i].createSubTopics(arrayOfTopics, ID_client, message, 0);
                }
            }
        } else {
            console.log("error");
        }
        
    }
}

// Comienza el servidor y ejecuta una funcion cuando haya una nueva conexión.
io.sockets.on('connection', newConnection);


function newConnection(socket){

    // Escucha a la llamada Connect.

    socket.on("CONNECT", (arg, callback) => {
        callback("CONNACK");
    });
    
    //Escucha a la llamada PUBLISH del cliente. 
    // Recibe el directorio o topico, ej. Home/ ; Home/kitchen/termometer.
    // message es la informacion que el cliente quiere publicar, ej. 79 grados, prender, apagar
    // Callback es la respueta que da el broker con respecto a la peticion del cliente.
    socket.on("PUBLISH", (topic_dir, message, callback) => {

        let boolean = false;

        let index;

        let arrayOfTopics = getTopics(topic_dir);

        for(let i = 0; i < topics.length; i++){

            if( topics[i].topic_name == arrayOfTopics[0] ){
                boolean = true;
                index = i;
            }
        }

        if(boolean == true ){

            arrayOfTopics.shift();
            topics[index].createSubTopics(arrayOfTopics, socket.id, message, 0);

        } else if (boolean == false){

            let newTopic = new topic(arrayOfTopics[0]);

            topics.push(newTopic);

            for (let i = 0; i < topics.length; i++) {
                
                if(topics[i].topic_name == arrayOfTopics[0]){
                    arrayOfTopics.shift();
                    topics[i].createSubTopics(arrayOfTopics, socket.id, message, 0);
                }
            }

        } else {

            console.log("error");

        }
        console.log(topics);
    });

    socket.on("SUBSCRIBE", (topic, callback) => {

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
