/*global playground, PLAYGROUND*/
import socketio from "socket.io-client"
import {WIDTH, HEIGHT, HALF_SPRITE_SIZE} from "../../shared/constants"

PLAYGROUND.Transitions.plugin = false

const name = prompt("Name")

let playerStates = []

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
    this.loadImages("character")
  },

  render() {
    this.layer.clear("#272822")

    for (const player of playerStates) {
      const labelWidth = this.layer.textBoundaries(player.name).width
      this.layer
        .fillStyle("#efefef")
        .save()
        .translate(player.x, player.y)
        .align(0.5, 0.5)
        .rotate(player.direction * -Math.PI / 4)
        .drawImage(this.images.character, 0, 0)
        .restore()
        .fillText(player.name,
                  player.x - labelWidth / 2,
                  player.y - HALF_SPRITE_SIZE - this.layer.fontHeight())
    }
  },

  keydown(ev) {
    // TODO: We need to use a keyboard mapping to send the right input types
    socket.emit("input:press", {type: ev.key})
  },

  keyup(ev) {
    // TODO: We need to use a keyboard mapping to send the right input types
    socket.emit("input:release", {type: ev.key})
  },
})
