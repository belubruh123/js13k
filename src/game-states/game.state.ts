import { State } from '@/core/state';
import { drawEngine } from '@/core/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { menuState } from '@/game-states/menu.state';

// Simple raycast-based FPS state
class GameState implements State {
  // Player position and viewing angle
  player = { x: 3.5, y: 3.5, angle: 0 };

  // Map definition: 8x8 grid with one interior wall
  readonly mapWidth = 8;
  readonly mapHeight = 8;
  readonly map: number[] = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
  ];

  onEnter() {
    // Reset player when entering game
    this.player.x = 3.5;
    this.player.y = 3.5;
    this.player.angle = 0;
  }

  private getMap(x: number, y: number) {
    if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
      return 1;
    }
    return this.map[y * this.mapWidth + x];
  }

  onUpdate() {
    const moveSpeed = 0.05;
    const rotSpeed = 0.03;

    // Rotation with left/right
    if (controls.isLeft) this.player.angle -= rotSpeed;
    if (controls.isRight) this.player.angle += rotSpeed;

    // Movement forward/backward
    let dir = 0;
    if (controls.isUp) dir = 1;
    if (controls.isDown) dir = -1;

    const newX = this.player.x + Math.cos(this.player.angle) * moveSpeed * dir;
    const newY = this.player.y + Math.sin(this.player.angle) * moveSpeed * dir;

    // Simple collision check
    if (!this.getMap(Math.floor(newX), Math.floor(this.player.y))) this.player.x = newX;
    if (!this.getMap(Math.floor(this.player.x), Math.floor(newY))) this.player.y = newY;

    const ctx = drawEngine.context;
    const w = drawEngine.canvasWidth;
    const h = drawEngine.canvasHeight;

    // Clear and draw sky & floor
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, w, h / 2);
    ctx.fillStyle = '#444';
    ctx.fillRect(0, h / 2, w, h / 2);

    // Raycasting for each column
    const fov = Math.PI / 3; // 60deg FOV
    for (let x = 0; x < w; x++) {
      const rayAngle = this.player.angle - fov / 2 + (x / w) * fov;
      let distance = 0;
      let hit = false;
      let rayX = this.player.x;
      let rayY = this.player.y;
      const step = 0.02;
      while (!hit && distance < 16) {
        rayX += Math.cos(rayAngle) * step;
        rayY += Math.sin(rayAngle) * step;
        distance += step;
        if (this.getMap(Math.floor(rayX), Math.floor(rayY))) {
          hit = true;
        }
      }

      const lineHeight = h / (distance || 1);
      const start = (h - lineHeight) / 2;
      ctx.fillStyle = '#888';
      ctx.fillRect(x, start, 1, lineHeight);
    }

    if (controls.isEscape) {
      gameStateMachine.setState(menuState);
    }
  }
}

export const gameState = new GameState();

