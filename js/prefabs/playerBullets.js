var SpaceHipster = SpaceHipster || {};
SpaceHipster.PlayerBullets=function (game,x,y) {
  Phaser.Sprite.call(this,game,x,y,'bullet');
  this.anchor.setTo(0.5);
  this.checkWorldBounds=true;
  this.outOfBoundsKill=true;
};

SpaceHipster.PlayerBullets.prototype = Object.create(Phaser.Sprite.prototype);
SpaceHipster.PlayerBullets.prototype.constructor=SpaceHipster.PlayerBullets;