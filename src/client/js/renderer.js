import {
  WIDTH, HEIGHT,
  MAP_WIDTH, MAP_HEIGHT,
  SPRITE_SIZE, HALF_SPRITE_SIZE,
  State
} from "../../shared/constants"

export default class Renderer {
  renderPlayer(player, game, app) {
    // Render map
    const viewport = {
      x: player.x - WIDTH / 2,
      y: player.y - HEIGHT / 2,
    }

    app.layer.clear("#272822")
    if (viewport.x < 0) {
      app.layer.fillStyle("black").fillRect(0, 0, -(viewport.x), HEIGHT)
    }
    if (viewport.x + WIDTH > MAP_WIDTH) {
      const w = MAP_WIDTH - viewport.x
      app.layer.fillStyle("black").fillRect(w, 0, w, HEIGHT)
    }
    if (viewport.y < 0) {
      app.layer.fillStyle("black").fillRect(0, 0, WIDTH, -(viewport.y))
    }
    if (viewport.y + HEIGHT > MAP_HEIGHT) {
      const h = MAP_HEIGHT - viewport.y
      app.layer.fillStyle("black").fillRect(0, h, WIDTH, h)
    }

    // Render actors
    for (const actor of game.getActors()) {
      if (actor.x < viewport.x - SPRITE_SIZE ||
          actor.x > viewport.x + WIDTH + SPRITE_SIZE ||
          actor.y < viewport.y - SPRITE_SIZE ||
          actor.y > viewport.y + HEIGHT + SPRITE_SIZE) {
        continue
      }

      const labelWidth = app.layer.textBoundaries(actor.name).width
      const spriteName = actor.state === State.WALK ?
        "character-walk" : "character"
      const sprite = app.images[spriteName]
      let spriteArgs

      switch (actor.state) {
        case State.IDLE:
          spriteArgs = [sprite, 0, 0]
          break
        case State.WALK:
          const frame = (app.lifetime * 12) % 8 | 0
          spriteArgs = [
            sprite,
            frame * 32, 0, 32, 32,
            0, 0, 32, 32,
          ]
          break
      }

      const textPos = {
        x: actor.x - labelWidth / 2 - viewport.x,
        y: actor.y - HALF_SPRITE_SIZE - app.layer.fontHeight() - viewport.y,
      }
      app.layer
        .fillStyle("#efefef")
        .save()
        .translate(actor.x - viewport.x, actor.y - viewport.y)
        .align(0.5, 0.5)
        .rotate(actor.direction * -Math.PI / 4)
        .drawImage(...spriteArgs)
        .restore()
        .fillText(actor.name, textPos.x, textPos.y)
    }
  }
}
