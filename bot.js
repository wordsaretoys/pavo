/**

	Bot Object
	
**/

PAVO.Bot = function() {

	var SPIN_RATE = 0.1;
	var BASE_SPEED = 10;
	var PITCH_LIMIT = Math.cos(Math.PI / 12);

	var state = {
		WANDERING: 0,
		ATTENTION: 1,
		
		active: -1,
		
		wander: {
			x: 0,
			y: 0,
			last: 0
		},
		
		attend: {
			timer: 0,
			target: new FOAM.Vector(),
			lastPos: new FOAM.Vector()
		}
	};

	var self = this;

	var pitch = new FOAM.Thing();
	var prng = new FOAM.Prng();
	var mesh;
	var color;

	var temp = {
		pos: new FOAM.Vector(),
		dir: new FOAM.Vector(),
		rot: new FOAM.Quaternion()
	};

	this.init = function(defines) {
		
		this.position.copy(defines.start);
		color = defines.color;

		this.turn(0, 0, 0);
		state.active = state.WANDERING;

		//
		// TODO: REMOVE AFTER TESTING COMPLETE		
		//
		window.addEventListener("keydown", function(e) {
			if (e.keyCode === FOAM.KEY.M)
				BASE_SPEED = (BASE_SPEED === 10) ? 1 : 10;
		});

		pitch.orientation.right.w = 0;
		pitch.orientation.up.w = 0;
		pitch.orientation.front.w = 0;
	};

	this.lookahead = function() {
		var d = 1;
		do {
			temp.pos.copy(this.orientation.front).mul(d).add(this.position);
			d = d * 2;
		} while (d <= 64 && PAVO.space.inside(temp.pos.x, temp.pos.y, temp.pos.z));
		return d;
	}

	this.spin = function(dx, dy) {
		temp.rot.copy(pitch.rotation);
		pitch.turn(dy, 0, 0);
		if (pitch.rotation.w < PITCH_LIMIT) {
			pitch.rotation.copy(temp.rot);
			pitch.turn(0, 0, 0);
		}
		this.unitquat.x.copy(pitch.orientation.right);
		this.unitquat.y.copy(pitch.orientation.up);
		this.unitquat.z.copy(pitch.orientation.front);
		this.turn(0, dx, 0);
	};

	this.update = function() {
	
		switch(state.active) {
		
		case state.WANDERING:
			this.wander();
			if (this.position.distance(PAVO.player.position) < 10)
				state.active = state.ATTENTION;
			break;
			
		case state.ATTENTION:
			this.attend();
			if (this.position.distance(PAVO.player.position) >= 10)
				state.active = state.WANDERING;
			break;
			
		}
	};

	this.wander = function() {
		var dt = FOAM.interval * 0.001;
		var dist, turnf, movef;

		dist = this.lookahead();
		turnf = ((128 - dist) / 128) * 0.1;
		if (turnf > 0) {
			if (turnf > state.wander.last) {
				state.wander.x = (prng.get() - 0.5) * turnf;
				state.wander.y = (prng.get() - 0.5) * turnf;
			}
			this.spin(state.wander.x, state.wander.y);
		}
		state.wander.last = turnf;

		movef = dist / 128;
		temp.dir.copy(this.orientation.front).mul(BASE_SPEED * movef * dt);
		this.position.add(temp.dir);
	};
	
	this.attend = function() {

		var ps = PAVO.player.position;
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

		temp.dir.copy(state.attend.target).sub(this.position).norm();
		temp.dir.sub(this.orientation.front);
		this.spin(temp.dir.x * 0.1, temp.dir.y * 0.1);

	};
	
	this.draw = function(gl, program) {
		var pos = this.position;
		gl.uniform3f(program.center, pos.x, pos.y, pos.z);
		gl.uniformMatrix4fv(program.rotations, false, this.matrix.transpose);
		PAVO.models.botMesh.draw();
	};
	
};

PAVO.makeBot = function() {
	PAVO.Bot.prototype = new FOAM.Thing();
	return new PAVO.Bot();
};

