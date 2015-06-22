import path from "path"
import express from "express"
import http from "http"
import socketio from "socket.io"

import {rand} from "./shared/utils"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

class Player {
  constructor() {
    this.x = rand(10, 100)
    this.y = rand(10, 100)
  }
}

const players = new Map()

function getState() {
  return Array.from(players.values())
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/application.js", (req, res) => {
  res.sendFile(path.join(__dirname, "application.js"))
})

app.get("/vendor/playground.js", (req, res) => {
  res.sendFile(path.join(__dirname, "vendor", "playground.js"))
})

io.on("connection", (socket) => {
  const player = new Player()
  players.set(socket, player)
  socket.emit("update", getState())
  socket.broadcast.emit("join", player)

  socket.on("disconnect", () => {
    players.delete(socket)
    socket.broadcast.emit("update", getState())
    console.warn("Player disconnected")
  })
})

server.listen(3000)

