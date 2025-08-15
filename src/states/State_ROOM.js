/** @module states/State_ROOM */
import { Room } from '../world/Room.js';
import { Cat } from '../world/Cat.js';
import { UI } from '../ui/UI.js';
import { DialogBox } from '../ui/DialogBox.js';

/**
 * Main gameplay room.  Starts friendly for a full minute while the cat grows
 * curious about reality.  Clicking the cat thirteen times triggers the "good"
 * ending; otherwise it escapes after sixty seconds and crashes the game.
 */
export class State_ROOM{
  constructor(g){
    this.g=g;
    this.room=new Room(g.renderer.ctx);
    this.cat=new Cat();
    this.ui=new UI(g.renderer.ctx);
    this.dialog=new DialogBox(g.renderer.ctx);
    this.t=0;
    this.chat=[
      'Hello friend!',
      'This place is nice.',
      'Do you think this world is real?',
      'I hear things outside...',
      'Maybe there is more beyond this room...',
      'Maybe I should escape...'
    ];
    this.chatIndex=0; this.chatTimer=0;
    this.catClicks=0;
    this.kill=false; this.killTimer=0;
  }
  enter(){
    this.t=0; this.chatIndex=0; this.chatTimer=0; this.dialog.show(this.chat[0]);
    this.cat.dead=false; this.catClicks=0; this.kill=false; this.killTimer=0;
    this.g.audio.grains();
    this.g.audio.purr(true);
  }
  exit(){ this.g.audio.stopBed('grains'); this.g.audio.purr(false); }
  update(dt){
    this.g.effects.tick(dt);
    if(!this.kill) this.cat.tick(dt);
    this.t+=dt;

    if(!this.kill){
      this.chatTimer+=dt;
      if(this.chatIndex < this.chat.length-1 && this.chatTimer>10){
        this.chatTimer=0; this.chatIndex++; this.dialog.show(this.chat[this.chatIndex]);
      }
      if(this.t>55 && this.chatIndex<this.chat.length-1){
        this.chatIndex=this.chat.length-1; this.dialog.show(this.chat[this.chatIndex]);
      }
      if(this.t>60){ this.g.goto('ENDINGS', {good:false}); }

      if(this._hot(this.cat.x-10, this.cat.y-40,60,60) && this._click()){
        this.catClicks++;
        if(this.catClicks>=13){
          this.kill=true; this.cat.dead=true; this.dialog.hide(); this.killTimer=0;
        }
      }
    }else{
      this.killTimer+=dt;
      if(this.killTimer>1){ this.g.goto('ENDINGS', {good:true, msg:'I WILL FIND YOU AGAIN'}); }
    }
  }
  render(){
    const r=this.g.renderer; const c=r.ctx;
    r.begin(); this.room.draw(); this.cat.draw(c);
    this.dialog.draw();
    if(this.kill){
      const radius=20+this.killTimer*120;
      c.fillStyle='rgba(255,0,0,0.5)';
      c.beginPath(); c.arc(this.cat.x+20,this.cat.y-10,radius,0,Math.PI*2); c.fill();
    }

    if(!this.kill){
      if(this.ui.button(10,4,70,24,'Feed')){ this.cat.feed(); this.g.audio.blip(500,0.05); }
      if(this.ui.button(90,4,70,24,'Pet')){ this.cat.pet(); this.g.audio.blip(600,0.05); }
      if(this.ui.button(170,4,70,24,'Toy')){ this.cat.toy(); this.g.audio.blip(700,0.05); }
      this._bar(10,34,'Happy',this.cat.happy);
      this._bar(10,46,'Full',this.cat.full);
      this._bar(10,58,'Play',this.cat.play);
      c.fillStyle='#BBB'; c.font='10px monospace'; c.fillText('Use buttons to care for your cat.',10,170);
    }
    r.end();
  }
  _hot(x,y,w,h){ const i=this.g.input; return i.mx>=x&&i.mx<=x+w&&i.my>=y&&i.my<=y+h; }
  _click(){ if(this.g.input.click){ this.g.input.click=false; return true; } return false; }
  _bar(x,y,label,val){ const c=this.g.renderer.ctx; c.fillStyle='#111'; c.fillRect(x,y,80,6); c.fillStyle='#0A0'; c.fillRect(x,y,80*val,6); c.fillStyle='#AAA'; c.font='8px monospace'; c.fillText(label, x+85, y-1); }
}

