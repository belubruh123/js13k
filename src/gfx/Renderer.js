/**
 * @module gfx/Renderer
 * Handles fixed-resolution backbuffer and nearest-neighbor upscale to CSS size.
 */
import { CONST } from '../util/constants.js';

export class Renderer{
  /** @param {HTMLCanvasElement} canvas @param {number} w @param {number} h */
  constructor(canvas,w,h){
    this.canvas = canvas; this.w=w; this.h=h;
    /** @type {CanvasRenderingContext2D} */this.ctx = canvas.getContext('2d');
    this.canvas.style.width = Math.floor(w*CONST.UI_SCALE)+'px';
    this.canvas.style.height = Math.floor(h*CONST.UI_SCALE)+'px';
    this.ctx.imageSmoothingEnabled = false;
  }
  begin(){ this.ctx.setTransform(1,0,0,1,0,0); this.ctx.imageSmoothingEnabled=false; this.ctx.clearRect(0,0,this.w,this.h); }
  end(){ /* no-op: drawing directly */ }
  /** @param {string} c */ fill(c){ this.ctx.fillStyle=c; this.ctx.fillRect(0,0,this.w,this.h); }
  /** Vignette */
  vignette(alpha=0.6){ const g=this.ctx.createRadialGradient(this.w/2,this.h/2,Math.min(this.w,this.h)/3,this.w/2,this.h/2,Math.max(this.w,this.h)/1.2); g.addColorStop(0,`rgba(0,0,0,0)`); g.addColorStop(1,`rgba(0,0,0,${alpha})`); this.ctx.fillStyle=g; this.ctx.fillRect(0,0,this.w,this.h); }
}
