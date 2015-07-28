const FRAMERATE = 1 / 60 * 1000

export default class GameLoop {
  constructor(io, game) {
    this.io = io
    this.game = game
    this.frame = null
    this.rendered = null
  }

  newFrame() {
    this.frame = setTimeout(() => this.loop(), FRAMERATE)
  }

  onFrame(delta) {
    const actors = this.game.getActors()
    const updates = []

    for (const actor of actors) {
      updates.push(actor.update(delta))
    }

    this.io.sockets.emit("actor:update", updates)
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
