var SpaceHipster = SpaceHipster || {};

SpaceHipster.GameState = {

  //initiate game settings
  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.PLAYER_SPEED = 200;
    this.BULLET_SPEED = -1000;

  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('space', 'assets/images/space.png');    
    this.load.image('player', 'assets/images/player.png');    
    this.load.image('bullet', 'assets/images/bullet.png');    
    this.load.image('enemyParticle', 'assets/images/enemyParticle.png');    
    this.load.spritesheet('yellowEnemy', 'assets/images/yellow_enemy.png', 50, 46, 3, 1, 1);   
    this.load.spritesheet('redEnemy', 'assets/images/red_enemy.png', 50, 46, 3, 1, 1);   
    this.load.spritesheet('greenEnemy', 'assets/images/green_enemy.png', 50, 46, 3, 1, 1);   

    
  },
  //executed after everything is loaded
  create: function() {
    this.background=this.add.tileSprite(0,0,this.game.width,this.game.height,'space');
    this.background.autoScroll(0,30);

    this.player=this.add.sprite(this.game.world.centerX,this.game.world.height-50,'player');
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds=true;
    this.initBullets();
    this.initEnemies();
    this.shootingTimer=this.game.time.events.loop(Phaser.Timer.SECOND/5,this.createPlayerBullets,this)

  },
  update: function() {
    this.game.physics.arcade.overlap(this.palyerBullets,this.enemies,this.damageEnemies,null,this);
    this.player.body.velocity.x=0;

    if(this.game.input.activePointer.isDown){
      let targetX=this.game.input.activePointer.position.x;
      console.log(targetX)
      let direction=targetX>=this.game.world.centerX?1:-1;
      this.player.body.velocity.x=direction*this.PLAYER_SPEED;
    }
  },
  initBullets:function () {
    this.palyerBullets=this.add.group();
    this.palyerBullets.enableBody=true;
  },
  createPlayerBullets:function () {
    let bullets=this.palyerBullets.getFirstExists(false);
    if(!bullets){
      bullets=new SpaceHipster.PlayerBullets(this.game,this.player.x,this.player.top);
      this.palyerBullets.add(bullets);
    }else{
      bullets.reset(this.player.x,this.player.top);
    }
    bullets.body.velocity.y=this.BULLET_SPEED;

  },
  initEnemies:function () {
    this.enemies=this.add.group();
    this.enemies.enableBody=true;

    let enemy=new SpaceHipster.enemy(this.game,100,100,'greenEnemy',10,[]);
    this.enemies.add(enemy);
    enemy.body.velocity.x=100;
    enemy.body.velocity.y=50;
  },
  damageEnemies:function (bullet,enemy) {
    enemy.damageIt(1);
    bullet.kill();
  }  

};