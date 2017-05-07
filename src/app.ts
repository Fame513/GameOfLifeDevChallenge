import * as CONST from "./constants";
import {Board, State, Cell, Point} from "./Board";
import {BORDER_SIZE} from "./constants";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let board: Board = new Board();
let stopState: Cell[][] = board.state;
let nextButton: HTMLButtonElement;
let playButton: HTMLButtonElement;
let pauseButton: HTMLButtonElement;
let stopButton: HTMLButtonElement;
let randomizeButton: HTMLButtonElement;
let speedSlider: HTMLInputElement;
let timer: number;

let changeToState: State;

function drawBoard() {
    ctx.fillStyle = CONST.BORDER_COLOR;
    ctx.fillRect(0, 0, CONST.CANVAS_WIDTH, CONST.CANVAS_HEIGHT);
    let cellSize: number = getCellSize();
    for (let x = CONST.DISPLAY_X; x < CONST.DISPLAY_X + CONST.DISPLAY_SIZE; x++) {
        for (let y = CONST.DISPLAY_Y; y < CONST.DISPLAY_Y + CONST.DISPLAY_SIZE; y++) {
            ctx.fillStyle = board.getCell({x: x, y: y}).state === State.Dead ? CONST.BACKGROUND_COLOR : CONST.CELL_COLOR;
            ctx.fillRect(x * (cellSize + CONST.BORDER_SIZE) + CONST.BORDER_SIZE, y * (cellSize + CONST.BORDER_SIZE) + CONST.BORDER_SIZE, cellSize, cellSize);
        }
    }
}

function getCellSize(): number {
    return ((CONST.CANVAS_WIDTH - BORDER_SIZE) / (CONST.DISPLAY_SIZE)) - BORDER_SIZE;
}

(function (){
    canvas = <HTMLCanvasElement>document.getElementById('canvas');
    nextButton = <HTMLButtonElement>document.getElementById('next');
    playButton = <HTMLButtonElement>document.getElementById('play');
    pauseButton = <HTMLButtonElement>document.getElementById('pause');
    stopButton = <HTMLButtonElement>document.getElementById('stop');
    randomizeButton = <HTMLButtonElement>document.getElementById('randomize');
    speedSlider = <HTMLInputElement>document.getElementById('speed');
    ctx = canvas.getContext("2d");
    drawBoard();

    canvas.addEventListener("mousedown", onBoardMouseDown);
    canvas.addEventListener("mousemove", onBoardMouseMove);
    nextButton.addEventListener("click", onNextClick);
    playButton.addEventListener("click", onPlayClick);
    pauseButton.addEventListener("click", onPauseClick);
    stopButton.addEventListener("click", onStopClick);
    randomizeButton.addEventListener("click", onRandomizeClick);
    speedSlider.addEventListener("change", onSpeedChange);

})();

function onBoardMouseDown(e) {
    if (e.buttons == 1) {
        let rect = canvas.getBoundingClientRect();
        let pos: Point = getCellFromPos(e.clientX - rect.left, e.clientY - rect.top);
        if (pos !== null) {
            changeToState = board.switchCell(pos).state;
            drawBoard();
        }
    }
}

function onBoardMouseMove(e) {
    if (e.buttons === 1) {
        let rect = canvas.getBoundingClientRect();
        let pos: Point = getCellFromPos(e.clientX - rect.left, e.clientY - rect.top);
        if (pos !== null) {
            board.setCell(pos, changeToState);
            drawBoard();
        }
    }
}

function getCellFromPos(x: number, y:number): Point | null{
    let cellSize: number = getCellSize();

    return {x: Math.floor(x / (cellSize + BORDER_SIZE)), y:  Math.floor(y / (cellSize + BORDER_SIZE))}

}

function onNextClick() {
    board.next();
    drawBoard();
}

function onPlayClick(){
    if (timer)
        return;
    stopState = board.state;
    timer = setInterval(onNextClick, 1000 / (+speedSlider.value));
}

function onPauseClick(){
    if (timer)
        clearInterval(timer)
    timer = null;
}

function onStopClick(){
    onPauseClick();
    board.state = stopState;
    drawBoard();
    timer = null;
}

function onRandomizeClick() {
    board.randomize(0.33);
    drawBoard();
}

function onSpeedChange(e) {
    if (timer) {
        onPauseClick();
        onPlayClick();
    }
}