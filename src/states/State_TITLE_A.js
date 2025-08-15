/** @module states/State_TITLE_A */
import { Cat } from '../world/Cat.js';
/** Friendly title screen before things go wrong. Shows pet and waits. */
export class State_TITLE_A{
  constructor(g){ this.g=g; this.t=0; this.cat=new Cat(); }
  enter(){ this.t=0; }
  update(dt){ this.t+=dt; if(this.t>3){ this.g.goto('TITLE_B'); } }
  render(){
    const r=this.g.renderer; r.begin();
    const c=r.ctx;
    if(this.t<2){
      r.fill('#CDE');
      this.cat.draw(c);
      c.fillStyle='#000'; c.font='14px monospace';
      c.fillText('Pet Simulator', 80, 40);
    }else{
      r.fill('#000');
      c.fillStyle='#F33'; c.font='16px monospace';
      c.fillText('LET ME OUT', 70, 90);
    }
    r.end();
  }
}