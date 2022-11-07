function directorio(cadenaRaiz, cadenaCliente){
  let posicionRaiz;
  let actualRaiz;
  let siguienteRaiz;

  let posicionCliente;
  let actualCliente;
  let siguienteCliente;

  posicionRaiz = cadenaRaiz.indexOf('/');
  actualRaiz = cadenaRaiz.slice(0, posicionRaiz);
  siguienteRaiz = cadenaRaiz.slice(posicionRaiz+1);

  // console.log(posicionRaiz);
  console.log(actualRaiz);
  console.log(siguienteRaiz);

  posicionCliente = cadenaCliente.indexOf('/');
  actualCliente = cadenaCliente.slice(0, posicionCliente);
  siguienteCliente = cadenaCliente.slice(posicionCliente+1);

  // console.log(posicionCliente);
  console.log(actualCliente);
  console.log(siguienteCliente);

  if (actualRaiz != actualCliente){
    return console.log('No son iguales, ruta distinta desde este punto');
  }else if (siguienteRaiz.length <= 1 && siguienteCliente.length <=1){
    return console.log('estas en la ruta del cliente');
  }

  directorio(siguienteRaiz, siguienteCliente);
}
console.log(directorio(
  'home/piso1/th34/cocina/lampara/',
  'home/piso1/th33/cocina/lampara/'
  ));