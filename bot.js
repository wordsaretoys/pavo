/**

	Bot Object
	
**/

PAVO.Bot = function() {

	var SPIN_RATE = 0.1;
	var NORMAL_SPEED = 10;
	var SPRINT_SPEED = 50;
	var PIDIV2 = Math.PI * 0.5;

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
		var nx = ny = nz = -0.5;
		var px = py = pz =  0.5;
		var program = FOAM.shaders.get("bot");
		
		mesh = new FOAM.Mesh();
		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);
		
		mesh.set(px, ny, nz, 4, 3);
		mesh.set(px, py, nz, 4, 4);
		mesh.set(px, py, pz, 3, 4);

		mesh.set(px, ny, nz, 4, 3);
		mesh.set(px, py, pz, 3, 4);
		mesh.set(px, ny, pz, 3, 3);

		mesh.set(nx, ny, nz, 0, 0);
		mesh.set(nx, py, pz, 1, 1);
		mesh.set(nx, py, nz, 0, 1);

		mesh.set(nx, ny, nz, 0, 0);
		mesh.set(nx, ny, pz, 1, 0);
		mesh.set(nx, py, pz, 1, 1);

		mesh.set(nx, py, nz, 1, 0);
		mesh.set(nx, py, pz, 1, 1);
		mesh.set(px, py, nz, 0, 0);

		mesh.set(nx, py, pz, 1, 1);
		mesh.set(px, py, pz, 0, 1);
		mesh.set(px, py, nz, 0, 0);

		mesh.set(nx, ny, nz, 1, 1);
		mesh.set(px, ny, nz, 0, 1);
		mesh.set(nx, ny, pz, 1, 0);

		mesh.set(nx, ny, pz, 1, 0);
		mesh.set(px, ny, nz, 0, 1);
		mesh.set(px, ny, pz, 0, 0);

		mesh.set(nx, ny, pz, 1, 1);
		mesh.set(px, py, pz, 2, 2);
		mesh.set(nx, py, pz, 1, 2);

		mesh.set(nx, ny, pz, 1, 1);
		mesh.set(px, ny, pz, 2, 1);
		mesh.set(px, py, pz, 2, 2);

		mesh.set(nx, ny, nz, 3, 2);
		mesh.set(nx, py, nz, 3, 3);
		mesh.set(px, py, nz, 2, 3);

		mesh.set(nx, ny, nz, 3, 2);
		mesh.set(px, py, nz, 2, 3);
		mesh.set(px, ny, nz, 2, 2);
		
		mesh.build();
		
		this.position.copy(defines.start);
		color = defines.color;

		do {		
			goal.set(prng.get() * 256, prng.get() * 256, prng.get() * 256);
		} while (!PAVO.space.inside(goal.x, goal.y, goal.z));
		
		this.turn(0, 0, 0);
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
		var dt = FOAM.interval * 0.001;
		var speed = NORMAL_SPEED;
		var dist, turnf, movef;

		speed = (PAVO.fuckSlow) ? 1 : NORMAL_SPEED;

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
		temp.dir.copy(this.orientation.front).mul(speed * movef * dt);
		this.position.add(temp.dir);

//		PAVO.hud.setDebug(turnAxis + "<br>" + turnSum);
		
	};
	
	this.draw = function(gl, program) {
		var pos = this.position;
		var light = PAVO.space.light;
		gl.uniform3f(program.center, pos.x, pos.y, pos.z);
		gl.uniformMatrix4fv(program.rotations, false, this.matrix.transpose);
		gl.uniform1f(program.color, color);
		gl.uniform1f(program.light, light.gets(pos.x, pos.y, pos.z));
		mesh.draw();
	};
	
};
PAVO.Bot.prototype = new FOAM.Thing();

