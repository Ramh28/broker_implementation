function publica(topicActual,route,message) {

  let posicionRaiz = route.indexOf('/');

  if( posicionRaiz == 0 && route.length == 1){

    topicActual.subscribers.forEach(element => {
      io.to(element).emit('xsss', 'mensaje')
    });
  }

    //Si la posicionRaiz es -1 y la route es 0, entonces es el ultimo topico.

  if( posicionRaiz == -1 && route.length == 0){

    if (topicActual.subscribers.length == 0){
      topicActual.savedMessage = message;
    }

    topicActual.subscribers.forEach(element => {
      io.to(element).emit('xsss', 'mensaje')
    });
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
              publica(topicActual.subTopic[index], siguienteRaiz, message);

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
              publica(topicActual.subTopic[index], siguienteRaiz, message);

          }
   }
};

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