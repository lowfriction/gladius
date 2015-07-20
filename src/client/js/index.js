/*global playground, PLAYGROUND*/
import socketio from "socket.io-client"
import {WIDTH, HEIGHT, SPRITE_SIZE, HALF_SPRITE_SIZE, State} from "../../shared/constants"
import PlayerBindings from "./player_bindings"

PLAYGROUND.Transitions.plugin = false

const name = prompt("Name")

let playerStates = []
let playerBindings = new PlayerBindings()

const socket = socketio()

socket.emit("join", {name})

socket.on("actor:update", (state) => {
  playerStates = state
})

socket.on("error", (error) => {
})

socket.on("worldstate", (world) => {
})

socket.on("actor:create", (newPlayer) => {
  playerStates.push(newPlayer)
})

socket.on("actor:remove", (player) => {
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
    this.layer.clear("#272822")

    for (const player of playerStates) {
      const labelWidth = this.layer.textBoundaries(player.name).width
      const spriteName = player.state === State.WALK ? "character-walk" : "character"
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
      this.layer
        .fillStyle("#efefef")
        .save()
        .translate(player.x, player.y)
        .align(0.5, 0.5)
        .rotate(player.direction * -Math.PI / 4)
        .drawImage(...spriteArgs)
        .restore()
        .fillText(player.name,
                  player.x - labelWidth / 2,
                  player.y - HALF_SPRITE_SIZE - this.layer.fontHeight())
    }
  },

  keydown(ev) {
    const action = playerBindings.getAction(ev.key)
    if (typeof action != undefined) {
      socket.emit("input:press", {type: action})
    }
  },

  keyup(ev) {
    const action = playerBindings.getAction(ev.key)
    if (typeof action != undefined) {
      socket.emit("input:release", {type: action})
    }
  },

  gamepaddown(ev) {
    const action = playerBindings.getAction(ev.button)
    if (typeof action != undefined) {
      socket.emit("input:press", {type: action})
    }
  },

  gamepadup(ev) {
    const action = playerBindings.getAction(ev.button)
    if (typeof action != undefined) {
      socket.emit("input:release", {type: action})
    }
  }
})
