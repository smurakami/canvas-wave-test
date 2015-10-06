class WaveComponent
  constructor: ->
    @y = 0
    @a = 0
    @v = 0
  update: ->
    k = 1
    friction = 0.3
    @a = - k * @y - @v * friction
    @v += @a
    @y += @v

class Wave
  constructor: (canvas, ctx) ->
    wave_len = 30
    @array = (new WaveComponent for i in [0...wave_len])
    @canvas = canvas
    @ctx = ctx
  update: ->
    for c in @array
      c.update()
  draw: ->
    @ctx.lineWidth = 2
    @ctx.strokeStyle = "#FF0000"
    defalult_y = @canvas.height * 0.3
    @ctx.beginPath()
    for i in [0...@array.length]
      x = @canvas.width / (@array.length - 1) * i
      y = @array[i].y + defalult_y
      if x == 0
        @ctx.moveTo(x, y)
      else
        @ctx.lineTo(x, y)
    @ctx.stroke()
  givePulse: ->
    @array[@array.length/2].v = 10


class Main
  constructor: ->
    @initCanvas()
    @accel = {x: 0, y: 0, z: 0}
    @wave = new Wave(@canvas, @ctx)
    @counter = 0
  initCanvas: ->
    c = document.getElementById("main_canvas");
    c.width = $(window).width()
    c.height = $(window).height()
    ctx = c.getContext("2d");
    @canvas = c
    @ctx = ctx

  update: ->
    @wave.update()
    if @counter % 10 == 0
      console.log('pulse')
      @wave.givePulse()
    @counter += 1
  draw: ->
    @ctx.clearRect(0, 0, @canvas.width, @canvas.height)
    @wave.draw()
    # @drawAccel()

  drawAccel: ->
    ctx = @ctx
    x = @accel.x
    y = @accel.y
    z = @accel.z
    h = @canvas.height
    w = @canvas.width
    max = 10
    ctx.lineWidth = 2
    ctx.strokeStyle = "#FF0000"
    ctx.fillStyle   = "#FF0000";

    ctx.beginPath()
    ctx.moveTo(w/2, h/2);
    ctx.lineTo(w/2 + x/max * w/2, h/2 + y/max * h/2);
    ctx.stroke();

    ctx.beginPath()
    ctx.arc(
      w/2 + x/max * w/2,
      h/2 + y/max * h/2,
      8, 0, 2 * Math.PI, false)
    ctx.fill()

  devicemotionHandler: (event) ->
    @accel.x = event.acceleration.x
    @accel.y = event.acceleration.y
    @accel.z = event.acceleration.z

TIMER = null

$ ->
  app = new Main

  window.addEventListener "devicemotion", (event) ->
    app.devicemotionHandler(event)

  TIMER = setInterval ->
    app.update()
    app.draw()
  , 33


getSign = (n) ->
  if n >= 0
    "+"
  else
    "-"


  num = Math.floor( Math.abs(n) * 100) / 100
  num.toString()
