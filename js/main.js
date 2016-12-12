var container = document.getElementById("container");
var context = container.getContext('2d');
var hud = document.getElementById("hud");

var radius = 35;
var stroke = 2;
var xrange, yrange;
var x, y;
var interval;
var timeDelta = 10;
var time = 0;
var clicks = 0;
var missedClicks = 0;
var lastClickTime = 0;
var running = false;

init();

function init () {
  hud.addEventListener('click', onHudClick, false);
}

function onHudClick() {
  if (running) {
    clicks += 1;
    missedClicks += 1;
  }
  else {
    running = true;
    setRanges();

    context.beginPath();
    context.arc(radius+stroke, radius+stroke, radius, 0, 2*Math.PI, false);
    context.fillStyle = "#666666";
    context.fill();
    context.lineWidth = stroke
    context.strokeStyle = "#111111";
    context.stroke();

    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('click', onTargetClick, false);

    startTimer();
    update();
    putTarget();
  }
}

function putTarget() {
  x = randomPoint(0, xrange);
  y = randomPoint(0, yrange);

  container.style.marginLeft = x+"px";
  container.style.marginTop = y+"px";
}

function setRanges() {
  var dim = radius*2+stroke*2;
  xrange = window.innerWidth-dim;
  yrange = window.innerHeight-dim;
  container.width = dim;
  container.height = dim;
}

function startTimer() {
  if (!interval) interval = window.setInterval(incrementTimer, timeDelta);
}

function incrementTimer() {
  time += timeDelta;
}

function update() {
  var timePerClick = 0;
  var accuracy = 0;
  if (clicks>0) {
    timePerClick = time/clicks;
    accuracy = (clicks-missedClicks)/clicks;
  }

  var timeForLastClick = time-lastClickTime;
  lastClickTime = time;

  var s = "";
  s += dataString("Time (ms)", time);
  s += dataString("Time for last click", timeForLastClick, true);
  s += dataString("Time per click", timePerClick.toFixed(2), true);
  s += dataString("Accuracy", accuracy.toFixed(2), true);
  hud.innerHTML = s;
}

function dataString(title, data, zeroToNA) {
  if (zeroToNA && (!data)) data = "n/a";

  return "<p>" + title + ": " + data + "</p>";
}

function onWindowResize() {
  setRanges();
}

function onTargetClick(e) {
  /* total radius of circle */
  var dim = radius+stroke;
  /* find coordinates of mouse relative to element's center */
  var dCenterX = (e.clientX-x)-dim;
  var dCenterY = (e.clientY-y)-dim;
  /* if within circle */
  if (Math.sqrt(dCenterX*dCenterX + dCenterY*dCenterY) <= dim) {
    update();
    putTarget();
  }
  else {
    missedClicks += 1;
  }
  clicks += 1;
}

function randomPoint(min, max) {
  return Math.random() * (max-min) + min;
}
