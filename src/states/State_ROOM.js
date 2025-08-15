/** @module states/State_ROOM */
import { Room } from '../world/Room.js';
import { Cat } from '../world/Cat.js';
import { TextFX } from '../gfx/TextFX.js';
import { UI } from '../ui/UI.js';
export class State_ROOM{
  constructor(g){
    this.g=g;
    this.room=new Room(g.renderer.ctx);
    this.cat=new Cat();
    this.fx=new TextFX(g.renderer.ctx);
    this.ui=new UI(g.renderer.ctx);
    this.glitch=0; this.petHold=0; this.lastAction=0;
    this.feedCount=0; this.petCount=0;
    this.startTime=0; this.horror=false; this.ending=false;
    this.chat=['Hi! I\'m your cat.','Use Feed, Pet and Toy to care for me.'];
    this.chatIndex=0; this.chatTimer=0;
  }
  enter(){ this.g.audio.grains(); this.g.audio.purr(true); this.startTime=0; }
  exit(){ this.g.audio.stopBed('grains'); this.g.audio.purr(false); this.g.audio.hum(false); }
  update(dt){
    this.g.effects.tick(dt); this.cat.tick(dt); this.fx.tick(dt);
    this.lastAction+=dt; this.startTime+=dt;

    if(this.g.input.down){
      this.petHold+=dt; if(this.petHold>2){ this.glitch = Math.min(1, this.glitch+0.15); this.g.audio.hiss(0.2); this.petHold=0; }
    } else { this.petHold=0; }

    if(this.glitch>0.6) this.g.audio.hum(true);
    if(this.glitch>0.8){ this.room.setDoor(1); }
    else if(this.glitch>0.4){ this.room.setDoor(0.6); }

    // Trigger horror mode after 13 seconds
    if(!this.horror && this.startTime>13){
      this.horror=true;
      this.room.setHorror(true);
      this.cat.horror=true;
    }

    // Tutorial chat progression
    if(this.chatIndex<this.chat.length){
      this.chatTimer+=dt;
      if(this.chatTimer>3){ this.chatTimer=0; this.chatIndex++; }
    }
  }
  render(){
    const r=this.g.renderer; const c=r.ctx;
    r.begin(); this.room.draw(); this.cat.draw(c);

    if(this.horror){
      // Red tint and creepy message
      c.fillStyle='rgba(255,0,0,0.4)'; c.fillRect(0,0,c.canvas.width,c.canvas.height);
      c.fillStyle='#FFF'; c.font='14px monospace'; c.fillText('I wonder where you are...', 60, 90);
    }

    // Chat box during tutorial
    if(this.chatIndex<this.chat.length){
      const msg=this.chat[this.chatIndex];
      c.fillStyle='rgba(0,0,0,0.6)'; c.fillRect(40,140,240,20);
      c.fillStyle='#FFF'; c.font='10px monospace'; c.fillText(msg, 50,154);
    }

    r.vignette(0.7);

    if(this.ending){
      c.fillStyle='#000'; c.fillRect(0,0,c.canvas.width,c.canvas.height);
      c.fillStyle='#FFF'; c.font='14px monospace'; c.fillText('There is no escape.', 70,90);
      r.end(); return;
    }

    // UI
    if(this.ui.button(10,4,60,20,'Feed')){ this.cat.feed(); this.feedCount++; if(this.cat.full>0.9){ this.bumpGlitch(0.1); } this.g.audio.blip(500,0.05); }
    if(this.ui.button(80,4,60,20,'Pet')){ this.cat.pet(); this.petCount++; if(this.lastAction<0.4){ this.bumpGlitch(0.05);} this.g.audio.blip(600,0.05); this.lastAction=0; }
    if(this.ui.button(150,4,60,20,'Toy')){ this.cat.toy(); this.g.audio.blip(700,0.05); }

    // bars
    this._bar(10,34,'Happy',this.cat.happy); this._bar(10,46,'Full',this.cat.full); this._bar(10,58,'Play',this.cat.play);
    // glitch meter
    this._bar(10,78,'GLITCH',this.glitch, true);

    // instructions
    if(!this.horror){ c.fillStyle='#BBB'; c.font='10px monospace'; c.fillText('Use buttons to care for your cat.', 10, 170); }

    if(this.glitch>0.5){ this.fx.draw('WHO IS REAL', 170, 10, '#F33', 1); }
    if(this.glitch>0.7){ this.fx.crawl('LET ME OUT', c.canvas); }

    // Door interaction (ending)
    if(this.room.door>0.9){ c.fillStyle='#666'; c.fillText('Door...', 248, 50); if(this._hot(260,60,20,60) && this._click()){ this.g.goto('ENDINGS'); this.g.storage.push('runs', { when: Date.now(), ending:'escape' }); this.g.audio.sting(this.g.effects.mode==='extreme'?1.2:0.8); } }

    // Exit button after caring thirteen times each
    if(this.feedCount>=13 && this.petCount>=13){
      if(this.ui.button(240,4,60,20,'Exit')){ this.ending=true; setTimeout(()=>{ while(true){} },100); }
    }

    r.end();
  }
  bumpGlitch(x){ this.glitch=Math.min(1,this.glitch+x); if(this.g.effects.canJumpscare() && this.glitch>0.6){ this.g.effects.markJumpscare(); this.g.effects.flash(); this.g.audio.sting(this.g.effects.mode==='extreme'?1.1:0.7); }
  }
  _hot(x,y,w,h){ const i=this.g.input; return i.mx>=x&&i.mx<=x+w&&i.my>=y&&i.my<=y+h; }
  _click(){ if(this.g.input.click){ this.g.input.click=false; return true; } return false; }
  _bar(x,y,label,val,red=false){ const c=this.g.renderer.ctx; c.fillStyle='#111'; c.fillRect(x,y,80,6); c.fillStyle= red?'#700':'#0A0'; let v=val; if(this.glitch>0.6 && label!=='GLITCH') v = Math.min(1, v+0.01); c.fillRect(x,y,80*v,6); c.fillStyle='#AAA'; c.font='8px monospace'; c.fillText(label, x+85, y-1); }
}