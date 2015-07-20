import {MAP_WIDTH, MAP_HEIGHT, Direction, State, COMPASS} from "./constants"
import Actor from "./actor"
import PlayerInput from "./player_input"

export default class Player extends Actor {
  constructor(opts = {}) {
    super(opts)
    this.name = opts.name
    this.direction = Direction.NORTH
    this.input = new PlayerInput()
    this.state = State.IDLE
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

    if (dX !== 0 || dY !== 0) {
      this.state = State.WALK
      this.x = ~~(Math.min(MAP_WIDTH, Math.max(0, this.x + dX)))
      this.y = ~~(Math.min(MAP_HEIGHT, Math.max(0, this.y + dY)))
    } else {
      this.state = State.IDLE
    }

    return {
      name: this.name,
      x: this.x,
      y: this.y,
      state: this.state,
      direction: this.direction,
    }
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
