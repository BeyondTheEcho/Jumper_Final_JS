import Phaser from 'phaser';
import PlayScene from './Scenes/PlayScene';
import GameOverScene from './Scenes/GameOverScene';

const WIDTH = 800;
const HEIGHT = 600;
//800 x 600
const BIRD_POSITION = {x: WIDTH /2, y: HEIGHT * 0.85 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const config = {
  // Auto defaults to WebGL
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
    }
  },
  scene: [new PlayScene(SHARED_CONFIG),new GameOverScene(SHARED_CONFIG)],
}

new Phaser.Game(config);