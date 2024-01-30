//Define HTML elem
const board = document.getElementById('game-board');
const instructionText = document.getElementById('inst-text');
const logoDocument = document.getElementById('logo');
const score = document.getElementById('score')
const highScoreText = document.getElementById('highScore')

let gridSize= 20;
let snake = [{x:10, y:10}];
let food = generateFood();
let direction = 'left';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore=0;


//draw snake,map,fruit
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}


function drawSnake(){
   if(gameStarted){ snake.forEach((segment) => {
        const snakeElement = createGameElement('div','snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
    }
}

function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}


function setPosition(element,position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// draw();

function drawFood(){
    if(gameStarted)
    {const foodElement = createGameElement('div', 'food');
    setPosition(foodElement,food);
    board.appendChild(foodElement)
    }
}

function generateFood(){
    const x = Math.floor((Math.random()*gridSize) + 1);
    const y = Math.floor((Math.random()*gridSize) + 1);

    return {x,y};
}

//moving the snake 
function move()
{
    const head = {...snake[0]};
    switch (direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;  
        case 'right':
            head.x++;
            break;  
        case 'left':
            head.x--;
            break;         
    }

    snake.unshift(head);
    // snake.pop();
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();

        }, gameSpeedDelay);

    }
    else{
        snake.pop();
    }
}

// setInterval(()=>{
//     move();
//     draw();
// }, 200)

function startGame(){
    gameStarted = true; //keep track of running game
    instructionText.style.display = 'none';
    logoDocument.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)

}

//keypress event listner

function handlekeyPress(event){
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')){
        startGame();
    }
    else{
        switch(event.key){
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowRight':
                direction='right';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
        }
    }
}

function increaseSpeed()
{
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }else if(gameSpeedDelay > 100){
        gameSpeedDelay -=3;
    }else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }

}

function checkCollision(){
    const head = snake[0];

    if(head.x<1 || head.x > gridSize || head.y<1 || head.y > gridSize){
        resetGame();
    }

    for(let i=1;i<snake.length;i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    snake = [{x:10,y:10}];
    generateFood();
    direction='left';
    gameSpeedDelay = 200;
    stopGame();
    updateHighScore();
    updateScore();
}

function updateScore(){
    const currentScore = snake.length-1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    board.innerHTML = '';
    instructionText.style.display = 'block';
    logoDocument.style.display = 'block';

}

function updateHighScore(){
    const currentScore = snake.length-1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    // highScoreText.style.display='block';
}
document.addEventListener('keydown', handlekeyPress);
