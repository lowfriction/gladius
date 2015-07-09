import {WIDTH, HEIGHT} from "./constants"
import Actor from "./actor"
import PlayerInput from "./player_input"

export default class Player extends Actor {
  constructor(opts = {}) {
    super(opts)
    this.name = opts.name
    this.input = new PlayerInput()
  }

  update(delta) {
    let dX = 0
    let dY = 0
    if (this.input.isPushed("space")) {
      this.speed += 0.1
    }
    if (this.input.isPushed("up")) {
      dY = -(delta * 0.25 * this.speed)
    }
    if (this.input.isPushed("down")) {
      dY = delta * 0.25 * this.speed
    }
    if (this.input.isPushed("left")) {
      dX = -(delta * 0.25 * this.speed)
    }
    if (this.input.isPushed("right")) {
      dX = delta * 0.25 * this.speed
    }

    if (this.input.isDiagonal()) {
      dX /= Math.SQRT2
      dY /= Math.SQRT2
    }

    this.x = ~~(Math.min(WIDTH, Math.max(0, this.x + dX)))
    this.y = ~~(Math.min(HEIGHT, Math.max(0, this.y + dY)))
  }
}
