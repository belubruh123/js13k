/**
 * @module core/StateManager
 * Lightweight finite state controller. States implement enter/exit/update/render.
 */
export class StateManager{
  constructor(){ /** @type {{enter?:Function,exit?:Function,update:Function,render:Function}|null} */ this.current=null; }
  /**
   * Set current state and pass optional data to its enter method.
   * @param {*} s
   * @param {*} [data]
   */
  set(s, data){
    if(this.current?.exit) this.current.exit();
    this.current = s;
    this.current?.enter?.(data);
  }
  /** @param {number} dt */
  update(dt){ this.current?.update?.(dt); }
  render(){ this.current?.render?.(); }
}