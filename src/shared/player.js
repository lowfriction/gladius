import Actor from "./actor"
import InputState from "./input_state"

export default class Player extends Actor {
  constructor(opts = {}) {
    super(opts)
    this.name = opts.name
    this.inputState = new InputState()
  }
}
