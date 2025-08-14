/**
 * @module audio/Limiter
 * Simple master limiter (hard-knee) to avoid clipping on spikes.
 */
export class Limiter{
  /** @param {AudioContext} ac */
  constructor(ac){
    this.comp = ac.createDynamicsCompressor();
    this.comp.threshold.value = -10; // dB
    this.comp.knee.value = 0;
    this.comp.ratio.value = 20;
    this.comp.attack.value = 0.003;
    this.comp.release.value = 0.1;
  }
}
