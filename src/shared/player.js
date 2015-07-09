import {WIDTH, HEIGHT, Direction, COMPASS} from "./constants"
import Actor from "./actor"
import PlayerInput from "./player_input"

export default class Player extends Actor {
  constructor(opts = {}) {
    super(opts)
    this.name = opts.name
    this.direction = Direction.NORTH
    this.input = new PlayerInput()
  }

  update(delta) {
    let dX = 0
    let dY = 0

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

    if (dX !== 0 && dY !== 0) {
      dX /= Math.SQRT2
      dY /= Math.SQRT2
    }

    this.setDirection(dX, dY)

    this.x = ~~(Math.min(WIDTH, Math.max(0, this.x + dX)))
    this.y = ~~(Math.min(HEIGHT, Math.max(0, this.y + dY)))
  }

  setDirection(dX, dY) {
    const xDir = 1 + (dX / Math.abs(dX) || 0)
    const yDir = 1 + (dY / Math.abs(dY) || 0)
    const newDirection = COMPASS[yDir][xDir]

    if (newDirection !== null) {
      this.direction = newDirection
    }
  }
}
