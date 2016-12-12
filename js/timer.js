function Timer(dt) {
  this.interval = 0;
  this.dt = dt;
  this.time = 0;
}

Timer.prototype.getTime = function () {
  return this.time;
}

Timer.prototype.increment = function (dt) {
  this.time += dt;
}

Timer.prototype.start = function () {
  if (!this.interval) {
    this.interval = window.setInterval(incrementTimer, this.dt, this);
  }
}

function incrementTimer(timer) {
  timer.time += timer.dt;
}

Timer.prototype.stop = function () {
  if (this.interval) {
      window.clearInterval(this.interval);
  }
}

Timer.prototype.reset = function () {
  this.pause();
  this.time = 0;
}

Timer.prototype.setDelta = function (dt) {
  this.dt = dt;
}
