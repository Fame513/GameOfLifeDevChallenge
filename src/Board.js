define(["require", "exports"], function (require, exports) {
    "use strict";
    class Board {
        constructor() {
            this.state = [];
        }
        getCell(point) {
            return (this.state[point.x] && this.state[point.x][point.y]) || new Cell;
        }
        setCell(point, state) {
            let currentCell = this.getCell(point);
            if (currentCell.state !== state)
                this.switchCell(point);
        }
        switchCell(point) {
            let currentState = this.getCell(point).state;
            for (let x = point.x - 1; x <= point.x + 1; x++) {
                for (let y = point.y - 1; y <= point.y + 1; y++) {
                    if (x === point.x && y === point.y)
                        continue;
                    this.set2dValue(this.state, { x: x, y: y }, new Cell);
                    currentState === State.Dead ? this.state[x][y].neighbors++ : this.state[x][y].neighbors--;
                }
            }
            this.set2dValue(this.state, point, new Cell);
            this.state[point.x][point.y].state = currentState === State.Dead ? State.Live : State.Dead;
            return this.state[point.x][point.y];
        }
        set2dValue(array, point, value) {
            if (!array[point.x])
                array[point.x] = [];
            if (!array[point.x][point.y]) {
                array[point.x][point.y] = value;
            }
            return array[point.x][point.y];
        }
        next() {
            let result = new Board();
            for (let sx in this.state) {
                for (let sy in this.state[sx]) {
                    let x = +sx, y = +sy;
                    let neighbors = this.neighborsCount({ x: x, y: y });
                    if ((neighbors === 3) || (neighbors === 2 && this.getCell({ x: x, y: y }).state === State.Live))
                        result.switchCell({ x: x, y: y });
                }
            }
            this.state = result.state;
            return this;
        }
        randomize(level, fromX, fromY, size) {
            for (let x = fromX; x < fromX + size; x++) {
                for (let y = fromY; y < fromY + size; y++) {
                    if (Math.random() < level)
                        this.switchCell({ x: x, y: y });
                }
            }
        }
        neighborsCount(point) {
            return this.getCell(point).neighbors;
        }
    }
    exports.Board = Board;
    (function (State) {
        State[State["Dead"] = 0] = "Dead";
        State[State["Live"] = 1] = "Live";
    })(exports.State || (exports.State = {}));
    var State = exports.State;
    class Cell {
        constructor() {
            this.state = State.Dead;
            this.neighbors = 0;
        }
    }
    exports.Cell = Cell;
});
//# sourceMappingURL=Board.js.map