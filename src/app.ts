import * as CONST from "./constants";
import {Board, State, Cell, Point} from "./Board";
import {BORDER_SIZE} from "./constants";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let board: Board = new Board();
let stopState: Cell[][] = board.state;
let nextButton: HTMLButtonElement;
let clearButton: HTMLButtonElement;
let playButton: HTMLButtonElement;
let pauseButton: HTMLButtonElement;
let stopButton: HTMLButtonElement;
let randomizeButton: HTMLButtonElement;
let speedSlider: HTMLInputElement;
let timer: number;
let displaySize = CONST.DISPLAY_SIZE;
let displayX = 0;
let displayY = 0;

let dragX = null;
let dragY = null;

let changeToState: State;

function drawBoard() {
    ctx.fillStyle = CONST.BORDER_COLOR;
    ctx.fillRect(0, 0, CONST.CANVAS_WIDTH, CONST.CANVAS_HEIGHT);
    let cellSize: number = getCellSize();
    for (let x = displayX; x < displayX + displaySize; x++) {
        for (let y = displayY; y < displayY + displaySize; y++) {
            ctx.fillStyle = board.getCell({x: x, y: y}).state === State.Dead ? CONST.BACKGROUND_COLOR : CONST.CELL_COLOR;
            ctx.fillRect((x - displayX) * (cellSize + CONST.BORDER_SIZE) + CONST.BORDER_SIZE, (y - displayY) * (cellSize + CONST.BORDER_SIZE) + CONST.BORDER_SIZE, cellSize, cellSize);
        }
    }
}

function getCellSize(): number {
    return ((CONST.CANVAS_WIDTH - BORDER_SIZE) / (displaySize)) - BORDER_SIZE;
}

(function (){
    canvas = <HTMLCanvasElement>document.getElementById('canvas');
    nextButton = <HTMLButtonElement>document.getElementById('next');
    clearButton = <HTMLButtonElement>document.getElementById('clear');
    playButton = <HTMLButtonElement>document.getElementById('play');
    pauseButton = <HTMLButtonElement>document.getElementById('pause');
    stopButton = <HTMLButtonElement>document.getElementById('stop');
    randomizeButton = <HTMLButtonElement>document.getElementById('randomize');
    speedSlider = <HTMLInputElement>document.getElementById('speed');
    ctx = canvas.getContext("2d");
    drawBoard();

    canvas.addEventListener("mousedown", onBoardMouseDown);
    canvas.addEventListener("mousemove", onBoardMouseMove);
    canvas.addEventListener("mouseup", onBoardMouseUp);
    canvas.addEventListener("wheel", onBoardWheel);
    nextButton.addEventListener("click", onNextClick);
    clearButton.addEventListener("click", onClearClick);
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

    if (e.buttons == 4) {
        let cellSize = getCellSize() + BORDER_SIZE;
        dragX = e.clientX + (cellSize * displayX);
        dragY = e.clientY + (cellSize * displayY);
        canvas.style.cursor = "move";
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
    if (e.buttons === 4 && dragX !== null && dragY !== null) {
        let cellSize = getCellSize() + BORDER_SIZE;
        displayX = Math.floor((dragX - e.clientX) / cellSize);
        displayY = Math.floor((dragY - e.clientY) / cellSize);
        drawBoard();
    } else {
        dragX = null;
        dragY = null;
        canvas.style.cursor = "crosshair";
    }
}

function onBoardMouseUp(e) {
        dragX = null;
        dragY = null;
        canvas.style.cursor = "crosshair";
}

function getCellFromPos(x: number, y:number): Point | null{
    let cellSize: number = getCellSize();

    return {x: Math.floor(x / (cellSize + BORDER_SIZE)) + displayX, y:  Math.floor(y / (cellSize + BORDER_SIZE)) + displayY}

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
        clearInterval(timer);
    timer = null;
}

function onStopClick(){
    onPauseClick();
    board.state = stopState;
    drawBoard();
    timer = null;
}

function onRandomizeClick() {
    board.randomize(0.33, displayX, displayY, displaySize);
    drawBoard();
}

function onBoardWheel(e) {
    e.preventDefault();
    displaySize = Math.floor(e.deltaY > 0 ? displaySize * 1.2 : displaySize / 1.2);
    if (displaySize < 5)
        displaySize = 5;
    else if (displaySize > 200)
        displaySize = 200;
    drawBoard();

}

function onSpeedChange(e) {
    if (timer) {
        onPauseClick();
        onPlayClick();
    }
}

function onClearClick() {
    board.state = [];
    drawBoard();
}