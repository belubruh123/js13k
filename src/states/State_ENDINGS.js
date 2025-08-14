/** @module states/State_ENDINGS */
export class State_ENDINGS{
  constructor(g){ this.g=g; this.t=0; this.msg=''; }
  enter(){ this.t=0; this.msg = Math.random()<0.5? 'You escaped. But who let you?' : 'The door was a mouth.'; }
  update(dt){ this.t+=dt; if(this.t>4){ /* back to title */ this.g.goto('TITLE_B'); } }
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx; c.fillStyle='#F44'; c.fillText(this.msg, 40, 80); r.end(); }
}