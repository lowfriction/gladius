/*global playground, PLAYGROUND*/
import socketio from "socket.io-client"
import {WIDTH, HEIGHT, SPRITE_SIZE, HALF_SPRITE_SIZE} from "../../shared/constants"

PLAYGROUND.Transitions.plugin = false

const name = prompt("Name")

let playerStates = []

const socket = socketio()

socket.emit("login", {name})

socket.on("update", (state) => {
  playerStates = state
})

socket.on("join", (newPlayer) => {
  playerStates.push(newPlayer)
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
    socket.emit("keydown", ev.key)
  },

  keyup(ev) {
    socket.emit("keyup", ev.key)
  },
})
