type Lados = 'top' | 'bottom' | 'left' | 'right';
type TypeJugador = 'J' | 'L' | 'test' | any;
type Vector = {
    x: number,
    y: number
};
const main = document.getElementById('container')

interface DivElement {
    objeto: HTMLElement;
}

class Jugador {
    id: number;
    name: string;
    color: string;
    foco: boolean = false;
    constructor(name: TypeJugador, color: string) {
        this.name = name;
        this.color = color;
        this.id = Math.floor(Math.random() * 100);
    }

}

class BordeDivHover implements DivElement {
    objeto: HTMLElement;
    constructor(clase: Lados) {
        this.objeto = document.createElement('div');
        this.objeto.classList.add('border');
        this.objeto.classList.add('hov');
        this.objeto.classList.add(clase);
    }


}

class CuadroDiv implements DivElement {
    objeto: HTMLElement;
    private grosor: number = 6;

    bordes = {
        top: new BordeDivHover('top'),
        bottom: new BordeDivHover('bottom'),
        left: new BordeDivHover('left'),
        right: new BordeDivHover('right'),
    }


    constructor() {
        this.objeto = document.createElement('div');
        this.objeto.classList.add('cuadrito');
        this.objeto.appendChild(this.bordes.top.objeto);
        this.objeto.appendChild(this.bordes.bottom.objeto);
        this.objeto.appendChild(this.bordes.left.objeto);
        this.objeto.appendChild(this.bordes.right.objeto);

    }
    pintarTop(jugador: Jugador): void {
        this.objeto.style.borderTop = `solid ${this.grosor}px ${jugador.color}`;
    }
    pintarBottom(jugador: Jugador): void {
        this.objeto.style.borderBottom = `solid ${this.grosor}px ${jugador.color}`;
    }
    pintarRight(jugador: Jugador): void {
        this.objeto.style.borderRight = `solid ${this.grosor}px ${jugador.color}`;
    }
    pintarLeft(jugador: Jugador): void {
        this.objeto.style.borderLeft = `solid ${this.grosor}px ${jugador.color}`;
    }

    check(jugador: Jugador): void {
        this.objeto.style.backgroundColor = `${jugador.color}`;
        this.objeto.innerHTML = jugador.name.charAt(0);
        this.objeto.style.border = "none";
    }
}



class Cuadro {
    position: Vector;
    state: boolean;
    objectdiv: CuadroDiv;
    lados = {
        top: false,
        bottom: false,
        left: false,
        right: false
    }
    constructor(position: Vector, state: boolean = false) {
        this.position = position;
        this.state = state;
        this.objectdiv = new CuadroDiv();

    }

    pintar(jugador: Jugador, lado: Lados) {

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
    cuadros: Cuadro[];
    dimension: number;
    constructor(dimension: number) {
        this.cuadros = new Array();
        this.dimension = dimension;
        this.pintarTablero();
    }
    private pintarTablero() {
        for (var i = this.dimension; i >= -this.dimension; i--) {
            var e = Math.abs(i) - this.dimension;
            var o = -(e);
            let newDiv = document.createElement('div');
            newDiv.classList.add('rows');

            for (let k = e; k <= o; k++) {
                let position: Vector = { x: k, y: i };

                let cuadrito = new Cuadro(position);
                this.cuadros.push(cuadrito);
                newDiv.appendChild(cuadrito.objectdiv.objeto);
            }
            main?.appendChild(newDiv);
        }

    }
}





class Game {
    tablero: Tablero;
    jugadores: Jugador[] = [];
    jugadorActual: Jugador;

    playerPos: number = 0;
    constructor() {
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
                if (!cuadro.lados.top) {

                    cuadro.pintar(this.jugadorActual, 'top');
                    cuadro.objectdiv.bordes.top.objeto.classList.remove('hov');
                    let hermano = this.buscarCuadro({ x: (cuadro.position.x), y: (cuadro.position.y + 1) });
                    if (hermano.length > 0) {
                        hermano[0].pintar(this.jugadorActual, 'bottom');
                        hermano[0].objectdiv.bordes.bottom.objeto.classList.remove('hov');
                    }

                    if (!cuadro.state && !hermano[0]?.state) {
                        this.siguienteJugador();
                    }

                }
            })
            cuadro.objectdiv.bordes.bottom.objeto.addEventListener('click', () => {
                if (!cuadro.lados.bottom) {
                    cuadro.pintar(this.jugadorActual, 'bottom');
                    cuadro.objectdiv.bordes.bottom.objeto.classList.remove('hov');
                    let hermano = this.buscarCuadro({ x: (cuadro.position.x), y: (cuadro.position.y - 1) });
                    if (hermano.length > 0) {
                        hermano[0].pintar(this.jugadorActual, 'top');
                        hermano[0].objectdiv.bordes.top.objeto.classList.remove('hov');
                    }

                    if (!cuadro.state && !hermano[0]?.state) {
                        this.siguienteJugador();
                    }


                }
            })
            cuadro.objectdiv.bordes.left.objeto.addEventListener('click', () => {
                if (!cuadro.lados.left) {
                    cuadro.pintar(this.jugadorActual, 'left');
                    cuadro.objectdiv.bordes.left.objeto.classList.remove('hov');
                    let hermano = this.buscarCuadro({ x: (cuadro.position.x - 1), y: (cuadro.position.y) });
                    if (hermano.length > 0) {
                        hermano[0].pintar(this.jugadorActual, 'right');
                        hermano[0].objectdiv.bordes.right.objeto.classList.remove('hov');
                    }

                    if (!cuadro.state && !hermano[0]?.state) {
                        this.siguienteJugador();
                    }

                }
            })
            cuadro.objectdiv.bordes.right.objeto.addEventListener('click', () => {
                if (!cuadro.lados.right) {
                    cuadro.pintar(this.jugadorActual, 'right');
                    cuadro.objectdiv.bordes.right.objeto.classList.remove('hov');
                    let hermano = this.buscarCuadro({ x: (cuadro.position.x + 1), y: (cuadro.position.y) });
                    if (hermano.length > 0) {
                        hermano[0].pintar(this.jugadorActual, 'left');
                        hermano[0].objectdiv.bordes.left.objeto.classList.remove('hov');

                    }
                    if (!cuadro.state && !hermano[0]?.state) {
                        this.siguienteJugador();
                    }
                }
            })

        }
    }
    buscarCuadro(position: Vector): Cuadro[] | [] {
        return this.tablero.cuadros.filter((cuadro) => (cuadro.position.x == position.x) && (cuadro.position.y == position.y));
    }


    agregarJugador(jugador: Jugador) {
        this.jugadores.push(jugador);
    }



}






let game = new Game();

const usuarios = document.getElementById('usuarios') as HTMLElement;
const nombre = document.getElementById('name') as HTMLInputElement;
const color = document.getElementById('color') as HTMLInputElement;
const btn = document.getElementById('btn_add');

pintarElementos();




btn?.addEventListener('click', () => {
    let newJugador = new Jugador(nombre.value, color.value);
    game.agregarJugador(newJugador);
    pintarElementos();

})

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



function plantillaForm(jugador:Jugador): string {

    let plantilla = `  <div class="item-usuario" style="    background-color: ${hex2rgba(jugador.color,.2)};">
                            <div class="user-name" style="border-left: solid 4px ${jugador.color}; ">
                        <div>${jugador.name}</div><span>points: 20</span></div>
                            <div class="user-color" style="background:${jugador.color};">${jugador.name.charAt(0)}</div>
                        </div>`;

                        return plantilla;

}






function hex2rgba(hex:string, alpha:number) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

