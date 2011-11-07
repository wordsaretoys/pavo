/**

	Bot Object
	
**/

PAVO.Bot = function() {

	var SPIN_RATE = 0.1;
	var NORMAL_SPEED = 10;
	var SPRINT_SPEED = 50;

	var mesh;
	var prng = new FOAM.Prng();
	var goal = new FOAM.Vector();
	var turnX = 0;
	var turnY = 0;
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
		
		mesh.set(px, ny, nz, 1, 0);
		mesh.set(px, py, nz, 1, 1);
		mesh.set(px, py, pz, 0, 1);

		mesh.set(px, ny, nz, 1, 0);
		mesh.set(px, py, pz, 0, 1);
		mesh.set(px, ny, pz, 0, 0);

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

		mesh.set(nx, ny, nz, 1, 0);
		mesh.set(nx, py, nz, 1, 1);
		mesh.set(px, py, nz, 0, 1);

		mesh.set(nx, ny, nz, 1, 0);
		mesh.set(px, py, nz, 0, 1);
		mesh.set(px, ny, nz, 0, 0);
		
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
		var dxn, dxp, dyn, dyp;

		speed = (PAVO.fuckSlow) ? 1 : NORMAL_SPEED;

		dist = this.lookahead();
		if (dist < 128) {
			turnf = ((128 - dist) / 128) / 2;
			temp.rot.copy(this.rotation);
			this.turn(-turnf, 0, 0);
			dxn = this.lookahead();
			this.rotation.copy(temp.rot);
			this.turn(turnf, 0, 0);
			dxp = this.lookahead();
			this.rotation.copy(temp.rot);
			if (dxn > dist) {
				this.turn(-turnf, 0, 0);
			} else if (dxp > dist) {
				this.turn(turnf, 0, 0);
			} else {

				temp.rot.copy(this.rotation);
				this.turn(0, -turnf, 0);
				dyn = this.lookahead();
				this.rotation.copy(temp.rot);
				this.turn(0, turnf, 0);
				dyp = this.lookahead();
				this.rotation.copy(temp.rot);
				if (dyn > dist) {
					this.turn(0, -turnf, 0);
				} else if (dyp > dist) {
					this.turn(0, turnf, 0);
				} else {
				
					// punt
				}
			}
		}
				
		movef = dist / 128;
		temp.dir.copy(this.orientation.front).mul(speed * movef * dt);
		this.position.add(temp.dir);

		PAVO.hud.setDebug(dist);
		
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

