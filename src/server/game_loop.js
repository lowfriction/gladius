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
    const currentState = this.getState()

    for (const actor of currentState) {
      actor.update(delta)
    }

    this.io.sockets.emit("actor:update", this.getState())
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
