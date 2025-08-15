/** @module states/State_BOOT */
/**
 * Initial splash screen.  Shows a short instructional message for a brief
 * moment before continuing into the warning screen.  There is no user input
 * here; the message simply fades after one second.
 */
export class State_BOOT{
  /** @param {import('../core/Game.js').Game} game */
  constructor(game){ this.g=game; this.t=0; }
  enter(){ this.t=0; }
  update(dt){ this.t+=dt; if(this.t>1){ this.g.goto('WARNING'); } }
  render(){
    const r=this.g.renderer; r.begin(); r.fill('#CDE');
    const c=r.ctx; c.fillStyle='#000'; c.font='12px monospace';
    c.fillText('Feed, Pet and Play to keep it calm.', 20, 90);
    r.end();
  }
}
