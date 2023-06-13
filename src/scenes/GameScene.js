class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  init() {
    this.map = map.map(function (arr) {
      return arr.slice();
    });
    this.level = 1;
    this.nextEnemy = 0;
    this.score = 0;
    this.baseHealth = levelConfig.initial.baseHealth;
    this.availableTurrets = levelConfig.initial.numOfTurrets;
    this.roundStarted = false;
    this.remainingEnemies = levelConfig.initial.numOfEnemies + this.level * levelConfig.incremental.numOfEnemies;

    this.events.emit('displayUI');
    this.events.emit('updateHealth', this.baseHealth);
    this.events.emit('updateScore', this.score);
    this.events.emit('updateTurrets', this.availableTurrets);
    this.events.emit('updateEnemies', this.remainingEnemies);

    // grab a reference to the UI scene
    this.uiScene = this.scene.get('UI');
  }

  create() {
    this.events.emit('startRound', this.level);
    this.uiScene.events.on('roundReady', function() {
      this.roundStarted = true;
    }.bind(this));

    this.createMap();
    this.createPath();
    this.createCursor();
    this.createGroups();
    let bgm = this.sound.add('bgmusic', {volume: 0.3});
    bgm.play();
  }

  
  update(time, delta) {
    // if its time for the next enemy
    console.log(`X: ${game.input.mousePointer.x}\nY: ${game.input.mousePointer.y}`);
    
    if (time > this.nextEnemy && this.roundStarted && this.enemies.countActive(true) < this.remainingEnemies) {
      var enemy = this.enemies.getFirstDead();
      if (!enemy) {
        enemy = new Enemy(this, 0, 0, this.path);
        this.enemies.add(enemy);
      }

      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);

        // place the enemy at the start of the path
        enemy.startOnPath(this.level);

        this.nextEnemy = time + 1500;
      }
    }
    
  }

  updateScore(score) {
    this.score += score;
    this.events.emit('updateScore', this.score);
  }

  updateHealth(health) {
    this.baseHealth -= health;
    this.events.emit('updateHealth', this.baseHealth);

    if (this.baseHealth <= 0) {
      this.events.emit('hideUI');
      this.scene.start('Title');
    }
  }

  increaseLevel() {
    // stop round
    this.roundStarted = false;
    // increment level
    this.level++;
    if(this.level == 2){
      this.turretsW1.setVisible(0);
      this.turretsW1.destroy();
      this.map =  [
        [ -1, -1,-1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, 0, -1, 0, -1, 0, -1, -1, -1],
        [ -1, 0, -1, -1, 0, -1, 0, -1, 0, -1],
        [ -1, -1, -1, -1, 0, -1, -1, -1, -1, -1],
        [ -1, 0, 0, -1, -1, -1, 0, -1, -1, -1],
        [ -1, 0, -1, -1, 0, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, 0, 0, -1, -1],
        [ -1, 0, -1,-1, -1, -1, -1, -1, -1, -1]
      ];
      this.updateTurrets(4);
    }
    if(this.level == 3){
      this.turretsW2.setVisible(0);
      this.turretsW2.destroy();
      this.map =  [
        [ -1, -1,-1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, 0, -1, 0, -1, 0, -1, -1, -1],
        [ -1, 0, -1, -1, 0, -1, 0, -1, 0, -1],
        [ -1, -1, -1, -1, 0, -1, -1, -1, -1, -1],
        [ -1, 0, 0, -1, -1, -1, 0, -1, -1, -1],
        [ -1, 0, -1, -1, 0, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, 0, 0, -1, -1],
        [ -1, 0, -1,-1, -1, -1, -1, -1, -1, -1]
      ];
      this.updateTurrets(2);
    }
    if(this.level == 4){
      this.events.emit('hideUI');
      this.scene.start('Title');
    }
    this.updateTurrets(levelConfig.incremental.numOfTurrets);
    // increment number of enemies
    this.updateEnemies(levelConfig.initial.numOfEnemies + this.level * levelConfig.incremental.numOfEnemies);
    this.events.emit('startRound', this.level);
  }

  updateEnemies(numberOfEnemies) {
    this.remainingEnemies += numberOfEnemies;
    this.events.emit('updateEnemies', this.remainingEnemies);
    if (this.remainingEnemies <= 0) {
      this.increaseLevel();
    }
  }

  updateTurrets(numberOfTurrets) {
    this.availableTurrets += numberOfTurrets;
    this.events.emit('updateTurrets', this.availableTurrets);
  }

  createGroups() {
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.turretsW1 = this.add.group({ classType: Turret, runChildUpdate: true });
    this.turretsW2 = this.add.group({ classType: Turret, runChildUpdate: true });
    this.turretsW3 = this.add.group({ classType: Turret, runChildUpdate: true });
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy.bind(this));
    this.input.on('pointerdown', this.placeTurret.bind(this));
  }

  createCursor() {
    this.cursor = this.add.image(16, 16, 'cursor');
    this.cursor.setScale(2);
    this.cursor.alpha = 0;
    //console.log(`X: ${this.cursor.x}\nY: ${this.cursor.y}\n`);
    this.input.on('pointermove', function (pointer) {
      var i = Math.floor(pointer.y / 64);
      var j = Math.floor(pointer.x / 64);
      //console.log(`X: ${this.cursor.x}\nY: ${this.cursor.y}\nMap Value: ${this.map[i][j]}`);
      if (this.canPlaceTurret(i, j)) {
        this.cursor.setPosition(j * 64+32, i * 64+32);
        this.cursor.alpha = 0.8;
      } else {
        this.cursor.alpha = 0;
      }
    }.bind(this));
  }

  canPlaceTurret(i, j) {
    return this.map[i][j] === 0 && this.availableTurrets > 0;
  }

  createPath() {
    this.graphics = this.add.graphics();
    // the path the enemies follow
    this.path = this.add.path(80, 4);
    this.path.lineTo(80, 150)
    this.path.lineTo(142, 150)
    this.path.lineTo(142, 245)
    this.path.lineTo(50, 245)
    this.path.lineTo(50, 435)
    this.path.lineTo(145, 435)
    this.path.lineTo(145, 340)
    this.path.lineTo(238, 340)
    this.path.lineTo(238, 49)
    this.path.lineTo(335, 49)
    this.path.lineTo(335, 209)
    this.path.lineTo(462, 209)
    this.path.lineTo(462, 53)
    this.path.lineTo(589, 53)
    this.path.lineTo(589, 301)
    this.path.lineTo(469, 301)
    this.path.lineTo(469, 370)
    this.path.lineTo(338, 370)
    this.path.lineTo(338, 460)
    this.path.lineTo(600, 460)


    // visualizing the path
    this.graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(this.graphics);
  }

  createMap() {
    this.background = this.add.tileSprite(0,0, 640, 512, 'gameMap').setOrigin(0,0);
    // create our map
    /*const bgMap = this.add.tilemap(tileMap);
    // add tileset image
    const tiles = this.bgMap.addTilesetImage('tileset', 'tiles');
    // create our background layer
    this.backgroundLayer = this.bgMap.createLayer('Background', this.tiles, 0, 0);
    // add tower
    this.add.image(480, 480, 'base');
    */
  }

  getEnemy(x, y, distance) {
    var enemyUnits = this.enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance) {
        return enemyUnits[i];
      }
    }
    return false;
  }

  addBullet(x, y, angle) {
    var bullet = this.bullets.getFirstDead();
    if (!bullet) {
      bullet = new Bullet(this, 0, 0);
      this.bullets.add(bullet);
    }
    bullet.fire(x, y, angle);
  }

  placeTurret(pointer) {
    var i = Math.floor(pointer.y / 64);
    var j = Math.floor(pointer.x / 64);

    if (this.canPlaceTurret(i, j)) {
      if(this.level == 1){
        var turret = this.turretsW1.getFirstDead();
      }
      if(this.level == 2){
        var turret = this.turretsW2.getFirstDead();
      }
      if(this.level == 3){
        var turret = this.turretsW3.getFirstDead();
      }
      if (!turret && this.level == 1) {
        turret = new Turret(this, 0, 0, this.map);
        this.turretsW1.add(turret);
      }
      if(!turret && this.level == 2){
        turret = new Turret(this, 0, 0, this.map);
        this.turretsW2.add(turret);
      }
      if(!turret && this.level == 3){
        turret = new Turret(this, 0, 0, this.map);
        this.turretsW3.add(turret);
      }
      turret.setActive(true);
      turret.setVisible(true);
      turret.place(i, j);
      this.updateTurrets(-1);
    }
  }

  damageEnemy(enemy, bullet) {
    if (enemy.active === true && bullet.active === true) {
      bullet.setActive(false);
      bullet.setVisible(false);

      // decrease the enemy hp
      enemy.receiveDamage(levelConfig.initial.bulletDamage);
    }
  }
}
