class WaveComponent
  constructor: ->
    @y = 0
    @a = 0
    @v = 0
    @next = null
    @prev = null
  connect: (prev, next) ->
    @prev = prev
    @next = next
  update: ->
    k_u = 1.0
    k_b = 0.1
    friction = 0.1
    @a = - @y * k_u - @v * friction
    if @prev
      @a -= (@y - @prev.y) * k_b
    if @next
      @a -= (@y - @next.y) * k_b
    @v += @a
    @y += @v

class Wave
  constructor: (canvas, ctx) ->
    wave_len = 7
    @array = (new WaveComponent for i in [0...wave_len])
    @connectWaveComponents()
    @gravity = {x: 12, y: 30}
    @canvas = canvas
    @ctx = ctx

  connectWaveComponents: ->
    for i in [0...@array.length]
      prev = next = null
      if i != 0
        prev = @array[i - 1]
      if i != @array.length - 1
        next = @array[i + 1]
      @array[i].connect(prev, next)

  update: ->
    for c in @array
      c.update()

  draw: ->
    @ctx.lineWidth = 2
    @ctx.strokeStyle = "#FF0000"
    @ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
    defalult_y = @canvas.height * 0.4
    size = Math.sqrt(Math.pow(@canvas.width, 2) + Math.pow(@canvas.height, 2))
    margin = (size - @canvas.width)/2
    @ctx.beginPath()
    @ctx.save()
    @ctx.translate(@canvas.width/2, @canvas.height/2)
    @ctx.rotate(Math.atan2(-@gravity.x, -@gravity.y))
    @ctx.translate(-@canvas.width/2, -@canvas.height/2)
    for i in [0...@array.length]
      x = size / (@array.length - 1) * i - margin
      y = @array[i].y + defalult_y
      if x == 0
        @ctx.moveTo(x, y)
      else
        @ctx.lineTo(x, y)
    @ctx.lineTo(@canvas.width + margin, @canvas.height + margin)
    @ctx.lineTo(-margin, @canvas.height + margin)
    @ctx.closePath()
    @ctx.fill()
    @ctx.restore()

  giveAccel: (accel) ->
    a = 3
    if accel.x > 0
      @givePulse( 0, a *  accel.x)
    else
      @givePulse(-1, a * -accel.x)

  givePulse: (i, v) ->
    while i < 0
      i += @array.length
    @array[i].v = v


class Main
  constructor: ->
    @initCanvas()
    @accel   = {x: 0, y: 0, z: 0}
    @gravity = {x: 0, y: -10, z: 0}
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
    @wave.gravity = @gravity
    @wave.giveAccel(@accel)
    @wave.update()
    @counter += 1
  draw: ->
    @ctx.clearRect(0, 0, @canvas.width, @canvas.height)
    @wave.draw()

  devicemotionHandler: (event) ->
    @accel.x = event.acceleration.x
    @accel.y = event.acceleration.y
    @accel.z = event.acceleration.z
    @gravity.x = event.accelerationIncludingGravity.x - @accel.x
    @gravity.y = event.accelerationIncludingGravity.y - @accel.y
    @gravity.z = event.accelerationIncludingGravity.z - @accel.z
    @gravity.y -= Math.abs(@gravity.z)

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


window.myevent = null

__TIMER = null

$ ->
  app = new Main

  window.addEventListener "devicemotion", (event) ->
    app.devicemotionHandler(event)


  __TIMER = setInterval ->
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
