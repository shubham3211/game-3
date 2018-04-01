var SpaceHipster= SpaceHipster || {};

SpaceHipster.enemyBullets = function (game,x,y) {
  Phaser.Sprite.call(this,game,x,y,'bullet');
  this.anchor.setTo(0.5);

  this.checkWorldBounds=true;
  this.outOfBoundsKill=true;
};

SpaceHipster.enemyBullets.prototype=Object.create(Phaser.Sprite.prototype);
SpaceHipster.enemyBullets.prototype.constructor=SpaceHipster.enemyBullets;