import path from "path"
import express from "express"
import http from "http"
import socketio from "socket.io"

import Player from "./shared/player"
import GameLoop from "./game_loop"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

const gameLoop = new GameLoop(io)

app.use(express.static(path.join(__dirname, "public")))

io.on("connection", (socket) => {
  const player = new Player()
  const name = socket.id
  console.log("new player " + player + " (" + name + ")")
  gameLoop.players.set(name, player)

  socket.on("disconnect", () => {
    gameLoop.players.delete(name)
  })
  socket.on("update", () => {
    if (gameLoop.players.has(name)) {
      gameLoop.players.set(name, player)
    }
  })
})

server.listen(3000)

gameLoop.start()
