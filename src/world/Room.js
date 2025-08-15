/**
 * @module world/Room
 * Draws the dim room, vignette, scanlines, and door emergence.
 */
export class Room{
  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx){ this.ctx=ctx; this.door=0; this.horror=false; }
  /** @param {number} level 0..1 */
  setDoor(level){ this.door= Math.max(0,Math.min(1,level)); }
  setHorror(v){ this.horror=v; }
  draw(){
    const c=this.ctx;
    if(this.horror){
      // Bloody distorted backdrop used after the twist
      c.fillStyle='#300'; c.fillRect(0,0,c.canvas.width,c.canvas.height);
      c.fillStyle='#400'; c.fillRect(0,120,c.canvas.width,60);
    }else{
      // Normal dim room
      c.fillStyle='#121212'; c.fillRect(0,0,c.canvas.width,c.canvas.height);
      c.fillStyle='#0A0A0A'; c.fillRect(0,120,c.canvas.width,60);
    }
    // door
    if(this.door>0){ const x=260, y=60; const w=20, h=60; c.fillStyle=this.horror?'#400':'#111'; c.fillRect(x,y,w,h); c.strokeStyle=`rgba(180,0,0,${this.door})`; c.strokeRect(x+0.5,y+0.5,w-1,h-1); }
    // scanlines
    const tint=this.horror?'rgba(255,0,0,0.1)':'rgba(255,0,0,0.02)';
    c.fillStyle=tint; for(let y=0;y<c.canvas.height;y+=2){ c.fillRect(0,y,c.canvas.width,1);} }
}