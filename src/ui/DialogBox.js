/**
 * @module ui/DialogBox
 * Simple dialog box for cat speech. Can optionally corrupt text.
 */
export class DialogBox{
  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx){
    this.ctx=ctx; this.visible=false; this.text=''; this.corrupt=false;
  }
  show(txt){ this.text=txt; this.visible=true; }
  hide(){ this.visible=false; }
  setCorrupt(v){ this.corrupt=v; }
  /** Render dialog */
  draw(){
    if(!this.visible) return;
    const c=this.ctx;
    c.save();
    c.fillStyle='rgba(0,0,0,0.7)';
    c.fillRect(10,130,220,24);
    c.fillStyle='#FFF';
    c.font='10px monospace';
    c.textBaseline='middle';
    c.fillText(this.corrupt?this._garble(this.text):this.text, 18,142);
    c.restore();
  }
  _garble(str){
    const hex='0123456789ABCDEF';
    return str.split('').map(ch=>{
      if(ch===' ') return ' ';
      return Math.random()<0.4 ? hex[Math.floor(Math.random()*16)] : ch;
    }).join('');
  }
}
