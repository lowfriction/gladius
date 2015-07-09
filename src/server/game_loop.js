import {WIDTH, HEIGHT} from "./shared/constants"

export default class GameLoop {
  constructor(io) {
    this.io = io
    this.framerate = 1 / 60 * 1000
    this.frame = null
    this.rendered = null
    this.players = new Map()
  }

  getState() {
    return Array.from(this.players.values())
  }

  newFrame() {
    this.frame = setTimeout(() => this.loop(), this.framerate)
  }

  onFrame(delta) {
    this.handleInput(delta)
    this.io.sockets.emit("update", this.getState())
  }

  handleInput(delta) {
    const currentState = this.getState()

    for (const player of currentState) {
      let dX = 0
      let dY = 0
      if (player.input.isPushed("space")) {
        player.speed += 0.1
      }
      if (player.input.isPushed("up")) {
        dY = - delta * 0.25 * player.speed
      }
      if (player.input.isPushed("down")) {
        dY = delta * 0.25 * player.speed
      }
      if (player.input.isPushed("left")) {
        dX = - delta * 0.25 * player.speed
      }
      if (player.input.isPushed("right")) {
        dX = delta * 0.25 * player.speed
      }

      if (player.input.isDiagonal()) {
        dX /= Math.SQRT2
        dY /= Math.SQRT2
      }

      player.x = ~~(Math.min(WIDTH, Math.max(0, player.x + dX)))
      player.y = ~~(Math.min(HEIGHT, Math.max(0, player.y + dY)))
    }
  }

  loop() {
    const now = +new Date()
    const step = now - this.rendered

    this.newFrame()

    this.rendered = now
    this.onFrame(step)
  }

  start() {
    this.rendered = +new Date()
    this.loop()
  }
}
