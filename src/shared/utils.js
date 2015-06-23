export function rand(min, max) {
  return ~~(Math.random() * (max - min + 1)) + min
}

export function uniqueId() {
  const timestamp = +new Date()
  const random = rand(1000, 9999)
  const digest = [timestamp, random].map(i => i.toString(36)).join("")

  return digest
}
