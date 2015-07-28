export default class Game {
  constructor() {
    this.actors = []
    this.map = null
  }

  getActors() {
    return this.actors
  }

  setActors(actors) {
    this.actors = actors
  }
}
