/**
	construct a player object

	player is only created once, but is written to inherit
	from the PAVO.Mover object in order to use its methods

	inheritance chain:
	FOAM.Thing -> PAVO.Mover -> FOAM.Camera -> PAVO.Player
	
	@namespace PAVO
	@class Player
	@constructor
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

	/**
		establish jQuery shells around player DOM objects &
		set up event handlers for player controls
		
		mouseTracker div lies over canvas and HUD elements to
		prevent mouse dragging from selecting anything under it
		
		@method init
	**/

	this.init = function() {
	
		dom = {
			mouseTracker: jQuery("#mouse-tracker"),
			curtain: jQuery("#curtain"),
			window: jQuery(window)
		};
		dom.mouseTracker.resize = function() {
			dom.mouseTracker.width(FOAM.width);
			dom.mouseTracker.height(FOAM.height);
		}
		dom.mouseTracker.resize();

		dom.window.bind("resize", dom.mouseTracker.resize);
		dom.window.bind("keydown", this.onKeyDown);
		dom.window.bind("keyup", this.onKeyUp);
		
		dom.mouseTracker.bind("mousedown", this.onMouseDown);
		dom.mouseTracker.bind("mouseup", this.onMouseUp);
		dom.mouseTracker.bind("mousemove", this.onMouseMove);

		this.nearLimit = 0.01;
		this.farLimit = 1024;
	};
	
	/**
		react to player controls by updating velocity and position &
		handle collision detection
		
		called on every animation frame
		
		@method update
	**/

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
	};
	
	/**
		handle a keypress
		
		@method onKeyDown
		@param event browser object containing event information
		@return true to enable default key behavior
	**/

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
			default:
				//window.alert(event.keyCode);
				break;
		}
	};

	/**
		handle a key release
		
		@method onKeyUp
		@param event browser object containing event information
		@return true to enable default key behavior
	**/

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

	/**
		handle a mouse down event
		
		@method onMouseDown
		@param event browser object containing event information
		@return true to enable default mouse behavior
	**/

	this.onMouseDown = function(event) {
		mouse.down = true;
		return false;
	};
	
	/**
		handle a mouse up event
		
		@method onMouseUp
		@param event browser object containing event information
		@return true to enable default mouse behavior
	**/

	this.onMouseUp = function(event) {
		mouse.down = false;
		return false;
	};

	/**
		handle a mouse move event
		
		@method onMouseMove
		@param event browser object containing event information
		@return true to enable default mouse behavior
	**/

	this.onMouseMove = function(event) {
		var dx, dy;

		if (mouse.down && !self.freeze && !mouse.invalid) {
			dx = SPIN_RATE * (event.pageX - mouse.x);
			dy = SPIN_RATE * (event.pageY - mouse.y);
			self.spin(dx, dy);
		}
		mouse.x = event.pageX;
		mouse.y = event.pageY;
		mouse.invalid = false;
		return false;
	};
	
	/**
		invalidate the next mouse motion event
		
		use this when returning from a modal dialog to prevent a "whiplash" effect
		(event.pageX & event.pageY may not represent useful/contiguous mouse values)
		
		@method invalidateMouse
	**/

	this.invalidateMouse = function() {
		mouse.invalid = true;
	};
	
};


/**
	generate player object
	
	@method makePlayer
**/

PAVO.makePlayer = function() {
	FOAM.Camera.prototype = PAVO.makeMover();
	PAVO.Player.prototype = new FOAM.Camera();
	PAVO.player = new PAVO.Player();
}
