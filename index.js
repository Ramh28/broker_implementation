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

    let posicionRaiz = route.indexOf('/');

    if( posicionRaiz == 0 && route.length == 1){

        this.subTopic.forEach( element => {
            element.addSubscriber(idCliente);
        })
    }

      //Si la posicionRaiz es -1 y la route es 0, entonces es el ultimo topico.

    if( posicionRaiz == -1 && route.length == 0){

        topicActual.addSubscriber(idCliente);
        return;

    }

    //Si la ruta tiene un / al principio, lo quita y procede a almacenar los topicos.

    if(posicionRaiz == 0 && route.length > 1){

        route = route.slice(posicionRaiz+1);

        posicionRaiz = route.indexOf('/');
    }


    // Cuando la ruta esta clara, entra en el buble principal.

    if (posicionRaiz !=0 ) {

        // Define la ruta actual del nuevo topico.
         actualRaiz = route.slice(0, posicionRaiz+1);

        //Define la ruta faltante por alcanzar.
         siguienteRaiz = route.slice(posicionRaiz+1);

        //Impresion de la suerte. 

        console.log(siguienteRaiz);
        console.log(actualRaiz);

            let index; 

            //Si el arreglo de sub topicos esta vacio
            if(topicActual.subTopic.length == 0){

                //Se crea el subtopico.
                topicActual.addSubTopic(actualRaiz);
                
                //Se busca el index del subtopico.
                for (let i = 0; i < topicActual.subTopic.length; i++) {
                    const element = topicActual.subTopic[i];
                    
                    if( element.topicName == actualRaiz){
                        index = i;
                    }
                    
                }
                
                //Se manda a subscribir en el subtopico.
                suscribe(topicActual.subTopic[index], siguienteRaiz, idCliente);

            } else { // De otra forma.

                //Revisa el arreglo de subtopicos para buscar el subtopico al cual se quiere subscribir.
                for (let i = 0; i < topicActual.subTopic.length; i++) {
                    
                    const element = topicActual.subTopic[i];
                    
                    if( element.topicName == actualRaiz){ 
                        console.log("Entre aca"); // Encontro el subtopico al cual se quiere subscribir.
                        index = i;
                    }
                    
                }

                console.log(index); 

                if( index == undefined){ //Si index es undefined es que el topico no esta creado, entonces...

                    // Crea el subtopico nuevo.
                    topicActual.addSubTopic(actualRaiz);

                    //Busca el index del subtopico.

                    for (let i = 0; i < topicActual.subTopic.length; i++) {
                    
                        const element = topicActual.subTopic[i];
                        
                        if( element.topicName == actualRaiz){
                            index = i;
                        }
                        
                    }

                }

                // Se subscribe all subtopico.
                suscribe(topicActual.subTopic[index], siguienteRaiz, idCliente);

            }
         // console.log('suscritor annadido');
         // console.log(topicActual.topicName);
     }
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

        console.log(topic);
        console.log("--------------------------------------");
        console.log(topic.subTopic[0]);
        console.log("--------------------------------------");
        console.log(topic.subTopic[0].subTopic[0]);
        console.log("--------------------------------------");

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
