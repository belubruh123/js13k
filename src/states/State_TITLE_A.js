/** @module states/State_TITLE_A */
import { Cat } from '../world/Cat.js';
/** Friendly title screen before things go wrong. Shows pet and waits. */
export class State_TITLE_A{
  constructor(g){ this.g=g; this.t=0; this.cat=new Cat(); }
  enter(){ this.t=0; }
  update(dt){ this.t+=dt; if(this.t>2){ this.g.goto('TITLE_B'); } }
  render(){
    const r=this.g.renderer; r.begin(); r.fill('#CDE');
    const c=r.ctx; this.cat.draw(c);
    c.fillStyle='#000'; c.font='14px monospace';
    c.fillText('Pet Simulator', 80, 40);
    r.end();
  }
}