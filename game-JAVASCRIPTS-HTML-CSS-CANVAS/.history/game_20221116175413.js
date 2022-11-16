let screenWidthRatio = 0.5;
let screenHeightRatio = 2;
let isCircle = "circle";

let bird;
let wall;
let score;

function game() {
    bird = new DrawComponents(20, 20, 'black', 10, 30, ((window.innerWidth * screenWidthRatio) / screenHeightRatio) / 2, "circle");
    score = new DrawComponents("18px", "Arial", "black", 0, 30, 30, "text")
    wall = [];
    gameObject.start();
}

let gameObject = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = window.innerWidth * screenWidthRatio;
        this.canvas.height = this.canvas.width / screenHeightRatio;
        this.context = this.canvas.getContext("2d");
        this.textScore = 0;
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        this.interval = setInterval(gameUpdate, 50);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function DrawComponents(width, height, color, radius, positionX, positionY, type) {
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    this.moveX = 0;
    this.moveY = 0;
    this.flapping = 10;
    this.type = type;
    this.update = function() {
        let draw = gameObject.context;
        if (this.type === isCircle){

            draw.beginPath();
            draw.fillStyle = "red";
            draw.fillRect(this.positionX, this.positionY, 25, 5);

            draw.beginPath();
            draw.fillStyle = color;
            draw.arc(this.positionX, this.positionY, radius, 0, 2 * Math.PI);
            draw.fill();

            draw.beginPath();
            draw.fillStyle = "red";
            draw.moveTo(this.positionX + 5, this.positionY + 5);
            draw.lineTo(this.positionX - 10, this.positionY + 10);
            draw.lineTo(this.positionX + 10, this.positionY + this.flapping - 50 * Math.cos(Math.PI / 6));
            draw.fill();

        } else if (this.type === "text") {
            draw.beginPath();
            draw.font = this.width + " " + this.height;
            draw.fillStyle = color;
            draw.fillText(this.text, this.positionX, this.positionY);
        } else {
            draw.beginPath();
            draw.fillStyle = color;
            draw.fillRect(this.positionX, this.positionY, this.width, this.height);
        }
        
    };
    this.move = function() {
        this.positionX += this.moveX;
        this.positionY += this.moveY; 
    };
    this.cashWith = function(obj) {

        let myLeft = this.positionX,
            myRight = this.positionX + this.width,
            myTop = this.positionY,
            myBottom = this.positionY + this.height;

        let OtherLeft = obj.positionX,
            otherRight = obj.positionX + obj.width,
            otherTop = obj.positionY,
            otherBottom = obj.positionY + obj.height;
        
        let crash = true;

        if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < OtherLeft) || (myLeft > otherRight)) {
            crash = false;
        }
        return crash;
    }
}

function gameUpdate() {
    let positionX, height, gap, minHeight, maxHeight, minGap, maxGap;

    wall.forEach(element => {
        if (bird.cashWith(element)) {
            gameObject.stop();
            return;
        }
    });

    gameObject.clear();
    gameObject.textScore = wallDistance(150) ? gameObject.textScore + 1 : gameObject.textScore;

    if ((gameObject.textScore === 1) || wallDistance(150)) {
        positionX = gameObject.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight - minHeight + 1) + minHeight);
        minGap = 50
        maxGap = 200
        gap = Math.floor(Math.random()*(maxGap - minGap + 1) + minGap);
        wall.push(new DrawComponents(20, height, "black", 0, positionX, 0, "cylinder"));
        wall.push(new DrawComponents(20, 300, "red", 0, positionX, positionX + gap, "cylinder"));
    }

    wall.forEach((element, i) => {
        wall[i].positionX -= 1;
        wall[i].move();
        wall[i].update();
    });

    bird.flapping = setFlapping();
    score.text = "SCORE: " + gameObject.textScore;
    bird.move();
    bird.update();
    score.update();
}

function wallDistance(metter) {
    return (gameObject.textScore / metter) % 1 === 0;
}

function setFlapping() {
    let flyUp = 80, flyDown = 10;
    return bird.flapping > 70 ? flyDown : flyUp;
}

function moveUp() {
    bird.moveY = -2;
}

function moveDown() {
    bird.moveY = 2;
}

function moveLeft() {
    bird.moveX = -2;
}

function moveRight() {
    bird.moveX = 2;
}

function () {
    bird.moveX = 0;
    bird.moveY = 0;
}

document.addEventListener("keydown", function(event) {
    let name = event.key,
        code = event.code;
    if (name === "ArrowUp") {
        let upBtn = document.getElementById("up-btn");
        upBtn.classList.add("btnActive");
        moveUp();
    }
    if (name === "ArrowDown") {
        let downBtn = document.getElementById("down-btn");
        downBtn.classList.add("btnActive");
        moveDown();
    }
    if (name === "ArrowLeft") {
        let leftBtn = document.getElementById("left-btn");
        leftBtn.classList.add("btnActive");
        moveLeft();
    }
    if (name === "ArrowRight") {
        let rightBtn = document.getElementById("right-btn");
        rightBtn.classList.add("btnActive");
        moveRight();
    }
}, false);

document.addEventListener("keyup", function(event) {
    let name = event.key,
        code = event.code;
    if (name === "ArrowUp") {
        let upBtn = document.getElementById("up-btn");
        upBtn.classList.remove("btnActive");
        clearMove();
    }
    if (name === "ArrowDown") {
        let downBtn = document.getElementById("down-btn");
        downBtn.classList.remove("btnActive");
        clearMove();
    }
    if (name === "ArrowLeft") {
        let leftBtn = document.getElementById("left-btn");
        leftBtn.classList.remove("btnActive");
        clearMove();
    }
    if (name === "ArrowRight") {
        let rightBtn = document.getElementById("right-btn");
        rightBtn.classList.remove("btnActive");
        clearMove();
    }
}, false);
