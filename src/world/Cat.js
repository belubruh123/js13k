/**
 * @module world/Cat
 * Simple black cat sprite and basic needs; responds to pet/feed/toy.
 */
import { CONST } from '../util/constants.js';
export class Cat{
  constructor(){
    // Place the cat exactly in the middle of the canvas.  The sprite is
    // roughly 20x14 so we offset by half its size to keep it visually centred
    // similar to the classic "Tom Cat" layout.
    this.x = (CONST.WIDTH-20)/2;
    this.y = (CONST.HEIGHT/2)+5; // centre vertically (y-5 is sprite centre)

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
      ctx.fillRect(this.x-2, this.y-10, 24, 14); // swollen body
      ctx.fillStyle='#900';
      ctx.fillRect(this.x+10, this.y-16, 12, 8); // grotesque head
      ctx.fillStyle='#FFF';
      ctx.fillRect(this.x+12, this.y-14, 2,2); ctx.fillRect(this.x+16, this.y-14, 2,2);
    }else{
      ctx.fillStyle='#000'; // body
      ctx.fillRect(this.x, this.y-8, 20, 10); // body
      ctx.fillRect(this.x+14, this.y-12, 6, 6); // head
      // eyes
      ctx.fillStyle=this.lookAt?'#F33':'#444';
      ctx.fillRect(this.x+16, this.y-11, 1,1); ctx.fillRect(this.x+18, this.y-11, 1,1);
      // tail sway
      const t = Math.sin(performance.now()*0.004)*3;
      ctx.fillStyle='#000'; ctx.fillRect(this.x-3, this.y-7+t, 4, 2);
    }
    ctx.restore();
  }
  pet(){ this.happy = Math.min(1, this.happy+0.1); this.lookAt=true; setTimeout(()=>this.lookAt=false, 600); }
  feed(){ this.full = Math.min(1, this.full+0.2); }
  toy(){ this.play = Math.min(1, this.play+0.2); }
}
