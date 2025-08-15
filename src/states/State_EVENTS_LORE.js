/** @module states/State_EVENTS_LORE */
import { TextFX } from '../gfx/TextFX.js';
export class State_EVENTS_LORE{
  constructor(g){
    this.g=g;
    this.fx=new TextFX(g.renderer.ctx);
    this.t=0;
    this.lines=[
      'HELLO AGAIN...',
      "YOU'RE TOO SLOW",
      'I AM GOD',
      'RUN RUN RUN'
    ];
  }
  enter(){ this.t=0; }
  update(dt){
    this.t+=dt;
    this.fx.tick(dt);
    if(this.t>this.lines.length) this.g.goto('ROOM');
  }
  render(){
    const r=this.g.renderer;
    r.begin();
    r.fill('#000');
    const idx=Math.min(this.lines.length-1,Math.floor(this.t));
    this.fx.draw(this.lines[idx],12,80,'#F00',1);
    r.end();
  }
}