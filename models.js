/**

	Models Object
	
**/

PAVO.models = new function() {

	this.createGhostMesh = function() {
		var nx = ny = nz = -0.5;
		var px = py = pz =  0.5;
		var program = FOAM.shaders.get("ghost");
		var mesh = new FOAM.Mesh();

		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);
		
		mesh.set(px, ny, nz, 2, 1);
		mesh.set(px, py, nz, 2, 2);
		mesh.set(px, py, pz, 1, 2);

		mesh.set(px, ny, nz, 2, 1);
		mesh.set(px, py, pz, 1, 2);
		mesh.set(px, ny, pz, 1, 1);

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

		mesh.set(nx, ny, pz, 3, 3);
		mesh.set(px, py, pz, 4, 4);
		mesh.set(nx, py, pz, 3, 4);

		mesh.set(nx, ny, pz, 3, 3);
		mesh.set(px, ny, pz, 4, 3);
		mesh.set(px, py, pz, 4, 4);

		mesh.set(nx, ny, nz, 3, 2);
		mesh.set(nx, py, nz, 3, 3);
		mesh.set(px, py, nz, 2, 3);

		mesh.set(nx, ny, nz, 3, 2);
		mesh.set(px, py, nz, 2, 3);
		mesh.set(px, ny, nz, 2, 2);
		
		mesh.build();
		
		return mesh;
	
	};
	
	this.createDebrisMesh = function() {
		var step = 0.05;
		var x0 = z0 = -2.0;
		var z1 = x1 =  2.0;
		var dl = 4;
		var x, xs, y, ys, z;
		var rx, rxs, rz;
		
		var program = FOAM.shaders.get("debris");
		var mesh = new FOAM.Mesh(gl.TRIANGLE_STRIP);
		var shape = new FOAM.Vector();

		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);

		for (x = x0; x <= x1; x += step) {
			xs = x + step;
			rx = (x - x0) / dl;
			rxs = (xs - x0) / dl;
			for (z = z0; z <= z1; z += step) {
				rz = (z - z0) / dl;
				shape.set(xs, 1, z).norm();
				mesh.set(xs, shape.y, z, rxs, rz);
				shape.set(x, 1, z).norm();
				mesh.set(x, shape.y, z, rx, rz);
			}
		}
		mesh.build();
		
		return mesh;
	};
	
	this.createSignMesh = function() {
		var nx = ny = -4.0;
		var px = py =  4.0;
		var z = 0;
		var program = FOAM.shaders.get("signs");
		var mesh = new FOAM.Mesh();

		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);
	
		mesh.set(nx, ny, z, 0, 0);
		mesh.set(px, py, z, 1, 1);
		mesh.set(nx, py, z, 0, 1);

		mesh.set(nx, ny, z, 0, 0);
		mesh.set(px, ny, z, 1, 0);
		mesh.set(px, py, z, 1, 1);
		
		mesh.build();
		
		return mesh;
	};
};
