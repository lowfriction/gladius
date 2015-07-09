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
}
