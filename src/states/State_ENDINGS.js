/** @module states/State_ENDINGS */
export class State_ENDINGS{
  constructor(g){ this.g=g; this.t=0; this.msg=''; this.good=false; }
  /** @param {{msg?:string,good?:boolean}} [data] */
  enter(data){
    this.t=0;
    this.msg = data?.msg || '';
    this.good = data?.good || false;
    if(!this.good){
      // Simulate a crash for the bad endings
      setTimeout(()=>{ throw new Error('The game has crashed.'); },100);
    }
  }
  update(dt){ if(this.good){ this.t+=dt; if(this.t>4){ this.g.goto('TITLE_B'); } } }
  render(){
    if(!this.good) return; // nothing to render for crash
    const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx;
    c.fillStyle='#F44'; c.fillText(this.msg, 40, 80); r.end();
  }
}