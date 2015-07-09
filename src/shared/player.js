import Actor from "./actor"
import PlayerInput from "./player_input"

export default class Player extends Actor {
  constructor(opts = {}) {
    super(opts)
    this.name = opts.name
    this.input = new PlayerInput()
  }
}
