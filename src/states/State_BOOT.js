/** @module states/State_BOOT */
import { UI } from '../ui/UI.js';
export class State_BOOT{
  /** @param {import('../core/Game.js').Game} game */
  constructor(game){ this.g=game; this.ui=new UI(game.renderer.ctx); }
  enter(){}
  update(dt){ if(this.ui.button(110,100,100,20,'Start')){ this.g.audio.blip(); this.g.goto('WARNING'); } }
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx; c.fillStyle='#AAA'; c.font='12px monospace'; c.fillText('Pet Simulator', 90, 60); c.font='10px monospace'; c.fillText('Feed, Pet and Play to keep it calm.', 40, 80); c.fillText('© 2025', 128, 150); r.end(); }
}
