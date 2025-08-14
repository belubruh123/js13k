/**
 * @module gfx/TextFX
 * Bitmap-ish text with creep effects: jitter, RGB offsets, drip.
 */
export class TextFX{
  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx){ this.ctx=ctx; this.time=0; this.drips=[]; }
  /** @param {number} dt */ tick(dt){ this.time+=dt; this.drips = this.drips.filter(d=> (d.y<d.maxY)); this.drips.forEach(d=> d.y+=dt*20); }
  /** Draws text with jitter and chromatic aberration */
  draw(text,x,y,color='#FFF',scale=1){
    const c=this.ctx; c.save(); c.font=`${8*scale}px monospace`; c.textBaseline='top';
    const jitter=1; const off=[[1,0,'#F00'],[-1,0,'#0FF']];
    for(const [ox,oy,col] of off){ c.fillStyle=col; c.fillText(text,x+ox,y+oy); }
    c.fillStyle=color; c.fillText(text,x+Math.sin(this.time*5)*0.5,y+Math.cos(this.time*3)*0.5);
    // drip seeds
    if(Math.random()<0.02){ this.drips.push({x:x+Math.random()*text.length*5,y:y+8, maxY:y+30}); }
    c.fillStyle='#900'; for(const d of this.drips){ c.fillRect(d.x|0, d.y|0, 1, 1); }
    c.restore();
  }
  /** Red outward crawl from edges */
  crawl(text,canvas){ const c=this.ctx; c.save(); c.fillStyle='#A00'; const y=2+(Math.sin(this.time*2)*1)|0; c.fillText(text,2,y); c.fillText(text,canvas.width-2-c.measureText(text).width,canvas.height-10); c.restore(); }
}
