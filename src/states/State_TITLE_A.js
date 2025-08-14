/** @module states/State_TITLE_A */
export class State_TITLE_A{
  constructor(g){ this.g=g; this.t=0; }
  enter(){ this.t=0; }
  update(dt){ this.t+=dt; if(this.t>1.2){ this.g.goto('GLITCH_FLASH'); } }
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx; c.fillStyle='#FFF'; c.font='12px monospace'; c.fillText('...', 150, 85); r.end(); }
}