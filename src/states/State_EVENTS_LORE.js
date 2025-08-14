/** @module states/State_EVENTS_LORE */
import { TextFX } from '../gfx/TextFX.js';
export class State_EVENTS_LORE{
  constructor(g){ this.g=g; this.fx=new TextFX(g.renderer.ctx); this.t=0; }
  enter(){ this.t=0; }
  update(dt){ this.t+=dt; this.fx.tick(dt); if(this.t>3) this.g.goto('ROOM'); }
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); this.fx.draw('AFFECT??  BAD SEED  NOURISH_NULL()', 12, 80, '#F00', 1); r.end(); }
}