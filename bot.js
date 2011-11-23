/**

	Bot Object
	
**/

PAVO.Bot = function() {

	this.SPIN_RATE = 0.1;
	this.BASE_SPEED = 10;

	this.state = {
		STARTING: 0,
		WANDERING: 1,
		ATTENTION: 2,
		
		active: -1,
		
		wander: {
			target: new FOAM.Vector()
		},
		
		attend: {
			timer: 0,
			target: new FOAM.Vector(),
			lastPos: new FOAM.Vector()
		}
	};

	this.prng = new FOAM.Prng();

	// inherit from ancestor's scratch objects, if present
	this.scratch = this.scratch || {};
	jQuery.extend(this.scratch, {
		pos: new FOAM.Vector(),
		dir: new FOAM.Vector()
	} );

	this.state.active = this.state.STARTING;
};

PAVO.Bot.proto = {

	update: function() {
		var state = this.state;
		switch(state.active) {
		
		case state.STARTING:
			this.start();
			break;
		
		case state.WANDERING:
			this.wander();
			break;
			
		case state.ATTENTION:
			this.attend();
			break;
			
		}
	},
	
	start: function() {
		var state = this.state;
		state.active = state.WANDERING;
		state.wander.target.copy(this.position);
	},
	
	wander: function() {
		var dt = FOAM.interval * 0.001;
		var target = this.state.wander.target;
		var prng = this.prng;

		if (target.distance(this.position) < 1) {
			target.set(prng.get(), prng.get(), prng.get()).norm().mul(25);
			target.add(PAVO.player.position);
		}

		this.pointTo(target);
		this.scratch.dir.copy(this.orientation.front).mul(this.BASE_SPEED * dt);
		this.position.add(this.scratch.dir);
	},
	
	pointTo: function(p) {
		var pos = this.scratch.pos;
		var z;

		//TODO: FIX Z-AXIS INSTABILITY
		// Nothing that relies on this function will work until it's fixed.
		pos.copy(p).sub(this.position).norm();
		z = (pos.z > 0) ? 1 : -1; 
		pos.sub(this.orientation.front);
		this.spin(z * pos.x * this.SPIN_RATE, -pos.y * this.SPIN_RATE);
	},
	
	attend: function() {
		var ps = PAVO.player.position;
		var state = this.state;
		var prng = this.prng;
		if (state.attend.timer <= 0 || ps.distance(state.attend.lastPos) > 0) {
			state.attend.target.set(
				ps.x + 4 * (prng.get() - 0.5),
				ps.y + 4 * (prng.get() - 0.5),
				ps.z + 4 * (prng.get() - 0.5)
			);
			state.attend.timer = 1000 + Math.floor(prng.get() * 2500);
			state.attend.lastPos.copy(ps);
		} else {
			state.attend.timer -= FOAM.interval;
		}

		this.pointTo(state.attend.target);
	}
};

PAVO.makeBot = function() {
	PAVO.Bot.prototype = PAVO.makeMover();
	jQuery.extend(PAVO.Bot.prototype, PAVO.Bot.proto);
	return new PAVO.Bot();
};

