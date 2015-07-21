/*global playground, PLAYGROUND*/

import "../index.html"
import "../assets/images/character.png"
import "../assets/images/character-walk.png"
import "!file?name=vendor/[name].js!./vendor/playground.js"

import socketio from "socket.io-client"
import {
  WIDTH, HEIGHT,
  MAP_WIDTH, MAP_HEIGHT,
  SPRITE_SIZE, HALF_SPRITE_SIZE,
  State}
  from "../../shared/constants"
import PlayerBindings from "./player_bindings"

PLAYGROUND.Transitions.plugin = false

const name = prompt("Name")

const playerBindings = new PlayerBindings()

let playerStates = []
let me = null

const socket = socketio()

socket.emit("join", {name})

socket.on("actor:update", (state) => {
  playerStates = state

  // XXX: UGLY
  for (const player of playerStates) {
    if (player.name === name) {
      me = player
      break
    }
  }
})

socket.on("error", () => {
})

socket.on("worldstate", (world) => {
  playerStates = world
})

socket.on("actor:create", (newPlayer) => {
  playerStates.push(newPlayer)
})

socket.on("actor:remove", () => {
})

playground({
  width: WIDTH,
  height: HEIGHT,
  scale: 1,
  container: ".Game",

  paths: {
    base: "assets/",
  },

  create() {
    this.loadImages("character", "character-walk")
  },

  render() {
    // Render map
    const viewport = {
      x: me ? me.x - WIDTH / 2 : MAP_WIDTH / 2 - WIDTH / 2,
      y: me ? me.y - HEIGHT / 2 : MAP_HEIGHT / 2 - HEIGHT / 2,
    }
    this.layer.clear("#272822")
    if (viewport.x < 0) {
      this.layer.fillStyle("black").fillRect(0, 0, -(viewport.x), HEIGHT)
    }
    if (viewport.x + WIDTH > MAP_WIDTH) {
      const w = MAP_WIDTH - viewport.x
      this.layer.fillStyle("black").fillRect(w, 0, w, HEIGHT)
    }
    if (viewport.y < 0) {
      this.layer.fillStyle("black").fillRect(0, 0, WIDTH, -(viewport.y))
    }
    if (viewport.y + HEIGHT > MAP_HEIGHT) {
      const h = MAP_HEIGHT - viewport.y
      this.layer.fillStyle("black").fillRect(0, h, WIDTH, h)
    }

    // Render players
    for (const player of playerStates) {
      if (player.x < viewport.x - SPRITE_SIZE ||
          player.x > viewport.x + WIDTH + SPRITE_SIZE ||
          player.y < viewport.y - SPRITE_SIZE ||
          player.y > viewport.y + HEIGHT + SPRITE_SIZE) {
        continue
      }

      const labelWidth = this.layer.textBoundaries(player.name).width
      const spriteName = player.state === State.WALK ?
        "character-walk" : "character"
      const sprite = this.images[spriteName]
      let spriteArgs

      switch (player.state) {
        case State.IDLE:
          spriteArgs = [sprite, 0, 0]
          break
        case State.WALK:
          const frame = (this.lifetime * 12) % 8 | 0
          spriteArgs = [
            sprite,
            frame * 32, 0, 32, 32,
            0, 0, 32, 32,
          ]
          break
      }

      // this.images.character, 0, 0)
      const textPos = {
        x: player.x - labelWidth / 2 - viewport.x,
        y: player.y - HALF_SPRITE_SIZE - this.layer.fontHeight() - viewport.y,
      }
      this.layer
        .fillStyle("#efefef")
        .save()
        .translate(player.x - viewport.x, player.y - viewport.y)
        .align(0.5, 0.5)
        .rotate(player.direction * -Math.PI / 4)
        .drawImage(...spriteArgs)
        .restore()
        .fillText(player.name, textPos.x, textPos.y)
    }
  },

  keydown(ev) {
    const action = playerBindings.getAction(ev.key)

    if (action) {
      socket.emit("input:press", {type: action})
    }
  },

  keyup(ev) {
    const action = playerBindings.getAction(ev.key)

    if (action) {
      socket.emit("input:release", {type: action})
    }
  },

  gamepaddown(ev) {
    const action = playerBindings.getAction(ev.button)

    if (action) {
      socket.emit("input:press", {type: action})
    }
  },

  gamepadup(ev) {
    const action = playerBindings.getAction(ev.button)

    if (action) {
      socket.emit("input:release", {type: action})
    }
  },
})
