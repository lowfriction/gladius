import path from "path"
import express from "express"
import http from "http"
import socketio from "socket.io"

import Player from "./shared/player"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, "public")))

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
  })
})

server.listen(3000)

