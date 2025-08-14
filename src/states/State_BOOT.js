/** @module states/State_BOOT */
import { CONST } from '../util/constants.js';
export class State_BOOT{
  /** @param {import('../core/Game.js').Game} game */
  constructor(game){ this.g=game; this.t=0; }
  enter(){ this.t=0; }
  update(dt){ this.t+=dt; if(this.t>2){ this.g.goto('WARNING'); } }
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx; c.fillStyle='#AAA'; c.font='10px monospace'; c.fillText('Pet Simulator', 100, 80); c.fillText('© 2025', 128, 95); r.end(); }
}
