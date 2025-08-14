/** @module states/State_COLOR_PICKER */
export class State_COLOR_PICKER{
  constructor(g){ this.g=g; this.tries=0; this.msg='Pick your color'; }
  update(dt){}
  render(){ const r=this.g.renderer; r.begin(); r.fill('#000'); const c=r.ctx; c.fillStyle='#EEE'; c.fillText(this.msg, 90, 40); const btn=(x,l)=> this._btn(x,80,50,20,l);
    if(btn(40,'Red')||btn(100,'Green')||btn(160,'Blue')){ this.tries++; if(this.tries<3){ this.msg='Choose Again'; } else { this.msg='YOU HAVE NO CHOICE.'; }
      this.g.audio.blip(400+this.tries*100,0.05);
    }
    if(this.tries>=3){ c.fillStyle='#0F0'; if(this._btn(220,120,80,20,'Continue')){ this.g.storage.set('color','Black'); this.g.goto('ROOM'); } }
    r.end(); }
  _btn(x,y,w,h,label){ const c=this.g.renderer.ctx; const mx=this.g.input.mx, my=this.g.input.my; const down=this.g.input.click; const ho=mx>=x&&mx<=x+w&&my>=y&&my<=y+h; c.fillStyle= ho?'#333':'#111'; c.fillRect(x,y,w,h); c.strokeStyle='#700'; c.strokeRect(x+0.5,y+0.5,w-1,h-1); c.fillStyle='#DDD'; c.fillText(label,x+4,y+6); if(ho&&down){ this.g.input.click=false; return true; } return false; }
}