export default class Actor {
  constructor(opts = {}) {
    this.x = opts.x || 0
    this.y = opts.y || 0
    this.speed = opts.speed || 1
  }

  setPosition(x, y) {
    this.x = x
    this.y = y
  }

  update() {
    // Do nothing by default
  }
}
