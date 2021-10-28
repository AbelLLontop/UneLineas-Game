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
class DivElement {
    constructor() {
        this.objeto = document.createElement('div');
        this.grosor = 6;
        this.accionesBordes = {
            "top": (color) => this.objeto.style.borderTop = `solid ${this.grosor}px ${color}`,
            "bottom": (color) => this.objeto.style.borderBottom = `solid ${this.grosor}px ${color}`,
            "left": (color) => this.objeto.style.borderLeft = `solid ${this.grosor}px ${color}`,
            "right": (color) => this.objeto.style.borderRight = `solid ${this.grosor}px ${color}`,
        };
    }
    getElement() {
        return this.objeto;
    }
    ;
    pintar(color) {
        this.objeto.style.background = `${color}`;
    }
    addElement(element) {
        this.objeto.appendChild(element);
    }
    addText(text) {
        this.objeto.innerHTML = `${text}`;
    }
    pintarBorde(color, lado) {
        this.accionesBordes[lado](color);
    }
    quitarBordes() {
        this.objeto.style.border = 'none';
    }
}
class BordeDiv extends DivElement {
    constructor(clase) {
        super();
        this.objeto.classList.add('border');
        this.objeto.classList.add('hov');
        this.objeto.classList.add(clase);
    }
}
class Borde {
    constructor(name) {
        this.name = name;
        this.objetoDiv = new BordeDiv(this.name);
        this.state = false;
    }
    activate() {
        this.state = true;
    }
}
class Lados {
    constructor() {
        this.top = new Borde('top');
        this.left = new Borde('left');
        this.right = new Borde('right');
        this.bottom = new Borde('bottom');
    }
    validarTodos() {
        return (this.bottom.state && this.top.state && this.right.state && this.left.state);
    }
    getLado(lado) {
        let retorno = {
            'top': this.top,
            'bottom': this.bottom,
            'left': this.left,
            'right': this.right
        };
        return retorno[lado];
    }
}
class CuadroDiv extends DivElement {
    constructor(lados) {
        super();
        this.objeto.classList.add('cuadrito');
        this.agregarLados(lados);
    }
    agregarLados(lados) {
        this.addElement(lados.bottom.objetoDiv.getElement());
        this.addElement(lados.left.objetoDiv.getElement());
        this.addElement(lados.right.objetoDiv.getElement());
        this.addElement(lados.top.objetoDiv.getElement());
    }
}
class Cuadro {
    constructor(position) {
        this.accionesActivarLado = {
            "top": () => this.lados.top.activate(),
            "bottom": () => this.lados.bottom.activate(),
            "left": () => this.lados.left.activate(),
            "right": () => this.lados.right.activate(),
        };
        this.position = position;
        this.state = false;
        this.lados = new Lados();
        this.objetoDiv = new CuadroDiv(this.lados);
    }
    pintarLado(color, lado) {
        if (!this.lados.validarTodos()) {
            this.objetoDiv.pintarBorde(color, lado);
            this.accionesActivarLado[lado]();
        }
        if (this.lados.validarTodos()) {
            this.state = true;
            this.rellenar(color, lado);
        }
    }
    rellenar(color, name) {
        this.objetoDiv.pintar(color);
        this.objetoDiv.addText(name.charAt(0));
        this.objetoDiv.quitarBordes();
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
                newDiv.appendChild(cuadrito.objetoDiv.getElement());
            }
            main === null || main === void 0 ? void 0 : main.appendChild(newDiv);
        }
    }
    buscarCuadroHermano(position, lado) {
        const positionExtra = {
            'bottom': { x: 0, y: -1 },
            'top': { x: 0, y: 1 },
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 }
        };
        let positionHermano = { x: position.x + positionExtra[lado].x, y: position.y + positionExtra[lado].y };
        return this.cuadros.filter((cuadro) => (cuadro.position.x == positionHermano.x) && (cuadro.position.y == positionHermano.y));
    }
}
class Jugada {
    constructor(cuadro, lado) {
        this.cuadro = cuadro;
        this.lado = lado;
    }
}
//helpers
function ladoInverso(lado) {
    const inverso = {
        'bottom': 'top',
        'top': 'bottom',
        'left': 'right',
        'right': 'left'
    };
    return inverso[lado];
}
//-------------------
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
    jugar(jugada, jugador) {
        var _a;
        let jugando = false;
        if (!jugada.cuadro.lados.getLado(jugada.lado).state) {
            jugada.cuadro.pintarLado(jugador.color, jugada.lado);
            jugada.cuadro.lados.getLado(jugada.lado).objetoDiv.getElement().classList.remove('hov');
            let hermano = this.tablero.buscarCuadroHermano(jugada.cuadro.position, jugada.lado);
            if (hermano.length > 0) {
                hermano[0].pintarLado(jugador.color, ladoInverso(jugada.lado));
                hermano[0].lados.getLado(ladoInverso(jugada.lado)).objetoDiv.getElement().classList.remove('hov');
            }
            if (!jugada.cuadro.state && !((_a = hermano[0]) === null || _a === void 0 ? void 0 : _a.state)) {
                jugando = true;
            }
        }
        return jugando;
    }
    eventos() {
        for (let cuadro of this.tablero.cuadros) {
            cuadro.lados.top.objetoDiv.getElement().addEventListener('click', () => {
                if (this.jugar(new Jugada(cuadro, 'top'), this.jugadorActual)) {
                    this.siguienteJugador();
                }
                ;
            });
            cuadro.lados.bottom.objetoDiv.getElement().addEventListener('click', () => {
                if (this.jugar(new Jugada(cuadro, 'bottom'), this.jugadorActual)) {
                    this.siguienteJugador();
                }
                ;
            });
            cuadro.lados.left.objetoDiv.getElement().addEventListener('click', () => {
                if (this.jugar(new Jugada(cuadro, 'left'), this.jugadorActual)) {
                    this.siguienteJugador();
                }
                ;
            });
            cuadro.lados.right.objetoDiv.getElement().addEventListener('click', () => {
                if (this.jugar(new Jugada(cuadro, 'right'), this.jugadorActual)) {
                    this.siguienteJugador();
                }
                ;
            });
        }
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
