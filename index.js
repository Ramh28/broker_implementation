const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const fs = require('fs');
const { Socket } = require('socket.io-client');
const { publicDecrypt } = require('crypto');


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

        this.subTopic.forEach(element => {
            element.popSubscriber(idClient);
        });
        
        let deadIndex;

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

let topic = new Topic('/');

function suscribe(topicActual,route,idCliente) {
    posicionRaiz = route.indexOf('/');

    if (posicionRaiz!=0) {
        actualRaiz = route.slice(0, posicionRaiz+1);
        siguienteRaiz = route.slice(posicionRaiz+1);

        if (siguienteRaiz.length == 0) {
            topicActual.addSubscriber(idCliente);
        }else{

            let indice = topicActual.subTopic.indexOf(actualRaiz);
            
            if (indice== -1) {
                topicActual.addSubTopic(actualRaiz);
                indice = topicActual.subTopic.indexOf(actualRaiz);
            }
            
            suscribe(topicActual.subTopic[indice],siguienteRaiz,idCliente);
        }
    }else{
        topicActual.addSubscriber(idCliente);
    }
};

// Comienza el servidor y ejecuta una funcion cuando haya una nueva conexión.
io.sockets.on('connection', newConnection);


io.on('CONNECT', (socket) => {
  
    socket.on('PUBLISH', (msg, route) => {
        topic.emitPublish(msg, route, topic);
    });
    
    socket.on('SUBSCRIBE', (route) => {
        suscribe(topic,route,socket.id);
    });
    socket.on('UNSUBSCRIBE', () => {
        unsuscribe(topic,route,socket.id)
    });
    
});

server.listen(3000, () => {
    console.log('listening on *:3000');
  });
