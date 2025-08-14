/**
 * @module core/RNG
 * Seeded PRNG (Mulberry32).
 */
export class RNG{
  constructor(seed=1){ /** @type {number} */ this.seed = seed>>>0; }
  /** @returns {number} [0,1) */
  next(){ let t = this.seed += 0x6D2B79F5; t = Math.imul(t ^ t>>>15, t | 1); t ^= t + Math.imul(t ^ t>>>7, t | 61); return ((t ^ t>>>14)>>>0) / 4294967296; }
  /** @param {number} a @param {number} b */
  range(a,b){ return a + (b-a)*this.next(); }
  /** @param {number} n */
  int(n){ return (this.next()*n)|0; }
  pick(arr){ return arr[this.int(arr.length)] }
}