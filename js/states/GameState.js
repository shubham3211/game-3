var SpaceHipster = SpaceHipster || {};

SpaceHipster.GameState = {

  //initiate game settings
  init: function(currentLevel) {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.PLAYER_SPEED = 200;
    this.BULLET_SPEED = -1000;

    this.numberLevels=3;
    this.currentLevel=currentLevel?currentLevel:1;

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

    this.load.text('level1','assets/data/level1.json')
    this.load.text('level2','assets/data/level2.json')
    this.load.text('level3','assets/data/level3.json')
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

    this.loadLevel();
  },
  update: function() {
    this.game.physics.arcade.overlap(this.palyerBullets,this.enemies,this.damageEnemies,null,this);
    this.game.physics.arcade.overlap(this.player,this.enemyBullets,this.killPlayer,null,this);
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

    this.enemyBullets=this.add.group();
    this.enemyBullets.enableBody=true;

  },
  damageEnemies:function (bullet,enemy) {
    enemy.damageIt(1);
    bullet.kill();
  },
  killPlayer:function () {
   this.player.kill();
   this.game.state.start('GameState');
  },
  createEnemy:function (x,y,health,key,scale,speedX,speedY) {
    let enemy=this.enemies.getFirstExists(false);
    if(!enemy){
      enemy=new SpaceHipster.enemy(this.game,x,y,key,health,this.enemyBullets);
      this.enemies.add(enemy);
    }
    enemy.reset(x,y,health,key,scale,speedX,speedY);

  },
  loadLevel:function () {
      this.currentEnemyIndex = 0;

      this.levelData=JSON.parse(this.game.cache.getText('level'+this.currentLevel));

      this.endOfLevelTimer=this.game.time.events.add(this.levelData.duration*1000,function () {
         if(this.currentLevel<this.numberLevels){
           this.currentLevel++;
         } else {
           this.currentLevel=1;
         }

         this.game.state.start('GameState',true,false,this.currentLevel);

      },this)

      this.scheduleNextEnemy();
  },
  scheduleNextEnemy:function () {
    let nextEnemy=this.levelData.enemies[this.currentEnemyIndex];

    if(nextEnemy){
      console.log('nextEnemy')
      let nextTime=1000*(nextEnemy.time-(this.currentEnemyIndex==0?0:this.levelData.enemies[this.currentEnemyIndex-1].time));
      this.nextEnemyTimer=this.game.time.events.add(nextTime,function () {
        this.createEnemy(nextEnemy.x*this.game.world.width,100,nextEnemy.health,nextEnemy.key
        ,nextEnemy.scale,nextEnemy.speedX,nextEnemy.speedY);
        this.currentEnemyIndex++;
        this.scheduleNextEnemy();
      },this);
    }

  }  

};