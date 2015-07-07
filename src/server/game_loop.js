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
      if (player.inputState.isPushed("space")) {
        player.speed += 0.1
      }
      if (player.inputState.isPushed("up")) {
        player.y -= delta * 0.25 * player.speed
      }
      if (player.inputState.isPushed("down")) {
        player.y += delta * 0.25 * player.speed
      }
      if (player.inputState.isPushed("left")) {
        player.x -= delta * 0.25 * player.speed
      }
      if (player.inputState.isPushed("right")) {
        player.x += delta * 0.25 * player.speed
      }

      player.x = Math.min(WIDTH, Math.max(0, player.x))
      player.y = Math.min(HEIGHT, Math.max(0, player.y))
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
