/**
 * @module util/input
 * Tracks mouse and basic buttons.
 */
export const INPUT = { mx:0, my:0, down:false, click:false };
(function(){ const c=/** @type {HTMLCanvasElement} */(document.getElementById('game'));
  c.addEventListener('mousemove',e=>{ const r=c.getBoundingClientRect(); INPUT.mx=(e.clientX-r.left)*(c.width/r.width); INPUT.my=(e.clientY-r.top)*(c.height/r.height); });
  c.addEventListener('mousedown',()=>{ INPUT.down=true; });
  c.addEventListener('mouseup',()=>{ INPUT.down=false; INPUT.click=true; setTimeout(()=>INPUT.click=false,0); });
})();
