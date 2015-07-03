import path from "path"
import express from "express"
import http from "http"
import socketio from "socket.io"

import Player from "./shared/player"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

class Game {
  constructor() {
    this.framerate = 1 / 60 * 1000
    this.frame = null
    this.rendered = null
    this.players = new Map()
  }
}

Game.prototype.getState = function() {
  return Array.from(this.players.values())
}

Game.prototype.newFrame = function() {
  this.frame = setTimeout(this.loop, this.framerate)
}

Game.prototype.onFrame = function(step) {
  console.info("onFrame " + step)
  io.sockets.emit("update", this.getState())
}

Game.prototype.loop = function() {
  let now
  let step
  this.newFrame()

  now = new Date().getTime()
  step = now - this.rendered

  this.rendered = now

  this.onFrame(step)
}

const game = new Game()

app.use(express.static(path.join(__dirname, "public")))

io.on("connection", (socket) => {
  const player = new Player()
  const name = socket.handshake.address
  game.players.set(name, player)

  socket.on("disconnect", () => {
    game.players.delete(name)
  })
  socket.on("update", () => {
    if (game.players.has(name)) {
      game.players.set(name, player)
    }
  })
})

server.listen(3000)

game.loop()

console.log("game end ?")
