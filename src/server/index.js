import path from "path"
import express from "express"
import http from "http"
import socketio from "socket.io"

import GameLoop from "./game_loop"
import Spawner from "./spawner"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

const gameLoop = new GameLoop(io)

app.use(express.static(path.join(__dirname, "public")))

io.on("connection", (socket) => {
  socket.on("login", (data) => {
    const name = data.name
    const player = Spawner.createPlayer(name)
    const id = socket.id
    console.log("new player " + player + " (" + name + ")")
    gameLoop.players.set(id, player)

    socket.on("update", () => {
      if (gameLoop.players.has(id)) {
        gameLoop.players.set(id, player)
      }
    })

    socket.on("keydown", (key) => {
      player.inputState.keydown(key)
    })

    socket.on("keyup", (key) => {
      player.inputState.keyup(key)
    })

    socket.on("disconnect", () => {
      gameLoop.players.delete(id)
    })
  })
})

server.listen(3000)

gameLoop.start()
