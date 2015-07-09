export default class PlayerInput {
  constructor() {
    this.state = {
      up: false,
      down: false,
      left: false,
      right: false,
      primary: false,
      secondary: false,
      ternary: false,
      taunt: false,
      dash: false,
      lockDirection: false,
    }
  }

  press(type) {
    this.state[type] = true
  }

  release(type) {
    this.state[type] = false
  }

  isPushed(key) {
    return this.state[key] || false
  }
}
