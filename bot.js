/**

	Bot Object
	
**/

PAVO.Bot = function() {

	var mesh;
	var angl = new FOAM.Vector();
	var prng = new FOAM.Prng();
	var color;

	this.init = function() {
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
		
		angl.set(prng.get() * 0.01, prng.get() * 0.01, prng.get() * 0.01);
		color = prng.get();
	};

	this.update = function() {
		this.turn(angl.x, angl.y, angl.z);
		this.position.x = (this.position.x < 258) ? this.position.x + 0.1 : 0;
		
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

