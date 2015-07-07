import {WIDTH, HEIGHT, HALF_SPRITE_SIZE} from "./shared/constants"
import {rand} from "./shared/utils"
import Player from "./shared/player"

const Spawner = {
  createPlayer(name) {
    return new Player({
      name,
      x: rand(HALF_SPRITE_SIZE, WIDTH - HALF_SPRITE_SIZE),
      y: rand(HALF_SPRITE_SIZE, HEIGHT - HALF_SPRITE_SIZE),
    })
  },
}

export default Spawner
