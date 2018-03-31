var SpaceHipster=SpaceHipster||{};
SpaceHipster.enemy=function (game,x,y,key,health,enemyBullets) {
  Phaser.Sprite.call(this,game,x,y,key);
  this.game=game;
  this.animations.add('getHit',[0,1,2,1,0],25,false);
  this.anchor.setTo(0.5);
  this.health=health;
  this.enemyBullets=enemyBullets;
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
};