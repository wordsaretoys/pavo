/**

	Models Object
	
**/

PAVO.models = new function() {

	this.createBotMesh = function() {
		var nx = ny = nz = -0.5;
		var px = py = pz =  0.5;
		var program = FOAM.shaders.get("bot");
		var mesh = new FOAM.Mesh();

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
		
		this.botMesh = mesh;
	
	};

};
