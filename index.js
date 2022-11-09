const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const fs = require('fs');
const { Socket } = require('socket.io-client');


class Topic{

	constructor(topicName){

		this.topicName = topicName;
		this.subscribers = [];
		this.subTopic = [];
		this.savedMessage;
		this.lastWillMessage = 'service disconnected';
	};
    
	addSubscriber(idClient){

        this.subTopic.forEach(element => {
            element.addSubscriber(idClient);
        });
        
        this.subscribers.push(idClient);	
    };
    popSubscriber(idClient){

<<<<<<< HEAD
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
=======
        this.subTopic.forEach(element => {
            element.popSubscriber(idClient);
        });
        
        let deadIndex;
>>>>>>> libreri

        deadIndex = this.subscribers.indexOf(idClient);
        if (deadIndex != -1) {
            this.subscribers.pop(deadIndex);
        };
        
    };
    getLastWillMessage(){
        return(this.lastWillMessage);
    };
    addSubTopic(subTopicName){

        let subTopic = new Topic(subTopicName);

        this.subTopic.push(subTopic);
    };
    emitPublish(msg, route, topic){

        posicionRaiz = route.indexOf('/');

        if (posicionRaiz!=0) {
            actualRaiz = route.slice(0, posicionRaiz+1);
            siguienteRaiz = route.slice(posicionRaiz+1);
    
            if (siguienteRaiz.length == 0) {
                this.subscribers.forEach(element => {
                    element.emit(msg);
                });
            }else{
    
                let indice = topicActual.subTopic.indexOf(actualRaiz);
                
                if (indice== -1) {
                    topicActual.addSubTopic(actualRaiz);
                    indice = topicActual.subTopic.indexOf(actualRaiz);
                }
                
                suscribe(topicActual.subTopic[indice],siguienteRaiz,idCliente);
            }
        }


    }
}

<<<<<<< HEAD
    sendMessageToSubscribers(){
        return this.SavedMessage
    }
    //funcion que crea sub topicos.
=======
let topic = new Topic('/');
>>>>>>> libreri

function escribirLog(socket, ruta, evento){
    fs.appendFile('./logs.txt', 'autor: ' + socket.conn.remoteAddress + ' Topico: '+ ruta + ' evento: ' + evento + '\n', (error)=>{
        if (error){
          throw error;
        }
    })
}

function suscribe(topicActual,route,idCliente) {

    let indexSlash = route.indexOf('/');
    let rutaActual = route.slice(1, indexSlash+1);

    // Se alcanzo la ruta maxima.

<<<<<<< HEAD
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
=======
    if ( indexSlash == 0 && route.length == 1 ){

        topicActual.addSubscriber(idCliente);

        return;
    }

    if ( route.length == 0 ) {
        topicActual.addSubscriber(idCliente);

        return;
    }

    if ( indexSlash == -1 && route.length > 0 ){
        
        let continuacionRuta = route.slice(indexSlash+1, route.length);
>>>>>>> libreri
        
        topicActual.addSubTopic(rutaActual);

        suscribe( topicActual.subTopic[0], continuacionRuta, idCliente );

        return;
    }





    // console.log(actualRaiz = route.slice(0, posicionRaiz+1));
    // console.log(siguienteRaiz = route.slice(posicionRaiz+1))
    // if (posicionRaiz!=0) {
    //     actualRaiz = route.slice(0, posicionRaiz+1);
    //     siguienteRaiz = route.slice(posicionRaiz+1);

    //     if (siguienteRaiz.length == 0) {
    //         topicActual.addSubscriber(idCliente);
    //     }else{

<<<<<<< HEAD
        let index;

        let arrayOfTopics = getTopics(topic_dir);

        for(let i = 0; i < topics.length; i++){
=======
    //         let indice = topicActual.subTopic.indexOf(actualRaiz);
            
    //         if (indice== -1) {
    //             topicActual.addSubTopic(actualRaiz);
    //             indice = topicActual.subTopic.indexOf(actualRaiz);
    //         }
    //         // console.log('suscrito')
    //         suscribe(topicActual.subTopic[indice],siguienteRaiz,idCliente);
    //     }
    // }else{
    //     // console.log('suscritor annadido');
    //     // console.log(topicActual.topicName);
    //     topicActual.addSubscriber(idCliente);
    // }
};

// Comienza el servidor y ejecuta una funcion cuando haya una nueva conexión.
// io.sockets.on('connection', newConnection);

>>>>>>> libreri

io.on('connect', (socket) => {
    console.log('conecte: ' + socket.id);
    console.log(topic.topicName);
  
    escribirLog(socket, '/', 'connect')

<<<<<<< HEAD
        if(boolean == true ){

            arrayOfTopics.shift();
            topics[index].createSubTopics(arrayOfTopics, socket.id, message, 0);

        } else if (boolean == false){

            let newTopic = new topic(arrayOfTopics[0]);
=======
    // socket.on('PUBLISH', (msg, route) => {
    //     topic.emitPublish(msg, route, topic);
    // });
    
    // socket.on('SUBSCRIBE', (route) => {
    //     suscribe(topic,route,socket.id);
    // });
    // socket.on('UNSUBSCRIBE', () => {
    //     unsuscribe(topic,route,socket.id)
    // });
>>>>>>> libreri

    socket.on('PUBLISH', (msg, ruta, callback) => {
        // topic.emitPublish(msg, route, topic);

<<<<<<< HEAD
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
=======

        escribirLog(socket, ruta, 'PUBLISH')
        callback("PUBLICASTE CON EXITO");
>>>>>>> libreri
    });

    socket.on('SUBSCRIBE', (msg, ruta, callback) => {
        // suscribe(topic,route,socket.id);

        suscribe(topic,ruta,socket.id);

        console.log('suscritor de ' + topic.topicName)

        escribirLog(socket, ruta, 'SUBSCRIBE');
        callback("SUBSCRIBE CON EXITO");
    });

    socket.on('UNSUBSCRIBE', (msg, ruta, callback) => {
        // unsuscribe(topic,route,socket.id)

        escribirLog(socket, ruta, 'UNSUBSCRIBE')
        callback("UNSUBSCRIBE CON EXITO");
    });
    
});

server.listen(3000, () => {
    console.log('listening on *:3000');
  });
