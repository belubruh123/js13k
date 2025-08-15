/** @module states/State_COLOR_PICKER */
import { UI } from '../ui/UI.js';
export class State_COLOR_PICKER{
  constructor(g){
    this.g=g;
    this.ui=new UI(g.renderer.ctx);
    this.msg='Pick your color';
    this.tries=0; // number of attempts to pick forbidden colours
  }
  update(dt){}
  render(){
    const r=this.g.renderer; r.begin(); r.fill('#000');
    const c=r.ctx; c.fillStyle='#EEE'; c.font='10px monospace'; c.fillText(this.msg, 80, 40);
    const cols=['Red','Green','Blue','Black'];
    cols.forEach((col,i)=>{
      if(this.ui.button(40+i*60,80,50,20,col)){
        if(col==='Black'){
          this.g.storage.set('color',col);
          this.g.audio.blip(400+i*100,0.05);
          this.g.goto('ROOM');
        }else{
          this.tries++; this.g.audio.hiss(0.1);
          this.msg = this.tries>=3 ? 'You have no choice.' : "You can't choose this color.";
          if(this.tries>=3){
            this.g.storage.set('color','Black');
            this.g.goto('ROOM');
          }
        }
      }
    });
    r.end();
  }
}
