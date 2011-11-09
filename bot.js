/**

	Bot Object
	
**/

PAVO.Bot = function() {

	var SPIN_RATE = 0.1;
	var BASE_SPEED = 10;
	var PIDIV2 = Math.PI * 0.5;

	var state = {
		WANDERING: 0,
		ATTENTION: 1,
		
		active: -1
	};

	var mesh;
	var prng = new FOAM.Prng();
	var goal = new FOAM.Vector();
	var turnSum = 0;
	var turnAxis = 0;
	var color;

	var temp = {
		pos: new FOAM.Vector(),
		dir: new FOAM.Vector(),
		rot: new FOAM.Quaternion()
	};

	this.init = function(defines) {
		
		this.position.copy(defines.start);
		color = defines.color;

		do {		
			goal.set(prng.get() * 256, prng.get() * 256, prng.get() * 256);
		} while (!PAVO.space.inside(goal.x, goal.y, goal.z));
		
		this.turn(0, 0, 0);
		state.active = state.WANDERING;

		//
		// TODO: REMOVE AFTER TESTING COMPLETE		
		//
		window.addEventListener("keydown", function(e) {
			if (e.keyCode === FOAM.KEY.M)
				BASE_SPEED = (BASE_SPEED === 10) ? 1 : 10;
		});		

	};

	this.lookahead = function() {
		var d = 1;
		do {
			temp.pos.copy(this.orientation.front).mul(d).add(this.position);
			d = d * 2;
		} while (d <= 64 && PAVO.space.inside(temp.pos.x, temp.pos.y, temp.pos.z));
		return d;
	}

	this.update = function() {
	
		switch(state.active) {
		
		case state.WANDERING:
			this.wander();
			break;
			
		case state.ATTENTION:
			this.attend();
			break;
			
		}
	
		// player proximity switches state
		if (this.position.distance(PAVO.player.position) < 10)
			state.active = state.ATTENTION;
		else
			state.active = state.WANDERING;	
		
	};

	this.wander = function() {
		var dt = FOAM.interval * 0.001;
		var dist, turnf, movef;

		dist = this.lookahead();
		turnf = ((128 - dist) / 128) * 0.05;
		if (turnAxis === 0)
			this.turn(turnf, 0, 0);
		else
			this.turn(0, turnf, 0);
		turnSum += turnf;
		if (turnSum > PIDIV2) {
			turnAxis = (turnAxis === 0) ? 1 : 0;
			turnSum = 0;
		}

		movef = dist / 128;
		temp.dir.copy(this.orientation.front).mul(BASE_SPEED * movef * dt);
		this.position.add(temp.dir);

		// adds a little silliness, may remove
		this.turn(0, 0, 0.01);
	};
	
	this.attend = function() {
/*
		temp.dir.copy(this.position).sub(PAVO.player.position).norm();
		temp.dir.add(this.orientation.front);
		this.turn(temp.dir.x, temp.dir.y, 0);
		
		PAVO.hud.setDebug(temp.dir.x + "<br>" + temp.dir.y + "<br>" + temp.dir.z);
*/
		temp.dir.copy(PAVO.player.position).sub(this.position).norm();
		temp.dir.cross(this.orientation.front);
		this.turn(temp.dir.x, temp.dir.y, 0);
			
	};
	
	this.draw = function(gl, program) {
		var pos = this.position;
		var light = PAVO.space.light;
		gl.uniform3f(program.center, pos.x, pos.y, pos.z);
		gl.uniformMatrix4fv(program.rotations, false, this.matrix.transpose);
		gl.uniform1f(program.color, color);
		gl.uniform1f(program.light, light.gets(pos.x, pos.y, pos.z));
		PAVO.models.botMesh.draw();
	};
	
};
PAVO.Bot.prototype = new FOAM.Thing();

