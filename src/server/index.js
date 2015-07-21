import path from "path"
import express from "express"
import http from "http"
import socketio from "socket.io"
import morgan from "morgan"

import GameLoop from "./game_loop"
import Spawner from "./spawner"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

const gameLoop = new GameLoop(io)

app.use(express.static(path.join(__dirname, "public")))

// Logging
app.use(morgan("dev"))

io.on("connection", (socket) => {
  const id = socket.id

  socket.on("input:press", (input) => {
    const player = gameLoop.players.get(id)

    player.input.press(input.type)
  })

  socket.on("input:release", (input) => {
    const player = gameLoop.players.get(id)

    player.input.release(input.type)
  })

  socket.on("join", (playerInfo) => {
    const name = playerInfo.name
    const player = Spawner.createPlayer(name)

    console.log("new player (" + name + ")")
    console.log(playerInfo)

    gameLoop.players.set(id, player)

    socket.emit("worldstate", gameLoop.getState())
  })

  socket.on("disconnect", () => {
    gameLoop.players.delete(id)
  })
})

server.listen(3000)

gameLoop.start()
