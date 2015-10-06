// Generated by CoffeeScript 1.9.2
(function() {
  var Bubble, BubbleComponent, Main, SharedInfo, Wave, WaveComponent, __TIMER;

  SharedInfo = {
    gravity: {
      x: 0,
      y: -10,
      z: 0
    },
    accel: {
      x: 0,
      y: 0,
      z: 0
    },
    wave_height: 0.6
  };

  WaveComponent = (function() {
    function WaveComponent() {
      this.y = 0;
      this.a = 0;
      this.v = 0;
      this.next = null;
      this.prev = null;
    }

    WaveComponent.prototype.connect = function(prev, next) {
      this.prev = prev;
      return this.next = next;
    };

    WaveComponent.prototype.update = function() {
      var friction, k_b, k_u;
      k_u = 1.0;
      k_b = 0.1;
      friction = 0.12;
      this.a = -this.y * k_u - this.v * friction;
      if (this.prev) {
        this.a -= (this.y - this.prev.y) * k_b;
      }
      if (this.next) {
        this.a -= (this.y - this.next.y) * k_b;
      }
      this.v += this.a;
      return this.y += this.v;
    };

    return WaveComponent;

  })();

  Wave = (function() {
    function Wave(canvas, ctx) {
      var i, wave_len;
      wave_len = 7;
      this.array = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = wave_len; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          results.push(new WaveComponent);
        }
        return results;
      })();
      this.connectWaveComponents();
      this.canvas = canvas;
      this.ctx = ctx;
    }

    Wave.prototype.connectWaveComponents = function() {
      var i, j, next, prev, ref, results;
      results = [];
      for (i = j = 0, ref = this.array.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        prev = next = null;
        if (i !== 0) {
          prev = this.array[i - 1];
        }
        if (i !== this.array.length - 1) {
          next = this.array[i + 1];
        }
        results.push(this.array[i].connect(prev, next));
      }
      return results;
    };

    Wave.prototype.update = function() {
      this.giveAccel(SharedInfo.accel);
      return this.array.map(function(c) {
        return c.update();
      });
    };

    Wave.prototype.draw = function() {
      var defalult_y, gravity, i, j, margin, ref, size, x, y;
      gravity = SharedInfo.gravity;
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#FF0000";
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      defalult_y = this.canvas.height * (1 - SharedInfo.wave_height);
      size = Math.sqrt(Math.pow(this.canvas.width, 2) + Math.pow(this.canvas.height, 2));
      margin = (size - this.canvas.width) / 2;
      this.ctx.beginPath();
      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.rotate(Math.atan2(-gravity.x, -gravity.y));
      this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      for (i = j = 0, ref = this.array.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        x = size / (this.array.length - 1) * i - margin;
        y = this.array[i].y + defalult_y;
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.lineTo(this.canvas.width + margin, this.canvas.height + margin);
      this.ctx.lineTo(-margin, this.canvas.height + margin);
      this.ctx.closePath();
      this.ctx.fill();
      return this.ctx.restore();
    };

    Wave.prototype.giveAccel = function(accel) {
      var a;
      a = 3;
      if (accel.x > 0) {
        return this.givePulse(0, a * accel.x);
      } else {
        return this.givePulse(-1, a * -accel.x);
      }
    };

    Wave.prototype.givePulse = function(i, v) {
      while (i < 0) {
        i += this.array.length;
      }
      return this.array[i].v = v;
    };

    return Wave;

  })();

  BubbleComponent = (function() {
    function BubbleComponent() {
      this.initPos();
    }

    BubbleComponent.prototype.initPos = function() {
      this.x = Math.random();
      this.vx = Math.random() * 0.1;
      this.y = 0;
      return this.vy = 0;
    };

    BubbleComponent.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.01;
      if (this.x > 1) {
        return this.initPos;
      }
    };

    return BubbleComponent;

  })();

  Bubble = (function() {
    function Bubble(canvas, ctx) {
      var bubble_num, i;
      this.canvas = canvas;
      this.ctx = ctx;
      bubble_num = 20;
      this.array = (function() {
        var j, results;
        results = [];
        for (i = j = 0; j < 20; i = ++j) {
          results.push(new BubbleComponent);
        }
        return results;
      })();
    }

    Bubble.prototype.update = function() {
      return this.array.map(function(c) {
        return c.update();
      });
    };

    Bubble.prototype.draw = function() {
      var i, j, len, ref, results, x;
      ref = this.array.length;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push(x = this.array[i].x * this.canvas);
      }
      return results;
    };

    return Bubble;

  })();

  Main = (function() {
    function Main() {
      this.initCanvas();
      this.wave = new Wave(this.canvas, this.ctx);
      this.bubble = new Bubble(this.canvas, this.ctx);
      this.counter = 0;
    }

    Main.prototype.initCanvas = function() {
      var c, ctx;
      c = document.getElementById("main_canvas");
      c.width = $(window).width();
      c.height = $(window).height();
      ctx = c.getContext("2d");
      this.canvas = c;
      return this.ctx = ctx;
    };

    Main.prototype.update = function() {
      this.wave.update();
      this.bubble.update();
      return this.counter += 1;
    };

    Main.prototype.draw = function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return this.wave.draw();
    };

    Main.prototype.devicemotionHandler = function(event) {
      SharedInfo.accel.x = event.acceleration.x;
      SharedInfo.accel.y = event.acceleration.y;
      SharedInfo.accel.z = event.acceleration.z;
      SharedInfo.gravity.x = event.accelerationIncludingGravity.x - SharedInfo.accel.x;
      SharedInfo.gravity.y = event.accelerationIncludingGravity.y - SharedInfo.accel.y;
      SharedInfo.gravity.z = event.accelerationIncludingGravity.z - SharedInfo.accel.z;
      return SharedInfo.gravity.y -= Math.abs(SharedInfo.gravity.z);
    };

    Main.prototype.drawAccel = function() {
      var ctx, h, max, w, x, y, z;
      ctx = this.ctx;
      x = this.accel.x;
      y = this.accel.y;
      z = this.accel.z;
      h = this.canvas.height;
      w = this.canvas.width;
      max = 10;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FF0000";
      ctx.fillStyle = "#FF0000";
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2);
      ctx.lineTo(w / 2 + x / max * w / 2, h / 2 + y / max * h / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w / 2 + x / max * w / 2, h / 2 + y / max * h / 2, 8, 0, 2 * Math.PI, false);
      return ctx.fill();
    };

    return Main;

  })();

  window.myevent = null;

  __TIMER = null;

  $(function() {
    var app;
    app = new Main;
    window.addEventListener("devicemotion", function(event) {
      return app.devicemotionHandler(event);
    });
    return __TIMER = setInterval(function() {
      app.update();
      return app.draw();
    }, 33);
  });

}).call(this);
