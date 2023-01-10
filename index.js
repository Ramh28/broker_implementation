const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const fs = require('fs');
const { Socket } = require('socket.io-client');


class Topic{

	constructor(topicName,type){

		this.topicName = topicName;
        this.type = type;
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
        
        if(this.savedMessage != undefined ){
            console.log("Entre aquí")
            console.log(this.subscribers);
            io.to(idClient).emit("xsss", this.savedMessage);
        }
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

function suscribe (topicActual, route, idClient){
    
    let posicionRaiz = route.indexOf('/');
    // Si la ruta es /, significa que se envia un mensaje a Raiz o a la ruta actual, segun recursividad.
    if (posicionRaiz == 0 && route.length == 1) {
      // Se subscribe a la ruta actual.
      topicActual.addSubscriber(idCliente);
      return;    
    }
  
    //Si no se envia un mensaje a raiz, o no hemos llegado a la ruta.
      //Si la ruta tiene un / al principio, lo quita y procede a almacenar los topicos.
    if(posicionRaiz == 0 && route.length > 1){
      route = route.slice(posicionRaiz+1);
      posicionRaiz = route.indexOf('/');
    }
  
    //Una vez la ruta corregida, procedemos a recorrerla.
    let actualRaiz = route.slice(0, posicionRaiz +1); //Define ruta actual para el nuevo subtopico.
    let siguienteRaiz = route.slice(posicionRaiz+1); //Define ruta por alcanzar.
  
    let index;
    // Busca el index del topico.
    for (let i = 0; i < topicActual.subTopic.length; i++) {
      const element = topicActual.subTopic[i];
      if (element.topicName == actualRaiz) {
        index = i;
      }
    }
  
    // Si no lo encuentra crea el topico.
    if (index == undefined) {
      topicActual.addSubtopic(actualRaiz,'Constructor');
      index == topicActual.subTopic.length -1;
    }
  
    suscribe(topicActual.subTopic[index],siguienteRaiz,message);
  
  }

function publish (topicActual, route, message){
    
    let posicionRaiz = route.indexOf('/');
    // Si la ruta es /, significa que se envia un mensaje a Raiz o a la ruta actual, segun recursividad.
    if (posicionRaiz == 0 && route.length == 1) {
      // Si no hay subscriptores se guarda el mensaje y retorna
      if (topicActual.subscribers.length == 0){
        topicActual.savedMessage = message;
        return;
      } else {
        // Si existen subscriptores, se envia el mensaje y retorna.
        topicActual.subscribers.forEach(element => {
          io.to(element).emit("xsss", message)
        });
        return;
      }
    }
  
    //Si no se envia un mensaje a raiz, o no hemos llegado a la ruta.
      //Si la ruta tiene un / al principio, lo quita y procede a almacenar los topicos.
    if(posicionRaiz == 0 && route.length > 1){
      route = route.slice(posicionRaiz+1);
      posicionRaiz = route.indexOf('/');
    }
  
    //Una vez la ruta corregida, procedemos a recorrerla.
    let actualRaiz = route.slice(0, posicionRaiz +1); //Define ruta actual para el nuevo subtopico.
    let siguienteRaiz = route.slice(posicionRaiz+1); //Define ruta por alcanzar.
  
    let index;
    // Busca el index del topico.
    for (let i = 0; i < topicActual.subTopic.length; i++) {
      const element = topicActual.subTopic[i];
      if (element.topicName == actualRaiz) {
        index = i;
      }
    }
  
    // Si no lo encuentra crea el topico.
    if (index == undefined) {
      topicActual.addSubtopic(actualRaiz,'Constructor');
      index == topicActual.subTopic.length -1;
    }
  
    //Envia el mensaje a todos los subscriptores del topico donde nos encontramos.
    // Si no hay subscriptores se guarda el mensaje y retorna
    if (topicActual.subscribers.length == 0){
      topicActual.savedMessage = message;
    } else {
      // Si existen subscriptores, se envia el mensaje y retorna.
      topicActual.subscribers.forEach(element => {
        io.to(element).emit("xsss", message)
      });
    }
  
    publish(topicActual.subTopic[index],siguienteRaiz,message);
  
  }
  
// Comienza el servidor y ejecuta una funcion cuando haya una nueva conexión.
// io.sockets.on('connection', newConnection);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/cliente.html');
});

io.on('connect', (socket) => {

    socket.on('PUBLISH', (msg, ruta, callback) => {
        
        publish(topic, ruta, msg);

        escribirLog(socket, ruta, 'PUBLISH')
        callback("PUBLICASTE CON EXITO");
    });

    socket.on('SUBSCRIBE', (msg, ruta, callback) => {
        // suscribe(topic,route,socket.id);

        suscribe(topic, ruta, socket.id);

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
