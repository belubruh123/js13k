/**
 * @module core/Timer
 * Frame-time scheduler and cooldown helpers.
 */
export class Timer{
  constructor(){ /** @type {Array<{t:number,cb:Function,repeat?:number}>} */ this.jobs=[]; }
  /** @param {number} inSec @param {Function} cb @returns {number} id */
  in(inSec, cb){ const id = Date.now()+Math.random(); this.jobs.push({t:inSec,cb}); return id; }
  /** @param {number} everySec @param {Function} cb */
  every(everySec, cb){ this.jobs.push({t:everySec,cb,repeat:everySec}); }
  /** @param {number} dt */
  tick(dt){ for(const j of [...this.jobs]){ j.t-=dt; if(j.t<=0){ j.cb(); if(j.repeat){ j.t+=j.repeat; } else { this.jobs.splice(this.jobs.indexOf(j),1); } } } }
}