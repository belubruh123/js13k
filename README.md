# Pet Simulator? (Creepypasta Modular Build)

## Run
Open `/index.html` in a modern browser. No build tools needed.

## File Map
- `/index.html` – Canvas shell, loads modules.
- `/styles.css` – Centering, black bg, pixel rendering.
- `/src/main.js` – Bootstraps engine objects and starts the loop.
- `/src/core/*` – Core engine utilities (Game, StateManager, Timer, RNG).
- `/src/gfx/*` – Renderer, EffectsController (enforces flash caps), TextFX.
- `/src/audio/*` – Web Audio synth engine + master Limiter.
- `/src/ui/UI.js` – Minimal canvas UI.
- `/src/world/*` – Room and Cat.
- `/src/states/*` – BOOT → WARNING → TITLE_A → TITLE_B → COLOR_PICKER → ROOM → EVENTS/LORE → ENDINGS.
- `/src/util/*` – input, constants, storage.

## Safety Caps & Modes
All flashes and shake route through `EffectsController`:
- **Reduced**: no strobe, fades ≥ 400ms; softer shake; spikes subdued.
- **Normal**: ≤ 6 flashes/second; ≤ 800ms per burst.
- **Extreme** (opt-in only): ≤ 10 flashes/second; ≤ 1.2s per burst; stronger shake.

Audio: Master gain ≤ 0.6, master limiter engaged. Mute/Volume available on WARNING and TITLE.

## TITLE_B “zzz” Noise
Implemented in `AudioEngine.zzz()`. It’s a filtered-noise loop with light waveshaping. It ducks naturally because UI blips are short and the bed is low gain. Starts on TITLE_B enter, stops on exit.

## Notes
- BOOT flashes a ⚠️ warning before the options screen.
- Friendly title screen shows a calm “Pet Simulator” splash with © 2025 js13kGames before briefly pleading “LET ME OUT” and cutting to the noisy © 666 menu.
- Color picker flashes a full red screen after three failed picks before forcing Black.
- In the room the cat grows curious about reality for 60 s; once it wonders about escape the scene turns hostile and a door and Exit button appear. Choosing either crashes the game.
- Clicking the cat 13 times splatters blood, triggers a jump scare, and shows “I WILL FIND YOU AGAIN.”
- LocalStorage: seed and run history stored under `pps_*` keys.
