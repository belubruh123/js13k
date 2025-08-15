/** @module states/State_BOOT */
/**
 * Initial splash screen. Shows a flashing warning for a brief moment
 * before continuing into the warning/options screen.
 */
export class State_BOOT{
  /** @param {import('../core/Game.js').Game} game */
  constructor(game){ this.g=game; this.t=0; }
  enter(){ this.t=0; }
  update(dt){ this.t+=dt; if(this.t>1){ this.g.goto('WARNING'); } }
  render(){
    const r=this.g.renderer; r.begin();
    const flash = Math.floor(this.t*10)%2===0?'#F00':'#000';
    r.fill(flash);
    const c=r.ctx; c.fillStyle='#FFF'; c.font='14px monospace';
    c.fillText('⚠️  WARNING', 80, 90);
    r.end();
  }
}
