//this function does the inheritance
BOK.inherits(FireEffect, createjs.Container);


/**
 * @ constructor
 * */
function FireEffect(x, y, type) {
	 //this line is a must-have in prototype-chain style inheritance
    //Compare to JAVA this works as super();
	
    createjs.Container.call(this);
	
	this.fireBallEffectData = {
		// image to use
		framerate : 5,
		images    : [imgContainer["imgs/fireballeffect.png"]], 
		// width, height & registration point of each sprite
		frames    : {width: 16, height: 16, regX: 8, regY: 8 },
		animations: {  
			fireball: {
				frames: [0, 1, 2],
				speed : 0.5,
			},
			
			firework: {
				frames: [0, 1, 2],
				speed : 0.2,
			}
		}
	};
	this.fireBallEffectSpriteSheet = new createjs.SpriteSheet(this.fireBallEffectData);
	
	this.fireBallEffectAnimation = new createjs.Sprite(this.fireBallEffectSpriteSheet);
	
	this.currentAnimation = type;
	
	this.visible = false;
	
	this.addChild(this.fireBallEffectAnimation);
	
	this.x = x;
	this.y = y;
	this.index = -1;
}

FireEffect.prototype.setVisibleTrue = function(){
	this.index = -1;
	this.visible = true;
};

FireEffect.prototype.getVisible = function(){
	return this.visible;
};

FireEffect.prototype.setViewPos = function(x,y){
	this.x = x;
	this.y = y;
};

FireEffect.prototype.play = function(){
	this.fireBallEffectAnimation.gotoAndPlay(this.currentAnimation);
};

FireEffect.prototype.update = function(){
	if(this.currentAnimation == "fireball"){
		if(this.fireBallEffectAnimation.currentFrame == 2){
			this.visible = false;
			this.fireBallEffectAnimation.gotoAndStop(this.currentAnimation);
		}
	}else if(this.currentAnimation == "firework"){
		if(this.fireBallEffectAnimation.currentFrame == 2 && this.visible == true || this.index > 50){
			this.visible = false;
			this.fireBallEffectAnimation.gotoAndStop(this.currentAnimation);
			this.x += 15 * (Math.sin(this.index * this.index) + 1.5);
			this.y -= 10 * (Math.sin(this.index * this.index) + 1);
			this.index++;
		}
		else if(this.visible == false &&  this.index != 0 && this.index != -1){
			if( this.index % 10 == 0){
				this.visible = true;
				this.play();
			}
			else{
				this.index++;
			}
		}
	}	
};
