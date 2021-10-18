"use strict";
const main = document.getElementById('container');
class Jugador {
    constructor(name, color) {
        this.foco = false;
        this.name = name;
        this.color = color;
        this.id = Math.floor(Math.random() * 100);
    }
}
class BordeDivHover {
    constructor(clase) {
        this.objeto = document.createElement('div');
        this.objeto.classList.add('border');
        this.objeto.classList.add('hov');
        this.objeto.classList.add(clase);
    }
}
class CuadroDiv {
    constructor() {
        this.grosor = 6;
        this.bordes = {
            top: new BordeDivHover('top'),
            bottom: new BordeDivHover('bottom'),
            left: new BordeDivHover('left'),
            right: new BordeDivHover('right'),
        };
        this.objeto = document.createElement('div');
        this.objeto.classList.add('cuadrito');
        this.objeto.appendChild(this.bordes.top.objeto);
        this.objeto.appendChild(this.bordes.bottom.objeto);
        this.objeto.appendChild(this.bordes.left.objeto);
        this.objeto.appendChild(this.bordes.right.objeto);
    }
    pintarTop(jugador) {
        this.objeto.style.borderTop = `solid ${this.grosor}px ${jugador.color}`;
    }
    pintarBottom(jugador) {
        this.objeto.style.borderBottom = `solid ${this.grosor}px ${jugador.color}`;
    }
    pintarRight(jugador) {
        this.objeto.style.borderRight = `solid ${this.grosor}px ${jugador.color}`;
    }
    pintarLeft(jugador) {
        this.objeto.style.borderLeft = `solid ${this.grosor}px ${jugador.color}`;
    }
    check(jugador) {
        this.objeto.style.backgroundColor = `${jugador.color}`;
        this.objeto.innerHTML = jugador.name.charAt(0);
        this.objeto.style.border = "none";
    }
}
class Cuadro {
    constructor(position, state = false) {
        this.lados = {
            top: false,
            bottom: false,
            left: false,
            right: false
        };
        this.position = position;
        this.state = state;
        this.objectdiv = new CuadroDiv();
    }
    pintar(jugador, lado) {
        if (!this.state) {
            switch (lado) {
                case 'top':
                    if (!this.lados.top) {
                        this.objectdiv.pintarTop(jugador);
                        this.lados.top = true;
                    }
                    break;
                case 'bottom':
                    if (!this.lados.bottom) {
                        this.objectdiv.pintarBottom(jugador);
                        this.lados.bottom = true;
                    }
                    break;
                case 'left':
                    if (!this.lados.left) {
                        this.objectdiv.pintarLeft(jugador);
                        this.lados.left = true;
                    }
                    break;
                case 'right':
                    if (!this.lados.right) {
                        this.objectdiv.pintarRight(jugador);
                        this.lados.right = true;
                    }
                    break;
                default:
                    console.log('opciones disponibles: top | right | left | bottom');
                    break;
            }
            if (this.lados.bottom && this.lados.top && this.lados.right && this.lados.left) {
                this.state = true;
                this.objectdiv.check(jugador);
            }
        }
    }
}
class Tablero {
    constructor(dimension) {
        this.cuadros = new Array();
        this.dimension = dimension;
        this.pintarTablero();
    }
    pintarTablero() {
        for (var i = this.dimension; i >= -this.dimension; i--) {
            var e = Math.abs(i) - this.dimension;
            var o = -(e);
            let newDiv = document.createElement('div');
            newDiv.classList.add('rows');
            for (let k = e; k <= o; k++) {
                let position = { x: k, y: i };
                let cuadrito = new Cuadro(position);
                this.cuadros.push(cuadrito);
                newDiv.appendChild(cuadrito.objectdiv.objeto);
            }
            main === null || main === void 0 ? void 0 : main.appendChild(newDiv);
        }
    }
}
class Game {
    constructor() {
        this.jugadores = [];
        this.playerPos = 0;
        let gameDefault = new Jugador('test', '#ffffff');
        this.jugadores.push(gameDefault);
        this.jugadorActual = this.jugadores[this.playerPos];
        this.tablero = new Tablero(3);
        this.eventos();
    }
    siguienteJugador() {
        this.playerPos++;
        if (this.playerPos >= this.jugadores.length) {
            this.playerPos = 0;
        }
        this.jugadorActual = this.jugadores[this.playerPos];
    }
    eventos() {
        //literal todo el juego xD
        for (let cuadro of this.tablero.cuadros) {
            cuadro.objectdiv.bordes.top.objeto.addEventListener('click', () => {
                var _a;
                if (!cuadro.lados.top) {
                    cuadro.pintar(this.jugadorActual, 'top');
                    cuadro.objectdiv.bordes.top.objeto.classList.remove('hov');
                    let hermano = this.buscarCuadro({ x: (cuadro.position.x), y: (cuadro.position.y + 1) });
                    if (hermano.length > 0) {
                        hermano[0].pintar(this.jugadorActual, 'bottom');
                        hermano[0].objectdiv.bordes.bottom.objeto.classList.remove('hov');
                    }
                    if (!cuadro.state && !((_a = hermano[0]) === null || _a === void 0 ? void 0 : _a.state)) {
                        this.siguienteJugador();
                    }
                }
            });
            cuadro.objectdiv.bordes.bottom.objeto.addEventListener('click', () => {
                var _a;
                if (!cuadro.lados.bottom) {
                    cuadro.pintar(this.jugadorActual, 'bottom');
                    cuadro.objectdiv.bordes.bottom.objeto.classList.remove('hov');
                    let hermano = this.buscarCuadro({ x: (cuadro.position.x), y: (cuadro.position.y - 1) });
                    if (hermano.length > 0) {
                        hermano[0].pintar(this.jugadorActual, 'top');
                        hermano[0].objectdiv.bordes.top.objeto.classList.remove('hov');
                    }
                    if (!cuadro.state && !((_a = hermano[0]) === null || _a === void 0 ? void 0 : _a.state)) {
                        this.siguienteJugador();
                    }
                }
            });
            cuadro.objectdiv.bordes.left.objeto.addEventListener('click', () => {
                var _a;
                if (!cuadro.lados.left) {
                    cuadro.pintar(this.jugadorActual, 'left');
                    cuadro.objectdiv.bordes.left.objeto.classList.remove('hov');
                    let hermano = this.buscarCuadro({ x: (cuadro.position.x - 1), y: (cuadro.position.y) });
                    if (hermano.length > 0) {
                        hermano[0].pintar(this.jugadorActual, 'right');
                        hermano[0].objectdiv.bordes.right.objeto.classList.remove('hov');
                    }
                    if (!cuadro.state && !((_a = hermano[0]) === null || _a === void 0 ? void 0 : _a.state)) {
                        this.siguienteJugador();
                    }
                }
            });
            cuadro.objectdiv.bordes.right.objeto.addEventListener('click', () => {
                var _a;
                if (!cuadro.lados.right) {
                    cuadro.pintar(this.jugadorActual, 'right');
                    cuadro.objectdiv.bordes.right.objeto.classList.remove('hov');
                    let hermano = this.buscarCuadro({ x: (cuadro.position.x + 1), y: (cuadro.position.y) });
                    if (hermano.length > 0) {
                        hermano[0].pintar(this.jugadorActual, 'left');
                        hermano[0].objectdiv.bordes.left.objeto.classList.remove('hov');
                    }
                    if (!cuadro.state && !((_a = hermano[0]) === null || _a === void 0 ? void 0 : _a.state)) {
                        this.siguienteJugador();
                    }
                }
            });
        }
    }
    buscarCuadro(position) {
        return this.tablero.cuadros.filter((cuadro) => (cuadro.position.x == position.x) && (cuadro.position.y == position.y));
    }
    agregarJugador(jugador) {
        this.jugadores.push(jugador);
    }
}
let game = new Game();
const usuarios = document.getElementById('usuarios');
const nombre = document.getElementById('name');
const color = document.getElementById('color');
const btn = document.getElementById('btn_add');
pintarElementos();
btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', () => {
    let newJugador = new Jugador(nombre.value, color.value);
    game.agregarJugador(newJugador);
    pintarElementos();
});
function pintarElementos() {
    usuarios.innerHTML = ' ';
    for (let usuario of game.jugadores) {
        usuarios.innerHTML += plantillaForm(usuario);
    }
}
/*
function quitar(name2: number) {
    game.jugadores = game.jugadores.filter((jugador => (jugador.id != name2)));
    usuarios.innerHTML = ' ';
    //  pintarElementos();
}
*/
function plantillaForm(jugador) {
    let plantilla = `  <div class="item-usuario" style="    background-color: ${hex2rgba(jugador.color, .2)};">
                            <div class="user-name" style="border-left: solid 4px ${jugador.color}; ">
                        <div>${jugador.name}</div><span>points: 20</span></div>
                            <div class="user-color" style="background:${jugador.color};">${jugador.name.charAt(0)}</div>
                        </div>`;
    return plantilla;
}
function hex2rgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    }
    else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
