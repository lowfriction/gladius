import path from "path"
import express from "express"
import http from "http"
import socketio from "socket.io"

import Player from "./shared/player"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

const game = new Game()

app.use(express.static(path.join(__dirname, "public")))


io.on("connection", (socket) => {
  const player = new Player(),
        name = socket.handshake.address
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

class Game {
  constructor() {
    this.framerate = 1/60 * 1000
    this.frame = null
    this.renderer = null
    this.players = new Map()
  }
}

Game.newFrame = function()
{
  this.frame = setTimeout(this.loop, this.framerate)
}

Game.onFrame = function(step)
{
  io.sockets.emit("update", Array.from(this.players.values()))
}

Game.loop = function()
{
  this.newFrame()

  var now = new Date().getTime(),
      step = now - this.rendered

  this.rendered = now

  this.onFrame(step)
}

server.listen(3000)

game.gameLoop()
