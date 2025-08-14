/**
 * @module main
 * Entry point. Creates Game instance and starts boot sequence.
 */
import { Game } from './core/Game.js';
import { EffectsController } from './gfx/EffectsController.js';
import { AudioEngine } from './audio/AudioEngine.js';
import { Renderer } from './gfx/Renderer.js';
import { StateManager } from './core/StateManager.js';
import { Timer } from './core/Timer.js';
import { RNG } from './core/RNG.js';
import { storage } from './util/storage.js';
import { INPUT } from './util/input.js';
import { CONST } from './util/constants.js';

// Bootstrap
const canvas = /** @type {HTMLCanvasElement} */(document.getElementById('game'));
const renderer = new Renderer(canvas, CONST.WIDTH, CONST.HEIGHT);

function fitCanvas(){
  const ratio = CONST.WIDTH/CONST.HEIGHT;
  let w = window.innerWidth;
  let h = window.innerHeight;
  if(w/h > ratio){ w = h * ratio; } else { h = w / ratio; }
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
}
window.addEventListener('resize', fitCanvas);
fitCanvas();
const audio = new AudioEngine();
const effects = new EffectsController(renderer, audio);
const timers = new Timer();
const rng = new RNG(storage.get('seed') ?? Math.floor(Math.random()*1e9));
storage.set('seed', rng.seed);
const state = new StateManager();
const game = new Game({ renderer, audio, effects, timers, rng, state, input: INPUT, storage });

// Start
await game.boot();

// Expose for debugging (optional)
window.__game = game;
