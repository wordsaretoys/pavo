/**

	Bot Object
	
**/

PAVO.Bot = function() {

	var SPIN_RATE = 0.1;
	var NORMAL_SPEED = 10;
	var SPRINT_SPEED = 50;

	var mesh;
	var angl = new FOAM.Vector();
	var prng = new FOAM.Prng();
	var velocity = new FOAM.Vector();
	var color;

	var temp = {
		position: new FOAM.Vector()
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

		mesh.set(nx, ny, pz, 0, 0);
		mesh.set(px, py, pz, 1, 1);
		mesh.set(nx, py, pz, 0, 1);

		mesh.set(nx, ny, pz, 0, 0);
		mesh.set(px, ny, pz, 1, 0);
		mesh.set(px, py, pz, 1, 1);

		mesh.set(nx, ny, nz, 1, 0);
		mesh.set(nx, py, nz, 1, 1);
		mesh.set(px, py, nz, 0, 1);

		mesh.set(nx, ny, nz, 1, 0);
		mesh.set(px, py, nz, 0, 1);
		mesh.set(px, ny, nz, 0, 0);
		
		mesh.build();
		
		angl.set(prng.get() * SPIN_RATE, prng.get() * SPIN_RATE, prng.get() * SPIN_RATE);
		color = prng.get();
		
		this.position.copy(defines.start);
		
		
	};

	this.update = function() {
		var dt = FOAM.interval * 0.001;
		var speed = NORMAL_SPEED;

		this.turn(angl.x, angl.y, angl.z);
/*
		// determine new velocity
		velocity.copy(this.orientation.front).norm().mul(dt * speed);
		temp.position.copy(this.position).add(velocity);

		// test collision
		if (!PAVO.space.testCollision(this.position, temp.position)) {
			this.position.copy(temp.position);
		} else {
			angl.set(prng.get() * SPIN_RATE, prng.get() * SPIN_RATE, prng.get() * SPIN_RATE);
		}		
*/		
	};
	
	this.draw = function(gl, program) {
		var pos = this.position;
		var light = PAVO.space.light;
		gl.uniform3f(program.center, pos.x, pos.y, pos.z);
		gl.uniformMatrix4fv(program.rotations, false, this.matrix.rotations);
		gl.uniform1f(program.color, color);
		gl.uniform1f(program.light, light.gets(pos.x, pos.y, pos.z));
		mesh.draw();
	};
	
};
PAVO.Bot.prototype = new FOAM.Thing();

