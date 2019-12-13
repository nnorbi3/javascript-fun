var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var gameStarted = false;
var keys = [];
var x =  canvas.width/2;
var y = canvas.height-30;
var color = "green";
var gs = 30; // grid size;
var swidth = gs;
var sheight = swidth;
var dx = 0;
var dy = -30;
var gameOver = false;
var up = true;
var down = false;
var left = false;
var right = false;
var randomX;
var randomY;
var pointActive = false;
var tail = 0;
var nextX;
var nextY;
var next = [];
var score = 0;
var highscore = 0;
var enableTurning = true;
var arr = [37, 38, 39, 40];



var directions = {
    up: function(){
        dx = 0,
        dy = -30,
        up = true,
        down = false,
        left = false,
        right = false
    },
    down: function(){
        dx = 0,
        dy = 30,
        up = false,
        down = true,
        left = false,
        right = false
    },
    left: function(){
        dx = -30,
        dy = 0,
        up = false,
        down = false,
        left = true,
        right = false
    },
    right: function(){
        dx = 30,
        dy = 0,
        up = false,
        down = false,
        left = false,
        right = true
    }
}


document.addEventListener("keydown", function(event) {
    
    if(!gameStarted && event.keyCode === 13)
    {
        startGame();
    }
    
    if(arr.includes(event.keyCode)) keys[event.keyCode] = true;
 
});

document.addEventListener("keyup", function(event){

    keys[event.keyCode] = false;
});

context.font = "20px Arial";
context.fillText("Press Enter To Start", canvas.width/2-100, canvas.height/2-50);

function startGame()
{
    gameStarted = true;
    
        var gameTime = setInterval(function(){
            if(!gameOver)
            {
                clearCanvas();
                game();
            }
            else
            {
                clearInterval(gameTime);
                context.fillStyle = "black";
                context.font = "20px Arial";
                clearCanvas();
                context.fillText("Game Over | Press Enter To Start Again", canvas.width/2-165, canvas.height/2-50);
                reset();
            }
            
        }, 1000/15)
}

function reset(){
    gameStarted = false;
    gameOver = false;
    x = canvas.width/2;
    y = canvas.height-30;
    up = true;
    down = false;
    left = false;
    right = false;
    dx = 0;
    dy = -30;
    tail = 0;
    score = 0;
    randomPoint();
}

function game(){
    
    //turning
    turning();

    draw();

    //hitting walls - game over
    if(x + dx > canvas.width || x + dx < -30)
    {
        gameOver = true;
        if(score > highscore)
        highscore = score;
    }
    if(y + dy > canvas.height || y + dy < -30)
    {
        gameOver = true;
        if(score > highscore)
        highscore = score;
    }

    //going through walls
    // if(x > canvas.width)
    // {
    //     x = 0;
    // }
    // else if(x < 0)
    // {
    //     x = canvas.width;
    // }

    // if(y > canvas.height)
    // {
    //     y = 0;
    // }
    // else if(y < 0)
    // {
    //     y = canvas.height;
    // }
    

    //hitting a point
    if(x == randomX && y == randomY)
    {
        tail++;
        score++;
        randomPoint();
        drawPoint();
    }
    if(!pointActive)
    {
        randomPoint();
    }       
    drawPoint(); 

    x+=dx;
    y+=dy;
    nextX = x;
    nextY = y;
    
    nextX -= dx;
    nextY -= dy;
    next.push({x: nextX, y: nextY});
    context.fillStyle = color;
    for(var i = 0; i < tail; i++)
    {
        context.fillRect(next[i].x, next[i].y, swidth, sheight);
        if(next[i].x == x && next[i].y == y)
        {
            gameOver = true;
            if(score > highscore)
            highscore = score;
        }
    }
    while(next.length>tail) {
        next.shift();
    }
    context.fillStyle = "black";
    context.fillText("Score: " + score, 20,20);
    context.fillText("Highscore: " + highscore, 20,40);
    enableTurning = true;
}


function draw(){
    context.fillStyle = color;
    context.fillRect(x, y, swidth, sheight);
}

function turning(){
    if(enableTurning)
    {
        if(keys[38] && !down)
        {
            directions.up();
            enableTurning = false;
        }
        if(keys[40] && !up)
        {
            directions.down();
            enableTurning = false;
        }
        if(keys[37] && !right)
        {
            directions.left();
            enableTurning = false;
        }
        if(keys[39] && !left)
        {
            directions.right();
            enableTurning = false;
        }
    }
}

function randomPoint(){

    randomX = Math.floor(Math.random() * gs) * gs;
    randomY = Math.floor(Math.random() * gs) * gs;
    pointActive = true;
}

function drawPoint(){
    context.fillStyle = "red";
    context.fillRect(randomX, randomY, swidth, sheight);
}

function clearCanvas(){
    context.clearRect(0,0, canvas.width, canvas.height);
}

