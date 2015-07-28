/*global playground, PLAYGROUND*/

import "../index.html"
import "../assets/images/character.png"
import "../assets/images/character-walk.png"
import "!file?name=vendor/[name].js!./vendor/playground.js"

import {WIDTH, HEIGHT} from "../../shared/constants"

import socketio from "socket.io-client"
import Game from "../../shared/game"
import PlayerBindings from "./player_bindings"
import Renderer from "./renderer"

PLAYGROUND.Transitions.plugin = false

const name = prompt("Name")

const playerBindings = new PlayerBindings()
const game = new Game()

const socket = socketio()

let me = null

socket.emit("join", {name})

socket.on("actor:update", (actors) => {
  for (const actor of actors) {
    if (actor.id === socket.id) {
      me = actor
    }
  }

  game.setActors(actors)
})

socket.on("error", () => {
})

socket.on("worldstate", (actors) => {
  for (const actor of actors) {
    if (actor.id === socket.id) {
      me = actor
    }
  }

  game.setActors(actors)
})

socket.on("actor:create", (newPlayer) => {
  game.getActors().push(newPlayer)
})

socket.on("actor:remove", () => {
})

playground({
  width: WIDTH,
  height: HEIGHT,
  scale: 1,
  container: ".Game",

  paths: {
    base: "assets/",
  },

  create() {
    this.loadImages("character", "character-walk")
    this.renderer = new Renderer()
  },

  render() {
    if (me) {
      this.renderer.renderPlayer(me, game, this)
    } else {
      this.layer.clear("black").fillStyle("white").fillText("Spectator", 0, 0)
      // this.renderer.renderSpectator(...)
    }
  },

  keydown(ev) {
    const action = playerBindings.getAction(ev.key)

    if (action) {
      socket.emit("input:press", {type: action})
    }
  },

  keyup(ev) {
    const action = playerBindings.getAction(ev.key)

    if (action) {
      socket.emit("input:release", {type: action})
    }
  },

  gamepaddown(ev) {
    const action = playerBindings.getAction(ev.button)

    if (action) {
      socket.emit("input:press", {type: action})
    }
  },

  gamepadup(ev) {
    const action = playerBindings.getAction(ev.button)

    if (action) {
      socket.emit("input:release", {type: action})
    }
  },
})
