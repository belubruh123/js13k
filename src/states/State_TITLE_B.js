/** @module states/State_TITLE_B */
import { UI } from '../ui/UI.js';
import { TextFX } from '../gfx/TextFX.js';
export class State_TITLE_B{
  constructor(g){ this.g=g; this.ui=new UI(g.renderer.ctx); this.fx=new TextFX(g.renderer.ctx); this.opts=false; }
  enter(){ this.g.audio.zzz(true); }
  exit(){ this.g.audio.zzz(false); }
  update(dt){ this.fx.tick(dt); }
  render(){
    const r=this.g.renderer;
    r.begin(); r.fill('#000');
    const c=r.ctx;
    this.fx.draw('PET SIMULATOR?', 70, 40, '#F22', 2);
    c.fillStyle='#700'; c.fillRect(110,58,3,3); c.fillRect(120,60,2,2); // crude blood drip vibes

    // Main menu buttons only respond when options panel is closed
    if(!this.opts){
      if(this.ui.button(120,90,80,16,'Start')){ this.g.goto('COLOR_PICKER'); }
      if(this.ui.button(120,110,80,16,'Options')){ this.opts=!this.opts; }
      if(this.ui.button(120,130,80,16,'Quit')){ this.g.audio.hiss(0.2); /* cannot leave */ }
    }

    c.fillStyle='#444'; c.fillText('© 666', 4, 170);

    if(this.opts){
      c.fillStyle='#111'; c.fillRect(40,70,240,60);
      c.fillStyle='#DDD'; c.fillText('Mute', 50, 80);
      if(this.ui.button(80,74,40,16, this.g.audio.muted?'Yes':'No')){ this.g.audio.setMute(!this.g.audio.muted); this.g.audio.blip(); }
      c.fillText('Volume', 50, 102); const v=this.ui.slider(100,102,150,this.g.audio.volume); if(v!==this.g.audio.volume) this.g.audio.setVolume(v);
      c.fillText('Mode:', 50, 120); if(this.ui.button(90,114,80,16, this.g.effects.mode)){ const n = this.g.effects.mode==='reduced'?'normal':'reduced'; this.g.effects.setMode(n); }
      // Close button
      if(this.ui.button(260,70,20,16,'X')){ this.opts=false; }
    }

    r.end();
  }
}