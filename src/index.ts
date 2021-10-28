type TypeJugador = 'J' | 'L' | 'test' | any;
type Vector = {
    x: number,
    y: number
};
const main = document.getElementById('container');


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




class DivElement {
    objeto: HTMLElement = document.createElement('div');
    private grosor = 6;
    getElement() {
        return this.objeto;
    };
    pintar(color: String) {
        this.objeto.style.background = `${color}`;
    }
    addElement(element: HTMLElement): void {
        this.objeto.appendChild(element);
    }
    addText(text: String): void {
        this.objeto.innerHTML = `${text}`;
    }

    private accionesBordes: { [key: string]: any } = {
        "top": (color: string) => this.objeto.style.borderTop = `solid ${this.grosor}px ${color}`,
        "bottom": (color: string) => this.objeto.style.borderBottom = `solid ${this.grosor}px ${color}`,
        "left": (color: string) => this.objeto.style.borderLeft = `solid ${this.grosor}px ${color}`,
        "right": (color: string) => this.objeto.style.borderRight = `solid ${this.grosor}px ${color}`,
    }

    pintarBorde(color: string, lado: string) {
        this.accionesBordes[lado](color);
    }

    quitarBordes() {
        this.objeto.style.border = 'none';
    }

}

class BordeDiv extends DivElement {
    constructor(clase: string) {
        super();
        this.objeto.classList.add('border');
        this.objeto.classList.add('hov');
        this.objeto.classList.add(clase);
    }
}

class Borde {
    objetoDiv: BordeDiv;
    state: boolean;
    name: string;
    constructor(name: string) {
        this.name = name;
        this.objetoDiv = new BordeDiv(this.name);
        this.state = false;
    }
    activate() {
        this.state = true;
    }
}


class Lados {
    top = new Borde('top');
    left = new Borde('left');
    right = new Borde('right');
    bottom = new Borde('bottom');

    validarTodos() {
        return (this.bottom.state && this.top.state && this.right.state && this.left.state);
    }

    getLado(lado: string): Borde {
        let retorno: { [key: string]: Borde } = {
            'top': this.top,
            'bottom': this.bottom,
            'left': this.left,
            'right': this.right
        }
        return retorno[lado];
    }
}



class CuadroDiv extends DivElement {

    constructor(lados: Lados) {
        super();
        this.objeto.classList.add('cuadrito');
        this.agregarLados(lados);
    }


    private agregarLados(lados: Lados) {
        this.addElement(lados.bottom.objetoDiv.getElement());
        this.addElement(lados.left.objetoDiv.getElement());
        this.addElement(lados.right.objetoDiv.getElement());
        this.addElement(lados.top.objetoDiv.getElement());
    }

}



class Cuadro {
    position: Vector;
    state: boolean;
    objetoDiv: CuadroDiv;
    lados: Lados;


    constructor(position: Vector) {
        this.position = position;
        this.state = false;
        this.lados = new Lados();
        this.objetoDiv = new CuadroDiv(this.lados);

    }
    private accionesActivarLado: { [key: string]: any } = {
        "top": () => this.lados.top.activate(),
        "bottom": () => this.lados.bottom.activate(),
        "left": () => this.lados.left.activate(),
        "right": () => this.lados.right.activate(),

    }

    pintarLado(color: string, lado: string) {

        if (!this.lados.validarTodos()) {
            this.objetoDiv.pintarBorde(color, lado);
            this.accionesActivarLado[lado]();

        }
        if (this.lados.validarTodos()) {
            this.state = true;
            this.rellenar(color, lado)
        }
    }



    private rellenar(color: String, name: string): void {
        this.objetoDiv.pintar(color);
        this.objetoDiv.addText(name.charAt(0));
        this.objetoDiv.quitarBordes();
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
                newDiv.appendChild(cuadrito.objetoDiv.getElement());
            }
            main?.appendChild(newDiv);
        }

    }

    buscarCuadroHermano(position: Vector,lado:string): Cuadro[] | [] {
        const positionExtra:{[key:string]:Vector} = {
            'bottom': {x:0,y:-1}, 
            'top': {x:0,y:1},
            'left': {x:-1,y:0},
            'right':{x:1,y:0} 
        }
        let positionHermano:Vector = {x:position.x + positionExtra[lado].x,y:position.y + positionExtra[lado].y}; 


        return this.cuadros.filter((cuadro) => (cuadro.position.x == positionHermano.x) && (cuadro.position.y == positionHermano.y));
    }

}

class Jugada {
    cuadro: Cuadro;
    lado: string;
    constructor(cuadro: Cuadro, lado: string) {
        this.cuadro = cuadro;
        this.lado = lado;
    }
}

//helpers
function ladoInverso(lado: string): string {
    const inverso: { [key: string]: string } = {
        'bottom': 'top',
        'top': 'bottom',
        'left': 'right',
        'right': 'left'
    }
    return inverso[lado];
}




//-------------------


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

    jugar(jugada: Jugada, jugador: Jugador):boolean {
        let jugando = false;
    
        if (!jugada.cuadro.lados.getLado(jugada.lado).state) {
            jugada.cuadro.pintarLado(jugador.color, jugada.lado);
            jugada.cuadro.lados.getLado(jugada.lado).objetoDiv.getElement().classList.remove('hov');

            let hermano = this.tablero.buscarCuadroHermano(jugada.cuadro.position,jugada.lado);
            if (hermano.length > 0) {
                hermano[0].pintarLado(jugador.color, ladoInverso(jugada.lado));
                hermano[0].lados.getLado(ladoInverso(jugada.lado)).objetoDiv.getElement().classList.remove('hov');
            }

            if (!jugada.cuadro.state && !hermano[0]?.state) {
                jugando= true;
            }

        }
        return jugando;

    }

    eventos() {
        for (let cuadro of this.tablero.cuadros) {

            cuadro.lados.top.objetoDiv.getElement().addEventListener('click', () => {
                if (this.jugar(new Jugada(cuadro, 'top'), this.jugadorActual)) {
                    this.siguienteJugador();
                };
            })
            cuadro.lados.bottom.objetoDiv.getElement().addEventListener('click', () => {
                if (this.jugar(new Jugada(cuadro, 'bottom'), this.jugadorActual)) {
                    this.siguienteJugador();
                };
            })
            cuadro.lados.left.objetoDiv.getElement().addEventListener('click', () => {
                if (this.jugar(new Jugada(cuadro, 'left'), this.jugadorActual)) {
                    this.siguienteJugador();
                };
            })
            cuadro.lados.right.objetoDiv.getElement().addEventListener('click', () => {
                if (this.jugar(new Jugada(cuadro, 'right'), this.jugadorActual)) {
                    this.siguienteJugador();
                };
            })

        }
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



function plantillaForm(jugador: Jugador): string {

    let plantilla = `  <div class="item-usuario" style="    background-color: ${hex2rgba(jugador.color, .2)};">
                            <div class="user-name" style="border-left: solid 4px ${jugador.color}; ">
                        <div>${jugador.name}</div><span>points: 20</span></div>
                            <div class="user-color" style="background:${jugador.color};">${jugador.name.charAt(0)}</div>
                        </div>`;

    return plantilla;

}






function hex2rgba(hex: string, alpha: number) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

