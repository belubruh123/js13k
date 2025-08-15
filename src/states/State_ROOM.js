/** @module states/State_ROOM */
import { Room } from '../world/Room.js';
import { Cat } from '../world/Cat.js';
import { UI } from '../ui/UI.js';
import { DialogBox } from '../ui/DialogBox.js';


/**
 * Main gameplay room.  Starts friendly for a full minute while the cat grows
 * curious about reality.  After it muses about escape the scene shifts to
 * horror, revealing a door and Exit button.  Clicking either crashes the game,
 * while clicking the cat thirteen times triggers the secret "good" ending.
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
    this.horror=false; this.overlay=0;
    this.shakeTimer=0;
    this.jsTimer=0; this.jsActive=0; this.jsMsg='';
    this.jsMsgs=['I SEE YOU',"YOU'RE TOO SLOW",'I AM GOD'];
    this.softlock=false;
    this.glitchTimer=0;
  }
  enter(){
    this.t=0; this.chatIndex=0; this.chatTimer=0; this.dialog.show(this.chat[0]);
    this.cat.dead=false; this.catClicks=0; this.kill=false; this.killTimer=0;
    this.horror=false; this.overlay=0; this.dialog.setCorrupt(false);
    this.room.setDoor(0); this.room.setHorror(false);
    this.g.audio.grains();
    this.g.audio.purr(true);
    this.jsTimer=5+Math.random()*10; this.jsActive=0; this.jsMsg='';
    this.softlock=false; this.glitchTimer=3+Math.random()*4;
  }
  exit(){ this.g.audio.stopBed('grains'); this.g.audio.purr(false); }
  update(dt){
    this.g.effects.tick(dt);
    if(this.shakeTimer>0) this.shakeTimer=Math.max(0,this.shakeTimer-dt);
    if(!this.kill && !this.softlock) this.cat.tick(dt);
    this.t+=dt;
    if(this.kill){
      if(!this.softlock) this.killTimer+=dt;
      if(this.killTimer>1 && !this.softlock){
        this._softlock('You killed the cat.');
        this.g.audio.sting(1.2);
      }
      return;
    }
    if(this.softlock) return;
    if(this.jsActive>0) this.jsActive=Math.max(0,this.jsActive-dt);
    this.jsTimer-=dt;
    if(this.jsTimer<=0 && this.g.effects.canJumpscare()){
      this.jsActive=0.8; this.shakeTimer=1;
      this.jsMsg=this.jsMsgs[(Math.random()*this.jsMsgs.length)|0];
      this.g.effects.flash(); this.g.effects.glitch(); this.g.audio.sting(1); this.g.audio.staticBurst(); this.g.effects.markJumpscare();
      this.jsTimer=8+Math.random()*12;
    }
    this.glitchTimer-=dt;
    if(this.horror && this.glitchTimer<=0){ this.g.effects.glitch(); this.g.audio.staticBurst(0.05); this.glitchTimer=2+Math.random()*4; }
    this.chatTimer+=dt;
    if(this.chatIndex < this.chat.length-1 && this.chatIndex!==2 && this.chatTimer>10){
      this.chatTimer=0; this.chatIndex++; this.dialog.show(this.chat[this.chatIndex]);
      if(this.chatIndex===this.chat.length-1) this._beginHorror();
    }
    if(this.chatIndex===2 && this._hot(10,130,220,24) && this._click()){
      this.chatTimer=0; this.chatIndex++; this.dialog.show(this.chat[this.chatIndex]);
      this.g.audio.blip(400,0.05);
    }
    if(this.t>55 && this.chatIndex<this.chat.length-1){
      this.chatIndex=this.chat.length-1; this.dialog.show(this.chat[this.chatIndex]);
      this._beginHorror();
    }

    if(this._hot(this.cat.x-10, this.cat.y-40,60,60) && this._click()){
      this.catClicks++;
      if(this.catClicks>=13){
        this.kill=true; this.cat.dead=true; this.dialog.hide(); this.killTimer=0;
        if(this.g.effects.canJumpscare()){ this.g.effects.markJumpscare(); this.g.effects.flash(); this.shakeTimer=1; }
        this.g.audio.sting(1.2);
      }
    }

    if(this.cat.happy<=0 || this.cat.full<=0 || this.cat.play<=0){
      this.cat.dead=true;
      this._softlock('Your cat has died.');
      this.g.audio.sting(0.8);
      return;
    }
  }
  render(){
    const r=this.g.renderer; const c=r.ctx;
    r.begin();
    if(this.shakeTimer>0) this.g.effects.shake(this.shakeTimer*5);
    this.room.draw(); this.cat.draw(c);
    this.dialog.draw();
    if(this.jsActive>0){
      this.g.effects.glitch(); c.fillStyle='#900'; c.fillRect(0,0,c.canvas.width,c.canvas.height);
      c.fillStyle='#FFF'; c.font='20px monospace'; c.fillText(this.jsMsg,80,90);
    }
    if(this.overlay>0){
      this.overlay-=1/60;
      c.fillStyle='#800'; c.fillRect(0,0,c.canvas.width,c.canvas.height);
      c.fillStyle='#FFF'; c.font='14px monospace'; c.fillText("YOU CAN'T RUN",40,80);
    }
    if(this.kill){
      const radius=20+this.killTimer*120;
      c.fillStyle='rgba(255,0,0,0.5)';
      c.beginPath(); c.arc(this.cat.x+20,this.cat.y-10,radius,0,Math.PI*2); c.fill();
    }

    if(!this.kill){
      if(!this.softlock){
        if(this.ui.button(10,4,70,24,'Feed')){ this.cat.feed(); this.g.audio.blip(500,0.05); }
        if(this.ui.button(90,4,70,24,'Pet')){ this.cat.pet(); this.g.audio.blip(600,0.05); }
        if(this.ui.button(170,4,70,24,'Toy')){ this.cat.toy(); this.g.audio.blip(700,0.05); }
      }
      this._bar(10,34,'Happy',this.cat.happy);
      this._bar(10,46,'Full',this.cat.full);
      this._bar(10,58,'Play',this.cat.play);
      if(!this.softlock){
        c.fillStyle='#BBB'; c.font='10px monospace'; c.fillText('Use buttons to care for your cat.',10,170);
        if(this.horror){
          if(this.ui.button(240,4,60,24,'Exit')){ this._softlock('There is no escape.'); this.g.audio.hiss(0.6); }
          if(this._hot(260,60,20,60) && this._click()){ this._softlock('The door is locked.'); this.g.audio.hiss(0.6); }
        }
      }
    }
    r.end();
  }
  _hot(x,y,w,h){ const i=this.g.input; return i.mx>=x&&i.mx<=x+w&&i.my>=y&&i.my<=y+h; }
  _click(){ if(this.g.input.click){ this.g.input.click=false; return true; } return false; }
  _bar(x,y,label,val){ const c=this.g.renderer.ctx; c.fillStyle='#111'; c.fillRect(x,y,80,6); c.fillStyle='#0A0'; c.fillRect(x,y,80*val,6); c.fillStyle='#AAA'; c.font='8px monospace'; c.fillText(label, x+85, y-1); }
  _beginHorror(){
    if(this.horror) return;
    this.horror=true;
    this.overlay=1;
    this.room.setHorror(true);
    this.room.setDoor(1);
    this.dialog.setCorrupt(true);
    this.g.effects.flash();
    this.g.audio.hiss(0.6);
  }
  _softlock(msg){
    this.dialog.show(msg);
    this.softlock=true;
    this.g.audio.stopBed('grains');
    this.g.audio.purr(false);
  }
}

