/**
 * @module core/Game
 * Game orchestration: main loop, state flow, and global references.
 * Safety caps: delegates all visual spikes to EffectsController; AudioEngine uses limiter.
 */
import { State_BOOT } from '../states/State_BOOT.js';
import { State_WARNING } from '../states/State_WARNING.js';
import { State_TITLE_A } from '../states/State_TITLE_A.js';
import { State_TITLE_B } from '../states/State_TITLE_B.js';
import { State_COLOR_PICKER } from '../states/State_COLOR_PICKER.js';
import { State_ROOM } from '../states/State_ROOM.js';
import { State_EVENTS_LORE } from '../states/State_EVENTS_LORE.js';
import { State_ENDINGS } from '../states/State_ENDINGS.js';
import { CONST } from '../util/constants.js';

/** @typedef {import('../gfx/Renderer.js').Renderer} Renderer */
/** @typedef {import('../audio/AudioEngine.js').AudioEngine} AudioEngine */
/** @typedef {import('../gfx/EffectsController.js').EffectsController} EffectsController */
/** @typedef {import('./Timer.js').Timer} Timer */
/** @typedef {import('./RNG.js').RNG} RNG */
/** @typedef {import('./StateManager.js').StateManager} StateManager */

export class Game {
  /**
   * @param {{renderer:Renderer,audio:AudioEngine,effects:EffectsController,timers:Timer,rng:RNG,state:StateManager,input:import('../util/input.js').INPUT,storage:import('../util/storage.js').storage}} opts
   */
  constructor(opts){
    /** @type {Renderer} */ this.renderer = opts.renderer;
    /** @type {AudioEngine} */ this.audio = opts.audio;
    /** @type {EffectsController} */ this.effects = opts.effects;
    /** @type {Timer} */ this.timers = opts.timers;
    /** @type {RNG} */ this.rng = opts.rng;
    /** @type {StateManager} */ this.state = opts.state;
    /** @type {import('../util/input.js').INPUT} */ this.input = opts.input;
    /** @type {import('../util/storage.js').storage} */ this.storage = opts.storage;

    /** @type {number} */ this.lastTime = performance.now();
    /** @type {boolean} */ this.running = false;

    // State instances
    this.states = {
      BOOT: new State_BOOT(this),
      WARNING: new State_WARNING(this),
      TITLE_A: new State_TITLE_A(this),
      TITLE_B: new State_TITLE_B(this),
      COLOR_PICKER: new State_COLOR_PICKER(this),
      ROOM: new State_ROOM(this),
      EVENTS_LORE: new State_EVENTS_LORE(this),
      ENDINGS: new State_ENDINGS(this),
    };
  }

  /** Boots, sets initial state, and enters main loop. */
  async boot(){
    this.running = true;
    this.state.set(this.states.BOOT);
    this.loop(performance.now());
  }

  /** Main RAF loop */
  loop(now){
    if(!this.running) return;
    const dt = Math.min(1/30, (now - this.lastTime)/1000);
    this.lastTime = now;
    this.timers.tick(dt);
    this.state.update(dt);
    this.state.render();
    requestAnimationFrame((t)=>this.loop(t));
  }

  /** Convenience: flow to next state by key name */
  goto(key){ this.state.set(this.states[key]); }
}