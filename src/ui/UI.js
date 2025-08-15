/**
 * @module ui/UI
 * Minimal immediate-mode UI drawn on canvas: buttons, slider.
 */
export class UI{
  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx){ this.ctx=ctx; this.mx=0; this.my=0; this.down=false; this.clicked=false; this._bind(); }
  _bind(){ const c=this.ctx.canvas; c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(); this.mx=(e.clientX-r.left)*(c.width/r.width); this.my=(e.clientY-r.top)*(c.height/r.height);}); c.addEventListener('mousedown',()=>{this.down=true;}); c.addEventListener('mouseup',()=>{this.down=false; this.clicked=true; setTimeout(()=>this.clicked=false,0);}); }
  /** @param {number} x @param {number} y @param {number} w @param {number} h @param {string} label */
  button(x,y,w,h,label){
    const ho=this.mx>=x&&this.mx<=x+w&&this.my>=y&&this.my<=y+h;
    const c=this.ctx; c.save();
    c.fillStyle = ho ? (this.down? '#555':'#333') : '#111';
    c.fillRect(x,y,w,h);
    c.strokeStyle='#FFF';
    c.strokeRect(x+0.5,y+0.5,w-1,h-1);
    c.fillStyle='#DDD';
    c.font='10px monospace';
    c.textBaseline='middle';
    c.textAlign='center';
    c.fillText(label, x+w/2, y+h/2);
    c.restore();
    if(ho && this.clicked){ this.clicked=false; return true; }
    return false;
  }
  /** Volume slider 0..1 */
  slider(x,y,w,val){ const c=this.ctx; c.save(); c.fillStyle='#111'; c.fillRect(x,y,w,6); c.fillStyle='#A00'; c.fillRect(x,y,w*val,6); c.restore(); const ho=this.mx>=x&&this.mx<=x+w&&this.my>=y&&this.my<=y+6; if(ho&&this.down){ return Math.max(0,Math.min(1,(this.mx-x)/w)); } return val; }
}
