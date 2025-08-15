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
    const grad=c.createLinearGradient(0,y,0,y+h);
    if(ho){
      if(this.down){ grad.addColorStop(0,'#556'); grad.addColorStop(1,'#334'); }
      else{ grad.addColorStop(0,'#667'); grad.addColorStop(1,'#445'); }
    }else{
      grad.addColorStop(0,'#334'); grad.addColorStop(1,'#223');
    }
    c.shadowColor='rgba(0,0,0,0.6)';
    c.shadowBlur=4; c.shadowOffsetY=2;
    c.fillStyle=grad;
    c.fillRect(x,y,w,h);
    c.shadowBlur=0; c.shadowOffsetY=0;
    c.strokeStyle='#FFF';
    c.lineWidth=2; c.strokeRect(x+0.5,y+0.5,w-1,h-1);
    c.fillStyle='#FFF';
    c.font='12px monospace';
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
