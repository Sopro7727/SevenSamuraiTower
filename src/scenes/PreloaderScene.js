class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    // time event for logo
    // TODO - update delayedCall time
    this.timedEvent = this.time.delayedCall(1, this.ready, [], this);
    this.createPreloader();
    this.loadAssets();
  }

  createPreloader() {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // add logo image
    this.add.image(width / 2, height / 2, 'logo');

    // display progress bar
    var progressBar = this.add.graphics();
    var progresBox = this.add.graphics();
    progresBox.fillStyle(0x222222, 0.8);
    progresBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

    // loading text
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    // percent text
    var percenText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percenText.setOrigin(0.5, 0.5);

    // loading assets text
    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', function (value) {
      percenText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    // remove progress bar when complete
    this.load.on('complete', function () {
      progresBox.destroy();
      progressBar.destroy();
      assetText.destroy();
      loadingText.destroy();
      percenText.destroy();
      this.ready();
    }.bind(this));
  }

  loadAssets() {
    // load assets needed in our game
    this.load.image('bullet', 'assets/level/Arrow.png');
    this.load.spritesheet('tower', 'assets/level/Idle.png',{frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 13});
    //this.load.spritesheet('shoot', 'assets/level/Shot.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 13});
    this.load.spritesheet('enemy', 'assets/level/Bandit.png', {frameWidth: 128, frameHeight: 128, startFrame: 0, endFrame: 7});
    this.load.image('base', 'assets/level/base.png');
    this.load.image('title', 'assets/ui/title.png');
    this.load.image('cursor', 'assets/ui/cursor.png');
    this.load.image('blueButton1', 'assets/ui/blue_button02.png');
    this.load.image('blueButton2', 'assets/ui/blue_button03.png');
    //this.anims.create({key:'shoot', frames: this.anims.generateFrameNumbers('shoot', {start: 0, end: 13, first: 0}),frameRate: 30});
    this.load.audio('bgmusic', './assets/ui/Lament_Orchestra.wav');
    // placeholder
    this.load.image('logo2', 'assets/logo.png');
    this.load.image('gameMap', 'assets/level/map.png');
    this.load.image('end', 'assets/ui/endScreen.png');
  }

  ready() {
    this.readyCount++;
    if (this.readyCount === 2) {
      // TODO: switch to title screen
      this.scene.start('Title');
    }
  }
}
