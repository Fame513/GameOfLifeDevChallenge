import * as CONST from "./constants";
export class Board {
    state:Cell[][];

    constructor() {

        this.state = [];
    }

    getCell(point: Point): Cell {
        return (this.state[point.x] && this.state[point.x][point.y]) || new Cell;
    }

    setCell(point: Point, state:State) {
        let currentCell: Cell = this.getCell(point);
        if (currentCell.state !== state)
            this.switchCell(point);
    }

    switchCell(point: Point):Cell {
        let currentState: State = this.getCell(point).state;
        for (let x = point.x - 1; x <= point.x + 1; x++) {
            for (let y = point.y - 1; y <= point.y + 1; y++) {
                if (x === point.x && y === point.y)
                    continue;
                this.set2dValue(this.state, {x: x, y: y}, new Cell);
                currentState === State.Dead ? this.state[x][y].neighbors++ : this.state[x][y].neighbors--;
            }
        }
        this.set2dValue(this.state, point, new Cell);
        this.state[point.x][point.y].state = currentState === State.Dead ? State.Live : State.Dead;

        return this.state[point.x][point.y];

    }

    set2dValue(array: any[][], point:Point, value) {
        if (!array[point.x])
            array[point.x] = [];
        if (!array[point.x][point.y]) {
            array[point.x][point.y] = value;
        }
        return array[point.x][point.y]
    }

    next(): Board {
        let result: Board = new Board();
        for(let sx in this.state) {
            for (let sy in this.state[sx]) {
                let x = +sx, y = +sy;
                let neighbors: number = this.neighborsCount({x: x, y: y});
                if ((neighbors === 3) || (neighbors === 2 && this.getCell({x: x, y: y}).state === State.Live))
                    result.switchCell({x: x, y: y});
            }
        }
        this.state = result.state;
        return this;
    }

    randomize(level: number, fromX: number, fromY: number, size: number) {
        for (let x = fromX; x < fromX + size; x++) {
            for (let y = fromY; y < fromY + size; y++) {
                if (Math.random() < level)
                    this.switchCell({x: x, y: y});
            }
        }
    }

    private neighborsCount(point: Point): number {
        return this.getCell(point).neighbors;
    }
}

export enum State {Dead, Live}

export class Cell {
    state: State = State.Dead;
    neighbors: number = 0;
}

export interface Point {
    readonly x: number;
    readonly y: number;
}