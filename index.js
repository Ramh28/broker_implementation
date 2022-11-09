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


io.on('connect', (socket) => {
    console.log('conecte: ' + socket.id);
    console.log(topic.topicName);
  
    escribirLog(socket, '/', 'connect')

    // socket.on('PUBLISH', (msg, route) => {
    //     topic.emitPublish(msg, route, topic);
    // });
    
    // socket.on('SUBSCRIBE', (route) => {
    //     suscribe(topic,route,socket.id);
    // });
    // socket.on('UNSUBSCRIBE', () => {
    //     unsuscribe(topic,route,socket.id)
    // });

    socket.on('PUBLISH', (msg, ruta, callback) => {
        // topic.emitPublish(msg, route, topic);


        escribirLog(socket, ruta, 'PUBLISH')
        callback("PUBLICASTE CON EXITO");
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
