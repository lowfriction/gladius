export function rand(min, max) {
	return ~~(Math.random() * (max - min + 1)) + min
}
