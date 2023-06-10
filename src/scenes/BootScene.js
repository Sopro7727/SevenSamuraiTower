class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('logo', 'assets/logo/Koala_Tea.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
