import {DefaultBindings} from "../../shared/constants"

export default class PlayerBindings {
  constructor(opts = {}) {
    this.binds = opts.binds || new Map(DefaultBindings)
  }

  setBind(ev, action) {
    this.binds.set(ev, action)
  }

  getAction(ev) {
    return this.binds.get(ev)
  }
}
