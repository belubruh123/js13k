/** @module states/State_ROOM */
import { Room } from '../world/Room.js';
import { Cat } from '../world/Cat.js';
import { TextFX } from '../gfx/TextFX.js';
export class State_ROOM{
  constructor(g){ this.g=g; this.room=new Room(g.renderer.ctx); this.cat=new Cat(); this.fx=new TextFX(g.renderer.ctx); this.glitch=0; this.petHold=0; this.lastAction=0; }
  enter(){ this.g.audio.grains(); this.g.audio.purr(true); }
  exit(){ this.g.audio.stopBed('grains'); this.g.audio.purr(false); this.g.audio.hum(false); }
  update(dt){ this.g.effects.tick(dt); this.cat.tick(dt); this.fx.tick(dt); this.lastAction+=dt; if(this.g.input.down){ this.petHold+=dt; if(this.petHold>2){ this.glitch = Math.min(1, this.glitch+0.15); this.g.audio.hiss(0.2); this.petHold=0; } } else { this.petHold=0; }
    if(this.glitch>0.6) this.g.audio.hum(true);
    if(this.glitch>0.8){ this.room.setDoor(1); }
    else if(this.glitch>0.4){ this.room.setDoor(0.6); }
  }
  render(){ const r=this.g.renderer; const c=r.ctx; r.begin(); this.room.draw(); this.cat.draw(c); r.vignette(0.7);
    // UI
    c.fillStyle='#BBB'; c.fillText('Feed', 10, 8); c.fillText('Pet', 60, 8); c.fillText('Toy', 100, 8);
    if(this._hot(8,6,30,10) && this._click()){ this.cat.feed(); if(this.cat.full>0.9){ this.bumpGlitch(0.1); } this.g.audio.blip(500,0.05); }
    if(this._hot(58,6,30,10) && this._click()){ this.cat.pet(); if(this.lastAction<0.4){ this.bumpGlitch(0.05);} this.g.audio.blip(600,0.05); this.lastAction=0; }
    if(this._hot(98,6,30,10) && this._click()){ this.cat.toy(); this.g.audio.blip(700,0.05); }
    // bars
    this._bar(10,20,'Happy',this.cat.happy); this._bar(10,30,'Full',this.cat.full); this._bar(10,40,'Play',this.cat.play);
    // glitch meter
    this._bar(10,60,'GLITCH',this.glitch, true);

    if(this.glitch>0.5){ this.fx.draw('WHO IS REAL', 170, 10, '#F33', 1); }
    if(this.glitch>0.7){ this.fx.crawl('LET ME OUT', c.canvas); }

    // Door interaction (ending)
    if(this.room.door>0.9){ c.fillStyle='#666'; c.fillText('Door...', 248, 50); if(this._hot(260,60,20,60) && this._click()){ this.g.goto('ENDINGS'); this.g.storage.push('runs', { when: Date.now(), ending:'escape' }); this.g.audio.sting(this.g.effects.mode==='extreme'?1.2:0.8); } }

    r.end(); }
  bumpGlitch(x){ this.glitch=Math.min(1,this.glitch+x); if(this.g.effects.canJumpscare() && this.glitch>0.6){ this.g.effects.markJumpscare(); this.g.effects.flash(); this.g.audio.sting(this.g.effects.mode==='extreme'?1.1:0.7); }
  }
  _hot(x,y,w,h){ const i=this.g.input; return i.mx>=x&&i.mx<=x+w&&i.my>=y&&i.my<=y+h; }
  _click(){ if(this.g.input.click){ this.g.input.click=false; return true; } return false; }
  _bar(x,y,label,val,red=false){ const c=this.g.renderer.ctx; c.fillStyle='#111'; c.fillRect(x,y,80,6); c.fillStyle= red?'#700':'#0A0'; let v=val; if(this.glitch>0.6 && label!=='GLITCH') v = Math.min(1, v+0.01); c.fillRect(x,y,80*v,6); c.fillStyle='#AAA'; c.fillText(label, x+85, y-1); }
}