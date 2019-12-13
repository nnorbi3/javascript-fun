var canvas = document.getElementById("newCanvas");
var ctx = canvas.getContext("2d");
var img = document.getElementById("cSystem");


var x;
var ballRadius = 5;
var y;
var velocity;
var vx;
var vy;
var angle;
var gravity = 10;
var step = 0.5;
var time;
var distance;
var speed;
var play;
var height;
var maxHeight;
var fac = 0.7;

function initAxis() {
    ctx.drawImage(img,0,15);
}

function reset() {
    document.getElementById('simulate').disabled = false;
    time = 0;
    distance = 0;
    x = 3;
    y = canvas.height - ballRadius;
    vx = 0;
    vy = 0;
    ctx.clearRect(0, -10000, 100000, 100000);
    initAxis();
    clearInterval(play);
}


var startVx;

function setup() {
    reset();
    document.getElementById('simulate').disabled = true;
    velocity = document.getElementById('velocity').value;
    angle = document.getElementById('angle').value * -1 * Math.PI / 180;
    speed = document.getElementById('speed').value;
    height = document.getElementById('height').value * 10;
    var max = (velocity * velocity * Math.pow(Math.sin(angle), 2) / (2 * gravity))
    maxHeight = Number(max) + Number(height / 10);
    y -= height;
    vx = velocity * Math.cos(angle);
    startVx = Math.round(vx, 2);
    vy = velocity * Math.sin(angle);
    play = setInterval(draw, 1000 / speed);
}

function draw() {
    drawBall();
    x += vx * step;
    y += vy * step;
    time += step;
    // distance = vx * time / 10;
    distance = x / 10;

    vy += gravity * step * 0.1;
    // if (y > canvas.height) {
    //     clearInterval(play);
    // }
    if (y + ballRadius > canvas.height) {
        y = canvas.height - ballRadius;
        vy *= -fac;

        if (startVx != 0) {
            if (vx - 1 >= 0) {
                vx -= 1;
            } else {
                clearInterval(play);
            }
        }
    }
}


function drawBall() {

    if (!(document.getElementById("trajectory").checked)) {

        ctx.clearRect(0, -10000, 100000, 100000);
        initAxis();
    }

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.save();
    document.getElementById("xy").innerHTML = "X: " + Math.round(x) + " Y: " + Math.round(y) + " Time: " + time / 10 + " s" + " Distance: " + Math.round(distance) + " m" + " Max Height: " + maxHeight + " m";
    document.getElementById("Vxy").innerHTML = "Vx: " + Math.round(vx, 2) + " m/s" + " Vy: " + Math.round(vy, 2) + " m/s";;
}





window.onload = function () {
    trackTransforms(ctx);

    function redraw() {
        // Clear the entire canvas
        reset();
        ctx.save();
        var p1 = ctx.transformedPoint(0, 0);
        var p2 = ctx.transformedPoint(canvas.width, canvas.height);
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, -10000, 100000, 100000);
        ctx.restore();
        initAxis();
    }
    redraw();

    var lastX = canvas.width / 2,
        lastY = canvas.height / 2;
    var dragStart, dragged;
    canvas.addEventListener('mousedown', function (evt) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX, lastY);
        dragged = false;
    }, false);
    canvas.addEventListener('mousemove', function (evt) {
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart) {
            var pt = ctx.transformedPoint(lastX, lastY);
            ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
            redraw();
        }
    }, false);
    canvas.addEventListener('mouseup', function (evt) {
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1);
    }, false);

    var scaleFactor = 1.1;
    var zoom = function (clicks) {
        var pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x, pt.y);
        var factor = Math.pow(scaleFactor, clicks);
        ctx.scale(factor, factor);
        ctx.translate(-pt.x, -pt.y);
        redraw();
    }

    var handleScroll = function (evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };
    canvas.addEventListener('DOMMouseScroll', handleScroll, false);
    canvas.addEventListener('mousewheel', handleScroll, false);
};

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function () {
        return xform;
    };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function () {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function () {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function (sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function (radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };
    var translate = ctx.translate;
    ctx.translate = function (dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };
    var transform = ctx.transform;
    ctx.transform = function (a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function (a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };
    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function (x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}