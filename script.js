// Selecting HTML Elements
const board = document.querySelector('#game-board');
const instructionText = document.querySelector('#instruction-text');
const logo = document.querySelector('#logo');
const score = document.querySelector('#score');
const highScoreText = document.querySelector('#high-Score');

//Declaring Variables
const gridSize = 20;
let snake = [{x:10, y:10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let currentScore = 0;
let highScore = localStorage.getItem('high-Score') || 0;
 highScoreText.textContent = `High Score ${highScore}`;

// Functions

//Drawing Snake and food
function draw(){
    board.innerHTML = ' '
    drawSnake();
    drawFood();
    updateScore();
}

//Drawing Snake Element
function drawSnake(){
    snake.forEach(segment => {
        const snakeElement = createElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

//Drawing snake or food cube
function createElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Setting position of snake element or food cube
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;    
}

//Drawing food
function drawFood(){
   if (gameStarted) {
    const foodElement = createElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
   }
}

//Generate food 
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1
    const y = Math.floor(Math.random() * gridSize) + 1
    return {x, y};
}

//Moving the Snake
function move(){
    const head = {...snake[0]};

    switch (direction) {
        case 'up':
            head.y--
            break;
        case 'down':
            head.y++
            break;
        case 'right':
            head.x++
            break;
        case 'left':
            head.x--;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            draw();
            checkCollision();            
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

//Start Game Function
function startGame(){
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        draw();   
        checkCollision();     
    }, gameSpeedDelay);

}

//KeyPress Event Listner
function keyPressHandler(event){
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up'
                break;
             case 'ArrowDown':
                direction = 'down'
                break;
             case 'ArrowRight':
                 direction = 'right'
                 break;
            case 'ArrowLeft':
                  direction = 'left'
                break;    
        }
    }
}

document.addEventListener('keydown', keyPressHandler);

//Increasing Speed
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -=5;
    } else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if(gameSpeedDelay > 25){
        gameSpeedDelay -=1
    }
}

//Checking For Collision
function checkCollision(){
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
        
    }
}

//Reset Game
function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
    board.innerHTML = ' '
    
}
//Updating Scores
function updateScore(){
    currentScore = snake.length - 1;
    score.textContent = `Score ${currentScore}`;
}

//stop game function
function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

//Updating HighScores
function updateHighScore(){
  highScore = currentScore >= highScore ? currentScore : highScore;
  localStorage.setItem('high-Score', highScore);
    highScoreText.textContent = `High Score ${highScore}`;
}
