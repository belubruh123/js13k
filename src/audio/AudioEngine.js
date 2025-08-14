/**
 * @module audio/AudioEngine
 * WebAudio synth/FX. Voices: noise grains, saw/square, purr, door hum, zzz bed.
 * Safety: master gain clamped to <= 0.6; Limiter on master; no infrasonic tones.
 */
import { Limiter } from './Limiter.js';

export class AudioEngine{
  constructor(){
    /** @type {AudioContext|null} */ this.ac=null;
    /** @type {GainNode|null} */ this.master=null;
    /** @type {Limiter|null} */ this.lim=null;
    /** @type {boolean} */ this.muted=false; this.volume=0.4; this.mode='normal';
    this.runningBeds = new Map();
  }
  ensure(){ if(!this.ac){ this.ac = new (window.AudioContext||window.webkitAudioContext)(); this.master=this.ac.createGain(); this.lim = new Limiter(this.ac); this.master.gain.value = this.muted?0:Math.min(0.6,this.volume); this.master.connect(this.lim.comp).connect(this.ac.destination); } }
  setMode(m){ this.mode=m; }
  setMute(m){ this.muted=m; if(this.master) this.master.gain.value = m?0:Math.min(0.6,this.volume); }
  setVolume(v){ this.volume=Math.max(0,Math.min(1,v)); if(this.master&&!this.muted) this.master.gain.value = Math.min(0.6,this.volume); }
  /** Bitcrushed blip */ blip(freq=600, dur=0.05){ this.ensure(); const ac=this.ac; const o=ac.createOscillator(); o.type='square'; const g=ac.createGain(); g.gain.value=0.0; const step=1/16; // crude crush
    const sh=ac.createWaveShaper(); sh.curve=new Float32Array([ -1,-0.5,0,0.5,1 ]); sh.oversample='none';
    o.frequency.value=freq; o.connect(sh).connect(g).connect(this.master);
    o.start(); const t=ac.currentTime; g.gain.setValueAtTime(0.2,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.stop(t+dur+0.01);
  }
  /** Whisper hiss */ hiss(dur=0.4){ this.ensure(); const ac=this.ac; const b=ac.createBuffer(1, ac.sampleRate*dur, ac.sampleRate); const d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*0.3; const src=ac.createBufferSource(); src.buffer=b; const g=ac.createGain(); g.gain.value=0.1; const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2000; src.connect(lp).connect(g).connect(this.master); src.start(); }
  /** Glitch grain bed */ grains(){ this.ensure(); if(this.runningBeds.has('grains')) return; const ac=this.ac; const g=ac.createGain(); g.gain.value=0.05; g.connect(this.master); let alive=true; const tick=()=>{ if(!alive) return; const dur=0.03+Math.random()*0.05; const b=ac.createBuffer(1, ac.sampleRate*dur, ac.sampleRate); const d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*0.15; const src=ac.createBufferSource(); src.buffer=b; const p=ac.createStereoPanner(); p.pan.value=(Math.random()*2-1)*0.3; src.connect(p).connect(g); src.start(); setTimeout(tick, 40+Math.random()*120); }; tick(); this.runningBeds.set('grains', ()=>{alive=false; g.disconnect();}); }
  stopBed(name){ const stop=this.runningBeds.get(name); if(stop){ stop(); this.runningBeds.delete(name);} }
  /** Cat purr */ purr(on=true){ this.ensure(); if(!on){ this.stopBed('purr'); return; } if(this.runningBeds.has('purr')) return; const ac=this.ac; const g=ac.createGain(); g.gain.value=0.06; const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=500; const trem=ac.createOscillator(); trem.frequency.value=6; const tremG=ac.createGain(); tremG.gain.value=0.05; trem.connect(tremG.gain);
    const noise=ac.createBuffer(1, ac.sampleRate*2, ac.sampleRate); const d=noise.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*0.2; const src=ac.createBufferSource(); src.loop=true; src.buffer=noise; src.connect(lp).connect(g).connect(this.master); trem.start(); const stop=()=>{ g.disconnect(); }; this.runningBeds.set('purr', stop); }
  /** Door hum */ hum(on=true){ this.ensure(); if(!on){ this.stopBed('hum'); return; } if(this.runningBeds.has('hum')) return; const ac=this.ac; const osc1=ac.createOscillator(); const osc2=ac.createOscillator(); const g=ac.createGain(); g.gain.value=0.05; osc1.type='sawtooth'; osc2.type='sawtooth'; osc1.frequency.value=90; osc2.frequency.value=90.9; osc1.connect(g); osc2.connect(g); g.connect(this.master); osc1.start(); osc2.start(); this.runningBeds.set('hum', ()=>{ g.disconnect(); osc1.stop(); osc2.stop(); }); }
  /** TITLE_B fast zzz buzz */ zzz(on=true){ this.ensure(); if(!on){ this.stopBed('zzz'); return; } if(this.runningBeds.has('zzz')) return; const ac=this.ac; const g=ac.createGain(); g.gain.value=0.04; const crush=ac.createWaveShaper(); crush.curve=new Float32Array([ -1,-0.2,0,0.2,1 ]); const lp=ac.createBiquadFilter(); lp.type='bandpass'; lp.frequency.value=1500; lp.Q.value=0.7; const tick=()=>{ const dur=0.02; const b=ac.createBuffer(1, ac.sampleRate*dur, ac.sampleRate); const d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*0.3; const src=ac.createBufferSource(); src.buffer=b; src.connect(crush).connect(lp).connect(g).connect(this.master); src.start(); }; const h=setInterval(tick, 20); this.runningBeds.set('zzz', ()=>{ clearInterval(h); g.disconnect(); }); }
  /** Jumpscare sting */ sting(intensity=1){ this.ensure(); const ac=this.ac; const o=ac.createOscillator(); const n=ac.createOscillator(); o.type='sawtooth'; n.type='triangle'; const g=ac.createGain(); g.gain.value=0.0; o.connect(g); n.connect(g); g.connect(this.master); const t=ac.currentTime; o.frequency.setValueAtTime(200,t); o.frequency.exponentialRampToValueAtTime(40,t+0.2);
    n.frequency.setValueAtTime(800,t); n.frequency.exponentialRampToValueAtTime(120,t+0.2);
    g.gain.linearRampToValueAtTime(0.25*intensity, t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t+0.25);
    o.start(); n.start(); o.stop(t+0.3); n.stop(t+0.3);
  }
}