let snakeFps = 14;
let length;
let wallsOn = false;
let width = 800;
let height = 600;
let RST = true;

function setSnakeFps(fps) {
    snakeFps = fps;
}

function snakeLengthChange() {
    document.getElementById("length").innerHTML = length;
}

function setWindowSize(x, y) {
    RST = true;
    width = x;
    height = y;
}

function snakeApp() {
    let theCanvas = document.getElementById("canvas");
    if (!theCanvas || !theCanvas.getContext) return;

    let context = theCanvas.getContext("2d");

    setCanvasSize = () => {
        theCanvas.setAttribute("width", width);
        theCanvas.setAttribute("height", height);
    }

    clearScreen = () => {
        context.fillStyle = "#cee6b4";
        context.fillRect(0, 0, width, height);
    }

    let velocity = 50;
    let move = {
        x: velocity,
        y: 0
    }
    let previousKey = "ArrowRight";
    let keyLock;

    window.addEventListener("keydown", function(e) {
        if (previousKey != e.key) {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    if (previousKey == "ArrowRight" || keyLock) break;
                    keyLock = true;
                    move.x = -velocity;
                    move.y = 0;
                    previousKey = "ArrowLeft";
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    if (previousKey == "ArrowDown" || keyLock) break;
                    keyLock = true;
                    move.x = 0;
                    move.y = -velocity;
                    previousKey = "ArrowUp";
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    if (previousKey == "ArrowLeft" || keyLock) break;
                    keyLock = true;
                    move.x = velocity;
                    move.y = 0;
                    previousKey = "ArrowRight";
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    if (previousKey == "ArrowUp" || keyLock) break;
                    keyLock = true;
                    move.x = 0;
                    move.y = velocity;
                    previousKey = "ArrowDown";
                    break;
            }
        }
    });

    let fieldSize = {
        x: 50,
        y: 50
    }

    class field {
        x = 0;
        y = 0;
        snakeBody = false;
        food = false;
        constructor(x, y, snakeBody) {
            this.x = x;
            this.y = y;
            if (snakeBody) this.snakeBody = snakeBody;
        }
    }

    let fieldMap = [];
    setFieldMap = () => {
        fieldMap = [];
        let n = 0;
        for (let i = 0; i < width / fieldSize.x; i++) {
            for (let j = 0; j < height / fieldSize.y; j++) {
                fieldMap[n] = new field(i * fieldSize.x, j * fieldSize.y);
                n++;
            }
        }
    }

    let snake = [];
    snakeReset = () => {
        snake = [new field(250, 100, true), new field(200, 100, true), new field(150, 100, true), new field(100, 100, true)];
        length = 4;
        snakeLengthChange();
        move = {
            x: velocity,
            y: 0
        }
        previousKey = "ArrowRight";
    }

    drawRect = (posX, posY, sizeX, sizeY, color) => {
        context.fillStyle = color;
        context.fillRect(posX, posY, sizeX, sizeY);
    }

    drawCircle = (posX, posY, r, color) => {
        context.beginPath();
        context.arc(posX, posY, r, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
    }

    drawField = (field, type) => {
        let color;
        let radius = fieldSize.x / 2;
        switch (type) {
            case "head":
                color = "#1f441e";
                drawRect(field.x + 3, field.y + 3, fieldSize.x - 6, fieldSize.y - 6, color);
                break;
            case "snake":
                color = "#3a6351";
                drawRect(field.x + 3, field.y + 3, fieldSize.x - 6, fieldSize.y - 6, color);
                break;
            case "food":
                color = "#9b3675";
                drawCircle(field.x + radius, field.y + radius, radius - 3, color);
                break;
        }

    }

    checkIfWall = (snakeField) => {
        if (wallsOn) {
            if (snakeField.x >= width || snakeField.x < 0) {
                return true;
            }
            if (snakeField.y >= height || snakeField.y < 0) {
                return true;
            }
            return false;
        } else {
            if (snakeField.x >= width) {
                snakeField.x = 0;
            }
            if (snakeField.x < 0) {
                snakeField.x = width - fieldSize.x;
            }
            if (snakeField.y >= height) {
                snakeField.y = 0;
            }
            if (snakeField.y < 0) {
                snakeField.y = height - fieldSize.y;
            }
        }
    }

    checkFields = (field1, field2) => {
        if (field1.x == field2.x && field1.y == field2.y) return true;
        return false;
    }

    clearFields = () => {
        fieldMap.forEach(field => {
            field.snakeBody = false;
        });
    }

    updateFieldMap = () => {
        clearFields();
        fieldMap.forEach(field => {
            snake.forEach(part => {
                if (checkFields(field, part)) {
                    field.snakeBody = true;
                };
            });
        });
    }

    let food;
    generateFood = () => {
        updateFieldMap();
        fieldMap.forEach(field => {
            field.food = false;
        });
        let index;
        do {
            index = Math.round(Math.random() * (fieldMap.length - 1));
        }
        while (fieldMap[index].snakeBody);
        fieldMap[index].food = true;
        food = fieldMap[index];
    }

    checkCollision = (newHead) => {
        if (checkFields(newHead, food)) {
            food.food = false;
            return "food";
        } else {
            let ret;
            fieldMap.forEach(field => {
                if (field.snakeBody && checkFields(newHead, field)) {
                    ret = true;
                }
            });
            if (ret) return "snake";
        }
        return false;
    }

    snakeMove = () => {
        let x = snake[0].x + move.x;
        let y = snake[0].y + move.y;
        let newHead = new field(x, y, true);
        snake.unshift(newHead);
        let ret = checkIfWall(newHead);
        let col = checkCollision(newHead);
        if (!col) {
            snake.splice(snake.length - 1);
        } else if (col == "food") {
            length++;
            snakeLengthChange();
            generateFood();
        } else if (col == "snake") {
            snakeReset();
            generateFood();
        }
        if (wallsOn && ret) {
            snakeReset();

            generateFood();
        }
    }

    drawSnake = () => {
        snakeMove();
        snake.forEach((part, i) => {
            if (i == 0) {
                drawField(part, "head");
            } else {
                drawField(part, "snake");
            }
        });
    }

    snakeInit = () => {
        setCanvasSize();
        setFieldMap();
        snakeReset();
        generateFood();
    }

    drawScreen = () => {
        clearScreen();
        updateFieldMap();
        drawSnake();
        drawField(food, "food");
        keyLock = false;
    }

    let date = new Date();
    let lastFrameTime = date.getTime() / 1000;
    let delta;
    gameLoop = () => {
        if (RST) {
            snakeInit();
            RST = false;
        }
        date = new Date();
        delta = date.getTime() / 1000 - lastFrameTime;
        if (delta > (1 / snakeFps)) {
            drawScreen();
            lastFrameTime = date.getTime() / 1000;
        }
        window.requestAnimationFrame(gameLoop);
    }
    gameLoop();
}