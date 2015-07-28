import path from "path"
import express from "express"
import http from "http"
import socketio from "socket.io"
import morgan from "morgan"

import GameLoop from "./game_loop"
import Spawner from "./spawner"

import Game from "../shared/game"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

const game = new Game()
const gameLoop = new GameLoop(io, game)
const players = new Map()

app.use(express.static(path.join(__dirname, "public")))

// Logging
app.use(morgan("dev"))

io.on("connection", (socket) => {
  const socketId = socket.id
  console.warn(socket.id)

  socket.on("input:press", (input) => {
    const player = players.get(socketId)

    player.input.press(input.type)
  })

  socket.on("input:release", (input) => {
    const player = players.get(socketId)

    player.input.release(input.type)
  })

  socket.on("join", (playerInfo) => {
    const name = playerInfo.name
    const player = Spawner.createPlayer(socketId, name)

    console.log("new player (" + name + ")")
    console.log(playerInfo)

    players.set(socketId, player)
    game.actors.push(player)

    socket.emit("worldstate", game.getActors())
  })

  socket.on("disconnect", () => {
    players.delete(socketId)
  })
})

server.listen(3000)

gameLoop.start()
