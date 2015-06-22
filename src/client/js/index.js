/*global playground*/
import socketio from "socket.io-client"

let playerStates = []

const socket = socketio()

socket.on("update", (state) => {
  playerStates = state
})

socket.on("join", (newPlayer) => {
  playerStates.push(newPlayer)
})

playground({
  width: 800,
  height: 600,
  scale: 1,
  container: ".Game",

  render() {
    this.layer.clear("#272822")

    for (const player of playerStates) {
      this.layer
        .fillStyle("#efefef")
        .fillCircle(player.x, player.y, 10)
    }
  },
})
