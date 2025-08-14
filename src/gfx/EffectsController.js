/**
 * @module gfx/EffectsController
 * Centralizes flashes, shakes, and intensity caps per mode.
 * Modes: 'normal'|'reduced'|'extreme'. Caps enforced here.
 */
import { CONST } from '../util/constants.js';

export class EffectsController{
  /** @param {import('./Renderer.js').Renderer} renderer @param {import('../audio/AudioEngine.js').AudioEngine} audio */
  constructor(renderer, audio){ this.renderer=renderer; this.audio=audio; this.mode='normal'; this.flashCooldown=0; this.lastJumpscare= -999; }
  /** Set mode and inform audio */
  setMode(mode){ this.mode=mode; this.audio.setMode(mode); }
  /** @param {number} dt */
  tick(dt){ this.flashCooldown=Math.max(0,this.flashCooldown-dt); }
  /** Safe flash: adheres to caps */
  flash(){
    const now = performance.now()/1000;
    if(this.mode==='reduced'){
      // Fade overlay
      this._fade(0.6, 0.6);
    } else {
      // throttle by rate caps
      const maxHz = this.mode==='extreme'?10:6;
      const minGap = 1/maxHz;
      if(this.flashCooldown<=0){ this._white(); this.flashCooldown = minGap; }
    }
  }
  _white(){ const c=this.renderer.ctx; c.save(); c.globalAlpha=0.9; c.fillStyle='#FFF'; c.fillRect(0,0,this.renderer.w,this.renderer.h); c.restore(); }
  _fade(alpha,dur){ const c=this.renderer.ctx; c.save(); c.globalAlpha=alpha; c.fillStyle='#FFF'; c.fillRect(0,0,this.renderer.w,this.renderer.h); c.restore(); /* simple fade impression via longer frame */ }
  /** Screen shake intensity mapped to mode */
  shake(intensity=1){ /* visual hint only: translate context */ const c=this.renderer.ctx; const k = this.mode==='extreme'?2: (this.mode==='reduced'?0.5:1); c.translate((Math.random()-0.5)*k*intensity,(Math.random()-0.5)*k*intensity); }
  /** True if jumpscare allowed based on cooldown */
  canJumpscare(){ const gap = this.mode==='extreme'?12:20; return (performance.now()/1000 - this.lastJumpscare) > gap; }
  markJumpscare(){ this.lastJumpscare = performance.now()/1000; }
}
