/**

	Player Object

**/

PAVO.Player = function() {

	var SPIN_RATE = -0.007;
	var NORMAL_SPEED = 10;
	var SPRINT_SPEED = 50;

	var self = this;
	var dom;

	var motion = { 
		moveleft: false, moveright: false,
		movefore: false, moveback: false
	};
	
	var mouse = {
		down: false,
		x: 0,
		y: 0,
		invalid: true
	};
	
	var scratch = {
		direction: new FOAM.Vector(),
		velocity: new FOAM.Vector()
	};
	
	this.velocity = new FOAM.Vector();
	this.sprint = false;
	this.debug = false;
	this.freeze = false;
	this.score = 0;

	this.init = function() {
	
		dom = {
			mouseTracker: jQuery("#mouse-tracker"),
			curtain: jQuery("#curtain")
		};
		dom.mouseTracker.resize = function() {
			dom.mouseTracker.width(FOAM.width);
			dom.mouseTracker.height(FOAM.height);
		}
		dom.mouseTracker.resize();
		jQuery(window).bind("resize", dom.mouseTracker.resize);

		jQuery(window).bind("keydown", this.onKeyDown);
		jQuery(window).bind("keyup", this.onKeyUp);
		dom.mouseTracker.bind("mousedown", this.onMouseDown);
		dom.mouseTracker.bind("mouseup", this.onMouseUp);
		dom.mouseTracker.bind("mousemove", this.onMouseMove);

		this.nearLimit = 0.01;
		this.farLimit = 1024;
	};
	
	this.update = function() {
		var dt = FOAM.interval * 0.001;
		var speed = (this.sprint) ? SPRINT_SPEED : NORMAL_SPEED;

		scratch.direction.set();
		if (motion.movefore) {
			scratch.direction.sub(this.orientation.front);
		}
		if (motion.moveback) {
			scratch.direction.add(this.orientation.front);
		}
		if (motion.moveleft) {
			scratch.direction.sub(this.orientation.right);
		}
		if (motion.moveright) {
			scratch.direction.add(this.orientation.right);
		}
		if (!this.debug)
			scratch.direction.y = 0;
		scratch.direction.norm();
		
		this.velocity.x = scratch.direction.x * speed;
		this.velocity.y = this.debug ? scratch.direction.y * speed : this.velocity.y - 9.81 * dt;
		this.velocity.z = scratch.direction.z * speed;
		
		if (!this.debug)
			PAVO.space.collision(this.position, this.velocity);
		scratch.velocity.copy(this.velocity).mul(dt);
		this.position.add(scratch.velocity);
		
		scratch.direction.copy(this.position);
		scratch.direction.dejitter(8, Math.floor);
		scratch.velocity.set(4, 4, 4).add(scratch.direction);
//		scratch.velocity.set(4, 0, 4).add(scratch.direction);
		PAVO.hud.setDebug(scratch.velocity.x + "<br>" + scratch.velocity.y + "<br>" + scratch.velocity.z);
	};
	
	this.onKeyDown = function(event) {

		if (self.freeze)
			return;
	
		switch(event.keyCode) {
			case FOAM.KEY.A:
				motion.moveleft = true;
				break;
			case FOAM.KEY.D:
				motion.moveright = true;
				break;
			case FOAM.KEY.W:
				motion.movefore = true;
				break;
			case FOAM.KEY.S:
				motion.moveback = true;
				break;
			case FOAM.KEY.SHIFT:
				self.sprint = true;
				break;
			case FOAM.KEY.X:
				self.debug = !self.debug;
				break;
			case FOAM.KEY.SPACE:
				if (self.velocity.y === 0)
					self.velocity.y = 15;
			default:
				//window.alert(event.keyCode);
				break;
		}
	};

	this.onKeyUp = function(event) {

		if (self.freeze)
			return;

		switch(event.keyCode) {
		
			case FOAM.KEY.A:
				motion.moveleft = false;
				break;
			case FOAM.KEY.D:
				motion.moveright = false;
				break;
			case FOAM.KEY.W:
				motion.movefore = false;
				break;
			case FOAM.KEY.S:
				motion.moveback = false;
				break;
			case FOAM.KEY.SHIFT:
				self.sprint = false;
				break;
			default:
				break;
		}
	};

	this.onMouseDown = function(event) {
		mouse.down = true;
		dom.mouseTracker.css("cursor", "move");
		return false;
	};
	
	this.onMouseUp = function(event) {
		mouse.down = false;
		dom.mouseTracker.css("cursor", "default");
		return false;
	};

	this.onMouseMove = function(event) {
		var dx, dy;

		if (mouse.down && !self.freeze && !mouse.invalid) {
			dx = SPIN_RATE * (event.pageX - mouse.x);
			dy = SPIN_RATE * (event.pageY - mouse.y);
			self.spin(dx, dy);
		}
		mouse.x = event.pageX;
		mouse.y = event.pageY;
		if (mouse.invalid)
			mouse.invalid = false;
		return false;
	};
	
	this.invalidateMouse = function() {
		mouse.invalid = true;
	};
	
};

// for those playing along at home, the inheritance chain goes:
// FOAM.Thing -> PAVO.Mover -> FOAM.Camera -> PAVO.Player
FOAM.Camera.prototype = PAVO.makeMover();
PAVO.Player.prototype = new FOAM.Camera();
PAVO.player = new PAVO.Player();
