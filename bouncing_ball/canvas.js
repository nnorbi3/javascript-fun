    // var rectangle = canvas.getBoundingClientRect(); //rectangle on click
    // var x = event.clientX - rectangle.left;
    // var y = event.clientY - rectangle.top;
var canvas = document.getElementById("newCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2
var dy = -2;
var ballRadius = 30;

function draw()
{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBall();
    x+=dx;
    y+=dy;
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius)
    {
        dx = -dx;
    }
    if(y + dy > canvas.height - ballRadius || y + dy < ballRadius)
    {
        dy = -dy;
    }
}

function drawBall()
{
    ctx.beginPath();
    ctx.arc(x,y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

setInterval(draw, 10);
