// Variables globales
const expresionRegularLetras = /[^a-záéíóúÁÉÍÓÚ]/; // ^ indica negación de las letras del abecedario comunes.
const expresionRegularEspacios = /\s/;             // Busca espacios en blanco en una cadena
let letrasUsadas = [];
let letrasFalladas = [];
let palabra = "";
let abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Variables globales de estadísticas
let partidasJugadas = 0;
let partidasGanadas = 0;
let partidasPerdidas = 0;


// Juego en consola 

function juegoAhorcadoConsola() {

    // ########################################################## JUEGO ###############################################################################

    console.log('1. Iniciar el juego\n2. Estadísticas\n3. Salir');  // document.write()
    // El usuario elige una de las 3 opciones
    let opcionJuego = prompt('Elige qué quieres hacer a continuación:').toLowerCase();

    // Comprobamos la opción introducida
    while (true) {
        if (opcionJuego == '1') {
            console.log('Comienza el juego!');
            partidasJugadas++;
            iniciarJuegoConsola();
        } else if (opcionJuego == '2') {
            console.log(estadisticas());
        } else if (opcionJuego == '3') {
            break;
        } else {
            console.log(`${opcionJuego} no es una opción vaĺida. Introduce un número.`);
            opcionJuego = prompt('Elige una opción válida');
        }

        if (partidasJugadas > 0 || opcionJuego == '2') {
            reiniciarPartida();      
            console.log('1. Jugar otra vez\n2. Estadísticas\n3. Salir');  // document.write()
            opcionJuego = prompt('Elige qué quieres hacer a continuación:').toLowerCase();
        }
    }

    console.log('Has salido del juego');

}

// Juego en modo gráfico

function juegoAhorcadoGrafico() {
    iniciarJuegoGrafico();
}


// ###################################################### FUNCIONES #####################################################################
function iniciarJuegoGrafico() {
    palabra = prompt('Introduce una sola palabra:').toLowerCase();
    while (!compruebaPalabra(palabra)) {
        alert('Palabra no válida. Asegúrate de introducir una única palabra y que solo contenga letras.');
        palabra = prompt('Introduce otra palabra:').toLowerCase();
    }
    
    muestraPalabraOculta();
    creaAbecedario();
}

function pulsaLetra(letra) {
    letrasUsadas.push(letra);
    let botonLetra = document.getElementById(letra);
    // botonLetra.style.backgroundColor = 'blue';
    // botonLetra.disabled = true;
    actualizaPalabraOculta();
}
function muestraPalabraOculta() {
    let containerPalabra = document.getElementById('abc');
    containerPalabra.innerHTML = `<h1 id="oculta">${palabraEncriptada(palabra)}</h1>`;
}
function actualizaPalabraOculta() {
    let palabraOculta = document.getElementById('oculta');
    palabraOculta.innerText = palabraEncriptada(palabra);
}
function creaAbecedario() {
    let containerLetras = document.getElementById('letrasUsadas');
    for (let i=0; i<abecedario.length; i++) {
        let cajaLetra = document.createElement('div');
        cajaLetra.innerHTML = `<button id="${abecedario.charAt(i)}" onclick="pulsaLetra('${abecedario.charAt(i)}')">${abecedario.charAt(i)}</button>`;
        containerLetras.appendChild(cajaLetra);
    }
}

function iniciarJuegoConsola() {
    palabra = prompt('Introduce una sola palabra:').toLowerCase();
    while (!compruebaPalabra(palabra)) {
        console.log('Palabra no válida. Asegúrate de introducir una única palabra y que solo contenga letras.');
        palabra = prompt('Introduce otra palabra:').toLowerCase();
    }

    let palabraOculta = palabraEncriptada(palabra);
    console.log(palabraOculta); // En modo gráfico poner document.write();

    while (true) {
        let letra = prompt('Introduce una letra:').toLowerCase();
        while (!compruebaLetraValida(letra)) {
            console.log('Carácter inválido');
            letra = prompt('Introduce una única letra:').toLowerCase();
        }

        letrasUsadas.push(letra);
        if (compruebaLetraCorrecta(letra)) {
            if (compruebaSiGana()) {
                muestraResultado();
                console.log('Enhorabuena, has acertado la palabra!');
                partidasGanadas++;
                return;
            }
        } else {
            letrasFalladas.push(letra);
            if (letrasFalladas.length == 6) {
                muestraResultado();
                console.log(`Se te han acabado los intentos, has muerto\nLa palabra era ${palabra.toUpperCase()}`);
                partidasPerdidas++;
                return;
            }
        }
        muestraResultado();
    }
}
function compruebaPalabra(palabra) {
    if (expresionRegularEspacios.test(palabra)) return false;
    if (expresionRegularLetras.test(palabra)) return false; // comprueba si la palabra contiene carácteres diferentes (^) a los de la expresión regular.
    return true;
}
function palabraEncriptada(palabra) {
    let palabraEncriptada = '';
    for (let i=0; i<palabra.length; i++) {
        if (letrasUsadas.includes(palabra.charAt(i))) {
            palabraEncriptada = palabraEncriptada + palabra.charAt(i) + ' ';
        } else {
            palabraEncriptada = palabraEncriptada + '_ ';
        }
    }
    return palabraEncriptada;
}
function compruebaLetraValida(letra) {
    if (letra.length != 1) return false;
    if (expresionRegularLetras.test(letra)) return false; // comprueba si la letra es diferente (^) a alguno de los carácteres de la expresión regular.
    if (letrasUsadas.includes(letra)) return false;
    return true;
}
function compruebaLetraCorrecta(letra) {
    if (palabra.includes(letra)) return true;
    return false;
}
function muestraResultado() {
    console.log(palabraEncriptada(palabra));    // document.write();
    console.log(`Letras falladas ${letrasFalladas.length}/6: ` + letrasFalladas);
}
function compruebaSiGana() {
    let palabraOculta = palabraEncriptada(palabra).split(' ').join('');
    if (palabraOculta == palabra) return true;
    return false;
}
function estadisticas() {
    let victorias = (partidasGanadas * 100) / partidasJugadas;
    let derrotas = (partidasPerdidas * 100) / partidasJugadas;
    if (Number.isNaN(victorias)) victorias = '0';
    if (Number.isNaN(derrotas)) derrotas = '0';
    return `Total de partidas: ${partidasJugadas}\nPartidas ganadas(${victorias}%): ${partidasGanadas}\nPartidas perdidas(${derrotas}%): ${partidasPerdidas}`;
}
function reiniciarPartida() {
    letrasUsadas = [];
    letrasFalladas = [];
    palabra = '';
}