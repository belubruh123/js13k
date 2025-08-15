/**
 * @module world/Cat
 * Simple black cat sprite and basic needs; responds to pet/feed/toy.
 */
import { CONST } from '../util/constants.js';
export class Cat{
  constructor(){
    // Place the cat roughly in the middle of the canvas.  The new sprite is
    // much larger (~40x28) so the offsets are adjusted to keep it centred.
    this.x = (CONST.WIDTH-40)/2;
    this.y = (CONST.HEIGHT/2)+10; // centre vertically

    this.happy=0.5; this.full=0.5; this.play=0.5;
    this.lookAt=false; this.purr=false;
    this.horror=false; // switched on during the late game twist
  }
  tick(dt){ this.happy = Math.max(0,Math.min(1,this.happy - dt*0.01)); this.full = Math.max(0,Math.min(1,this.full - dt*0.02)); this.play = Math.max(0,Math.min(1,this.play - dt*0.015)); }
  draw(ctx){
    ctx.save();
    if(this.horror){
      // Distorted/bloody variant used after the 13 second twist
      ctx.fillStyle='#600';
      ctx.fillRect(this.x-4, this.y-20, 48, 28); // swollen body
      ctx.fillStyle='#900';
      ctx.fillRect(this.x+20, this.y-32, 20, 16); // grotesque head
      ctx.fillStyle='#FFF';
      ctx.fillRect(this.x+24, this.y-28, 4,4); ctx.fillRect(this.x+32, this.y-28, 4,4);
    }else{
      ctx.fillStyle='#000'; // body
      ctx.fillRect(this.x, this.y-16, 40, 20); // body
      ctx.fillRect(this.x+28, this.y-32, 12, 12); // head
      // eyes
      ctx.fillStyle=this.lookAt?'#F33':'#444';
      ctx.fillRect(this.x+32, this.y-28, 3,3); ctx.fillRect(this.x+36, this.y-28, 3,3);
      // tail sway
      const t = Math.sin(performance.now()*0.004)*5;
      ctx.fillStyle='#000'; ctx.fillRect(this.x-6, this.y-14+t, 6, 4);
    }
    ctx.restore();
  }
  pet(){ this.happy = Math.min(1, this.happy+0.1); this.lookAt=true; setTimeout(()=>this.lookAt=false, 600); }
  feed(){ this.full = Math.min(1, this.full+0.2); }
  toy(){ this.play = Math.min(1, this.play+0.2); }
}
