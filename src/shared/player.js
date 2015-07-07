import InputState from "./input_state"

export default class Player {
  constructor(opts) {
    opts = opts || {}
    this.name = opts.name
    this.x = opts.x || 0
    this.y = opts.y || 0
    this.inputState = new InputState()
    this.speed = 1
  }

  setPosition(x, y) {
    this.x = x
    this.y = y
  }
}
