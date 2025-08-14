/**
 * @module core/StateManager
 * Lightweight finite state controller. States implement enter/exit/update/render.
 */
export class StateManager{
  constructor(){ /** @type {{enter?:Function,exit?:Function,update:Function,render:Function}|null} */ this.current=null; }
  /** @param {*} s */
  set(s){ if(this.current?.exit) this.current.exit(); this.current = s; this.current?.enter?.(); }
  /** @param {number} dt */
  update(dt){ this.current?.update?.(dt); }
  render(){ this.current?.render?.(); }
}