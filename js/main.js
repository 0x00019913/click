var container = document.getElementById("container");
var context = container.getContext('2d');
var hud = document.getElementById("hud");

var radius = 35;
var stroke = 2;
var xrange, yrange;
var x, y;
var timeDelta = 10;
var clicks = 0;
var missedClicks = 0;
var lastClickTime = 0;
var running = false;

var timer;

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
    timer = new Timer(timeDelta);
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

    timer.start();
    updateHud();
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

function updateHud() {
  var timePerClick = 0;
  var accuracy = 0;
  if (clicks>0) {
    timePerClick = timer.getTime()/clicks;
    accuracy = (clicks-missedClicks)/clicks;
  }

  var timeForLastClick = timer.getTime()-lastClickTime;
  lastClickTime = timer.getTime();

  var s = "";
  s += dataString("Time (ms)", timer.getTime());
  s += dataString("Clicks", clicks);
  s += dataString("Time for last click", timeForLastClick, true);
  s += dataString("Time per click", timePerClick.toFixed(2), true);
  s += dataString("Accuracy", accuracy.toFixed(2), true);
  s += dataString("Dimensions (px)", window.innerWidth+"x"+window.innerHeight);
  hud.innerHTML = s;
}

function dataString(title, data, zeroToNA) {
  if (zeroToNA && data==0) data = "n/a";
  return "<p>" + title + ": " + data + "</p>";
}

function onWindowResize() {
  setRanges();
}

function onTargetClick(e) {
  clicks += 1;
  /* total radius of circle */
  var dim = radius+stroke;
  /* find coordinates of mouse relative to element's center */
  var dCenterX = (e.clientX-x)-dim;
  var dCenterY = (e.clientY-y)-dim;
  /* if within circle */
  if (Math.sqrt(dCenterX*dCenterX + dCenterY*dCenterY) <= dim) {
    updateHud();
    putTarget();
  }
  else {
    missedClicks += 1;
  }
}

function randomPoint(min, max) {
  return Math.random() * (max-min) + min;
}
