var fps = 1
var fpsSetting = document.getElementById("fps-setting")
var fpsPlus = document.getElementById("fps-plus")
var fpsMinus = document.getElementById("fps-minus")

fpsSetting.value = fps

fpsSetting.addEventListener("input", function(ev) {
  var newFps = parseInt(fpsSetting.value, 10)

  if (newFps) {
    fps = newFps
  }
})

fpsPlus.addEventListener("click", function(ev) {
  fps++
  fpsSetting.value = fps

  ev.preventDefault()
})

fpsMinus.addEventListener("click", function(ev) {
  fps--
  fpsSetting.value = fps

  ev.preventDefault()
})

var app = new PLAYGROUND.Application({
  width: 64,
  height: 64,
  scale: 1,
  smoothing: false,

  container: document.querySelector(".Animation"),

  create: function() {
    this.keyboard.preventDefault = false
    this.mouse.preventContextMenu = false
    this.loadImage("sprite")
  },

  ready: function() {
    this.spriteSize = this.images.sprite.height
    this.frameCount = this.images.sprite.width / this.spriteSize
  },

  render: function() {
    var fc = this.frameCount
    var size = this.spriteSize
    var current = (this.lifetime * fps) % fc | 0
    var sX = current * this.spriteSize

    this.layer.clear("white")
    this.layer.drawImage(
      this.images.sprite,
      sX, 0, size, size,
      0, 0, size, size
    )
  }
})
