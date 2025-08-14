/** @module states/State_COLOR_PICKER */
import { UI } from '../ui/UI.js';
export class State_COLOR_PICKER{
  constructor(g){ this.g=g; this.ui=new UI(g.renderer.ctx); this.msg='Pick your color'; this.sel=null; }
  update(dt){}
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx; c.fillStyle='#EEE'; c.font='10px monospace'; c.fillText(this.msg, 80, 40);
    const cols=['Red','Green','Blue','Black'];
    cols.forEach((col,i)=>{ if(this.ui.button(40+i*60,80,50,20,col)){ this.sel=col; this.g.storage.set('color',col); this.g.audio.blip(400+i*100,0.05); }});
    if(this.sel){ c.fillStyle='#0F0'; if(this.ui.button(120,120,80,20,'Continue')){ this.g.goto('ROOM'); } }
    r.end(); }
}
