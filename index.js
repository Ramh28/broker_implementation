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

function escribirLog(socket, ruta, evento){
    fs.appendFile('./logs.txt', 'autor: ' + socket.conn.remoteAddress + ' Topico: '+ ruta + ' evento: ' + evento + '\n', (error)=>{
        if (error){
          throw error;
        }
    })
}

function suscribe(topicActual,route,idCliente) {

    let indexSlash = route.indexOf('/');

    // Si estamos en raiz y la ruta marca la raiz
    if ( indexSlash == 0 && route.length == 1 ){

        topicActual.addSubscriber(idCliente);
        return;
    }

    // si estamos en Raiz y la ruta continua
    if (indexSlash == 0 && route.slice(indexSlash+1, route.length) > 0){

        // busco el siguiente "/"
        let directorio =  route.slice(1, route.length);
        let auxSlash = directorio.indexOf('/');

        topicActual.subTopic.forEach(element => {
            if( element.topicName == route.slice(1, element.topicName.length+1) ){

                suscribe(element, route.slice(indexSlash+1, route.length), idCliente)
                return;
            }
        });

        // si no consegui el topico que quiero entonces creo uno de ultimo y continuo
        topicActual.addSubTopic( route.slice(1, auxSlash+1) );

        suscribe( topicActual.subTopic[topicActual.subTopic.length-1], route.slice(indexSlash+1, route.length), idCliente );
        return;
    }

    // si alcanzamos fin de ruta
    if ( route.slice(indexSlash+1, route.length).length == 0 ) {
        topicActual.addSubscriber(idCliente);
        return;
    }

    // si nos quedamos sin topicos y la ruta sigue
    if ( indexSlash == -1 && route.slice(indexSlash+1, route.length).length > 0 ){

        topicActual.addSubTopic(route.slice(0, indexSlash+1));
        suscribe( topicActual.subTopic[0], route.slice(indexSlash+1, route.length), idCliente );

        return;
    }

    // Si el Slash es mayor a 0 y la ruta tambien
    if ( indexSlash > 0 && route.slice(indexSlash+1, route.length).length > 0 ){

        // si no tengo mas topicos creo uno y continuo
        if (topicActual.subTopic.length == 0){
            topicActual.addSubTopic(route.slice(0, indexSlash+1));
            console.log('fin')
            suscribe( topicActual.subTopic[0], route.slice(indexSlash+1, route.length), idCliente );
            return;
        }
    
        // si tengo topicos los reviso uno a uno hasta conseguir el que es
        topicActual.subTopic.forEach(element => {
            if( element.topicName == route.slice(0, indexSlash+1) ){

                suscribe(element, route.slice(indexSlash+1, route.length), idCliente)
                return;
            }
        });

        // si no consegui el topico que quiero entonces creo uno de ultimo y continuo
        topicActual.addSubTopic( route.slice(0, indexSlash+1) );

        suscribe( topicActual.subTopic[topicActual.subTopic.length-1], route.slice(indexSlash+1, route.length), idCliente );
        return;

    }
};

let topic = new Topic('/');

io.on('connect', (socket) => {

    socket.on('PUBLISH', (msg, ruta, callback) => {
        // topic.emitPublish(msg, route, topic);


        escribirLog(socket, ruta, 'PUBLISH')
        callback("PUBLICASTE CON EXITO");
    });

    socket.on('SUBSCRIBE', (msg, ruta, callback) => {

        suscribe(topic,ruta,socket.id);

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