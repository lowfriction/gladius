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
    this.io.sockets.emit("update", this.getState())
  }

  loop() {
    const now = new Date().getTime()
    const step = now - this.rendered

    this.newFrame()

    this.rendered = now
    this.onFrame(step)
  }

  start() {
    this.rendered = new Date().getTime()
    this.loop()
  }
}
