/** @module states/State_WARNING */
import { UI } from '../ui/UI.js';
export class State_WARNING{
  constructor(g){ this.g=g; this.ui=new UI(g.renderer.ctx); this.confirmExtreme=false; }
  enter(){ /* show */ }
  update(dt){ this.g.effects.tick(dt); }
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx; c.fillStyle='#FFF'; c.font='8px monospace'; c.fillText('WARNING: Contains flashing imagery, sudden audio, and unsettling content.', 8, 20); c.fillText('Player discretion advised. Not recommended for photosensitive players.', 8, 30);
    const normal = this.ui.button(20,60,120,20,'Play — Normal');
    const reduced= this.ui.button(20,85,120,20,'Play — Reduced Flashes');
    const extreme= this.ui.button(20,110,120,20,'Play — Extreme Mode');
    if(normal){ this.g.effects.setMode('normal'); this.g.goto('TITLE_A'); }
    if(reduced){ this.g.effects.setMode('reduced'); this.g.goto('TITLE_A'); }
    if(extreme){ this.confirmExtreme=true; }
    if(this.confirmExtreme){ c.fillStyle='#200'; c.fillRect(10, 50, 300, 80); c.fillStyle='#EEE'; c.fillText('I agree to intense audio/visuals.', 20, 70); if(this.ui.button(20,95,60,16,'Agree')){ this.g.effects.setMode('extreme'); this.g.goto('TITLE_A'); } if(this.ui.button(90,95,60,16,'Cancel')) this.confirmExtreme=false; }
    // Options: mute/vol
    c.fillStyle='#888'; c.fillText('Mute', 170, 66); if(this.ui.button(200,60,40,16, this.g.audio.muted?'Yes':'No')){ this.g.audio.setMute(!this.g.audio.muted); this.g.audio.ensure(); this.g.audio.blip(); }
    c.fillText('Volume', 170, 90); const v=this.ui.slider(200,90,80,this.g.audio.volume); if(v!==this.g.audio.volume){ this.g.audio.setVolume(v); }
    r.end(); }
}