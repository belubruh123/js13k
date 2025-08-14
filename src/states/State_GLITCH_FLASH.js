/** @module states/State_GLITCH_FLASH */
import { TextFX } from '../gfx/TextFX.js';
export class State_GLITCH_FLASH{
  constructor(g){ this.g=g; this.fx=new TextFX(g.renderer.ctx); this.t=0; }
  enter(){ this.t=0; this.g.effects.flash(); this.g.audio.blip(900,0.08); }
  update(dt){ this.t+=dt; this.fx.tick(dt); const m=this.g.effects.mode; if(m==='reduced'){ if(this.t>0.6) this.g.goto('TITLE_B'); } else if(m==='normal'){ if(this.t>0.25) this.g.goto('TITLE_B'); } else { if(this.t>0.9){ this.g.goto('TITLE_B'); } else { this.g.effects.flash(); } } }
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx; this.fx.draw('LET ME OUT', 80, 80, '#F00', 2); r.end(); }
}