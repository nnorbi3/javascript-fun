var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var g = 0.1 // gravity
var fac = 0.7 // veolcity reduction factor
var ballRadius = 30;
var vx; // x velocity
var vy; // y velocity
var mx; // mouse x
var my; // mouse y

window.onload = init;

function init() {
    vx = 0;
    vy = 0;
    setInterval(update, 1);
}

function update() {
    vy += g;

    mx += vx;
    my += vy;

    if (my > canvas.height - ballRadius) {
        my = canvas.height - ballRadius;
        vy *= -fac;
    }

    drawBall(mx, my);
}

canvas.addEventListener('mousedown', function (e) {

    vx = 0;
    vy = 0;
    bounceCount = 0;
    if (e.pageX || e.pageY) {
        mx = e.pageX;
        my = e.pageY;
    } else {
        mx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        my = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    mx -= canvas.offsetLeft;
    my -= canvas.offsetTop;
    drawBall(mx, my);
})

function drawBall(x, y) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
}