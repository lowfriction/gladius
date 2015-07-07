/*global playground*/
import socketio from "socket.io-client"
import {WIDTH, HEIGHT, HALF_SPRITE_SIZE} from "../../shared/constants"

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

  render() {
    this.layer.clear("#272822")

    for (const player of playerStates) {
      const labelWidth = this.layer.textBoundaries(player.name).width
      this.layer
        .fillStyle("#efefef")
        .fillCircle(player.x, player.y, HALF_SPRITE_SIZE)
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
