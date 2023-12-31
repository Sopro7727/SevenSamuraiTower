/*
    Noah Walker
    Major Components:
      Physics
      Cameras
      Text Objects
      Tween
*/
let config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 640,
  height: 512,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: [BootScene, PreloaderScene, TitleScene, GameScene, UIScene, EndScene]
};
let levelConfig = {
  initial: {
    enemySpeed: 1/150000,
    enemyHealth: 125,
    bulletDamage: 100,
    numOfEnemies: 5,
    numOfTurrets: 7,
    baseHealth: 5
  },
  incremental: {
    enemySpeed: 5,
    enemyHealth: 25,
    numOfEnemies: 2,
    numOfTurrets: 1
  },
  decremental: {
    numOfTurrets: -2
  }
}
let game = new Phaser.Game(config);
let map =  [
  [ -1, -1,-1, -1, -1, -1, -1, -1, -1, -1],
  [ -1, -1, 0, -1, 0, -1, 0, -1, -1, -1],
  [ -1, 0, -1, -1, 0, -1, 0, -1, 0, -1],
  [ -1, -1, -1, -1, 0, -1, -1, -1, -1, -1],
  [ -1, 0, 0, -1, -1, -1, 0, -1, -1, -1],
  [ -1, 0, -1, -1, 0, -1, -1, -1, -1, -1],
  [ -1, -1, -1, -1, -1, -1, 0, 0, -1, -1],
  [ -1, 0, -1,-1, -1, -1, -1, -1, -1, -1]
];

function resize() {
  var canvas = document.querySelector('canvas');
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = config.width / config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = (windowWidth / gameRatio) + 'px';
  } else {
    canvas.style.width = (windowHeight * gameRatio) + 'px';
    canvas.style.height = windowHeight + 'px';
  }
}