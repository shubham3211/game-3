var SpaceHipster=SpaceHipster||{};
SpaceHipster.enemy=function (game,x,y,key,health,enemyBullets) {
  Phaser.Sprite.call(this,game,x,y,key);

  this.game=game;

  this.animations.add('getHit',[0,1,2,1,0],25,false);
  this.anchor.setTo(0.5);
  this.health=health;

  this.enemyBullets=enemyBullets;

  this.enemyTimer=this.game.time.create(false);
  this.enemyTimer.start();

  this.scheduleShooting();
};

SpaceHipster.enemy.prototype=Object.create(Phaser.Sprite.prototype);
SpaceHipster.enemy.prototype.constructor=SpaceHipster.enemy;

SpaceHipster.enemy.prototype.update=function () {

  if(this.x<0.05*this.game.world.width){
     this.x=0.05*this.game.world.width+2;
     this.body.velocity.x*=-1;
  }else if(this.x>0.95*this.game.world.width){
     this.x=0.95*this.game.world.width-2;
     this.body.velocity.x*=-1;
  }

  if(this.top>this.game.world.height){
      this.kill();
  }
};

SpaceHipster.enemy.prototype.damageIt=function (amount) {
  Phaser.Sprite.prototype.damage.call(this,amount);
  this.play('getHit');
  if(this.health<=0){
     let emitter=this.game.add.emitter(this.x,this.y,100);
     emitter.makeParticles('enemyParticle');
     emitter.minParticleSpeed.setTo(-200,-200);
     emitter.maxParticleSpeed.setTo(200,200);
     emitter.gravity=0;
     emitter.start(true,500,null,100);
     this.enemyTimer.pause();
  }
};

SpaceHipster.enemy.prototype.scheduleShooting=function () {
  this.shoot();
  this.enemyTimer.add(Phaser.Timer.SECOND*2,this.scheduleShooting,this);
};

SpaceHipster.enemy.prototype.shoot=function () {
  var bullets=this.enemyBullets.getFirstExists(false);
  if(!bullets){
      bullets=new SpaceHipster.enemyBullets(this.game,this.x,this.bottom);
      this.enemyBullets.add(bullets);
  }else {
      bullets.reset(this.x,this.y);
  }
  bullets.body.velocity.y=100;
};

SpaceHipster.enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY){
    Phaser.Sprite.prototype.reset.call(this, x, y, health);

    this.loadTexture(key);
    this.scale.setTo(scale);
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;

    this.enemyTimer.resume();
};