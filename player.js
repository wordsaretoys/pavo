/**

	Player Object

**/

PAVO.player = new function() {

	var SPIN_RATE = -0.007;
	var NORMAL_SPEED = 10;
	var SPRINT_SPEED = 50;

	var self = this;

	var motion = { 
		moveleft: false, moveright: false,
		movefore: false, moveback: false
	};
	
	var mouse = {
		down: false,
		x: 0,
		y: 0
	};
	
	this.position = new FOAM.Vector();
	this.velocity = new FOAM.Vector();
	this.sprint = false;
	this.debug = false;

	this.init = function() {
		jQuery(window).bind("keydown", this.onKeyDown);
		jQuery(window).bind("keyup", this.onKeyUp);
		jQuery("#gl").bind("mousedown", this.onMouseDown);
		jQuery("#gl").bind("mouseup", this.onMouseUp);
		jQuery("#gl").bind("mousemove", this.onMouseMove);
		FOAM.camera.nearLimit = 0.01;
		FOAM.camera.farLimit = 1024;
		
		this.position.copy(PAVO.defines.space.start);
	};
	
	this.update = function() {
		var dt = FOAM.interval * 0.001;
		var speed = (this.sprint) ? SPRINT_SPEED : NORMAL_SPEED;

		// determine new velocity
		this.velocity.set();
		if (motion.movefore) {
			this.velocity.sub(FOAM.camera.orientation.front);
		}
		if (motion.moveback) {
			this.velocity.add(FOAM.camera.orientation.front);
		}
		if (motion.moveleft) {
			this.velocity.sub(FOAM.camera.orientation.right);
		}
		if (motion.moveright) {
			this.velocity.add(FOAM.camera.orientation.right);
		}
		this.velocity.norm().mul(dt * speed);

		// test collision
		if (this.debug || !PAVO.space.testCollision(this.position, this.velocity)) {
			this.position.add(this.velocity);
		}
		FOAM.camera.position.copy(this.position);
	};
	
	this.onKeyDown = function(event) {
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
			default:
				//window.alert(event.keyCode);
				break;
		}
	};

	this.onKeyUp = function(event) {
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
		return false;
	};
	
	this.onMouseUp = function(event) {
		mouse.down = false;
		return false;
	};

	this.onMouseMove = function(event) {
		var dx, dy;
		if (mouse.down) {
			dx = SPIN_RATE * (event.pageX - mouse.x);
			dy = SPIN_RATE * (event.pageY - mouse.y);
			FOAM.camera.turn(dy, dx, 0);
		}
		mouse.x = event.pageX;
		mouse.y = event.pageY;
		return false;
	};
};

