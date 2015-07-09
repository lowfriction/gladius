export default class PlayerInput {
  constructor() {
    this.state = {}
  }

  keydown(key) {
    this.state[key] = true
  }

  keyup(key) {
    this.state[key] = false
  }

  isPushed(key) {
    return this.state[key] || false
  }

  isDiagonal() {
    return ((this.state.up && (this.state.left || this.state.right)) ||
            (this.state.down && (this.state.left || this.state.right)))
  }
}
