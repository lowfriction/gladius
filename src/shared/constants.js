export const MAP_WIDTH = 1000
export const MAP_HEIGHT = 1000
export const WIDTH = 800
export const HEIGHT = 600
export const SPRITE_SIZE = 32
export const HALF_SPRITE_SIZE = SPRITE_SIZE / 2

export const Direction = {
  NORTH: 0,
  NORTH_WEST: 1,
  WEST: 2,
  SOUTH_WEST: 3,
  SOUTH: 4,
  SOUTH_EAST: 5,
  EAST: 6,
  NORTH_EAST: 7,
}

export const State = {
  IDLE: 0,
  WALK: 1,
  RUN: 2,
  PRIMARY: 3,
  SECONDARY: 4,
  TERNARY: 5,
  TAUNT: 6,
}

export const COMPASS = [
  [Direction.NORTH_WEST, Direction.NORTH, Direction.NORTH_EAST],
  [Direction.WEST, null, Direction.EAST],
  [Direction.SOUTH_WEST, Direction.SOUTH, Direction.SOUTH_EAST],
]

export const DefaultBindings = [
  ["up", "up"],
  ["z", "up"],
  ["down", "down"],
  ["s", "down"],
  ["left", "left"],
  ["q", "left"],
  ["right", "right"],
  ["d", "right"],
  ["a", "primary"],
  ["e", "secondary"],
  ["r", "ternary"],
  ["f", "taunt"],
  ["alt", "dash"],
  ["space", "lockDirection"],
]
