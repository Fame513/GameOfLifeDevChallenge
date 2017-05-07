define(["require", "exports", "./constants", "./Board", "./constants"], function (require, exports, CONST, Board_1, constants_1) {
    "use strict";
    let canvas;
    let ctx;
    let board = new Board_1.Board();
    let stopState = board.state;
    let nextButton;
    let playButton;
    let pauseButton;
    let stopButton;
    let randomizeButton;
    let speedSlider;
    let timer;
    let changeToState;
    function drawBoard() {
        ctx.fillStyle = CONST.BORDER_COLOR;
        ctx.fillRect(0, 0, CONST.CANVAS_WIDTH, CONST.CANVAS_HEIGHT);
        let cellSize = getCellSize();
        for (let x = CONST.DISPLAY_X; x < CONST.DISPLAY_X + CONST.DISPLAY_SIZE; x++) {
            for (let y = CONST.DISPLAY_Y; y < CONST.DISPLAY_Y + CONST.DISPLAY_SIZE; y++) {
                ctx.fillStyle = board.getCell({ x: x, y: y }).state === Board_1.State.Dead ? CONST.BACKGROUND_COLOR : CONST.CELL_COLOR;
                ctx.fillRect(x * (cellSize + CONST.BORDER_SIZE) + CONST.BORDER_SIZE, y * (cellSize + CONST.BORDER_SIZE) + CONST.BORDER_SIZE, cellSize, cellSize);
            }
        }
    }
    function getCellSize() {
        return ((CONST.CANVAS_WIDTH - constants_1.BORDER_SIZE) / (CONST.DISPLAY_SIZE)) - constants_1.BORDER_SIZE;
    }
    (function () {
        canvas = document.getElementById('canvas');
        nextButton = document.getElementById('next');
        playButton = document.getElementById('play');
        pauseButton = document.getElementById('pause');
        stopButton = document.getElementById('stop');
        randomizeButton = document.getElementById('randomize');
        speedSlider = document.getElementById('speed');
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
            let pos = getCellFromPos(e.clientX - rect.left, e.clientY - rect.top);
            if (pos !== null) {
                changeToState = board.switchCell(pos).state;
                drawBoard();
            }
        }
    }
    function onBoardMouseMove(e) {
        if (e.buttons === 1) {
            let rect = canvas.getBoundingClientRect();
            let pos = getCellFromPos(e.clientX - rect.left, e.clientY - rect.top);
            if (pos !== null) {
                board.setCell(pos, changeToState);
                drawBoard();
            }
        }
    }
    function getCellFromPos(x, y) {
        let cellSize = getCellSize();
        return { x: Math.floor(x / (cellSize + constants_1.BORDER_SIZE)), y: Math.floor(y / (cellSize + constants_1.BORDER_SIZE)) };
    }
    function onNextClick() {
        board.next();
        drawBoard();
    }
    function onPlayClick() {
        if (timer)
            return;
        stopState = board.state;
        timer = setInterval(onNextClick, 1000 / (+speedSlider.value));
    }
    function onPauseClick() {
        if (timer)
            clearInterval(timer);
        timer = null;
    }
    function onStopClick() {
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
});
//# sourceMappingURL=app.js.map