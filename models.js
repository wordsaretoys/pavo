/**
	generate reusable game models
	
	@namespace PAVO
	@class models
**/

PAVO.models = new function() {

	/**
		create a mesh representing a ghost NPC

		requires ghost shader to have been compiled
		
		@method createGhostMesh
		@return the mesh object
	**/

	this.createGhostMesh = function() {
		var nx = -0.5, ny = -0.5, nz = -0.5;
		var px = 0.5, py = 0.5, pz = 0.5;
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
	
	/**
		create a mesh representing a panel object

		requires panel shader to have been compiled
		
		@method createPanelMesh
		@return the mesh object
	**/

	this.createPanelMesh = function() {
		var nx = -1, ny = -1, nz = -1;
		var px = 1, py = 1, pz = 1;
		var hy = 0;
		var program = FOAM.shaders.get("panel");
		var mesh = new FOAM.Mesh();

		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);
		
		mesh.set(px, ny, nz, 2, 1);
		mesh.set(px, py, nz, 2, 2);
		mesh.set(px, hy, pz, 1, 1.5);

		mesh.set(px, ny, nz, 2, 1);
		mesh.set(px, hy, pz, 1, 1.5);
		mesh.set(px, ny, pz, 1, 1);

		mesh.set(nx, ny, nz, 2, 2);
		mesh.set(nx, hy, pz, 3, 2.5);
		mesh.set(nx, py, nz, 2, 3);

		mesh.set(nx, ny, nz, 2, 2);
		mesh.set(nx, ny, pz, 3, 2);
		mesh.set(nx, hy, pz, 3, 2.5);

		// negative texture coordinates
		// a hack to indicate top panel
		mesh.set(nx, py, nz, -4, -3);
		mesh.set(nx, hy, pz, -4, -4);
		mesh.set(px, py, nz, -3, -3);

		mesh.set(nx, hy, pz, -4, -4);
		mesh.set(px, hy, pz, -3, -4);
		mesh.set(px, py, nz, -3, -3);

		mesh.set(nx, ny, nz, 1, 1);
		mesh.set(px, ny, nz, 0, 1);
		mesh.set(nx, ny, pz, 1, 0);

		mesh.set(nx, ny, pz, 1, 0);
		mesh.set(px, ny, nz, 0, 1);
		mesh.set(px, ny, pz, 0, 0);

		mesh.set(nx, ny, pz, 0, 0);
		mesh.set(px, hy, pz, 1, 0.5);
		mesh.set(nx, hy, pz, 0, 0.5);

		mesh.set(nx, ny, pz, 0, 0);
		mesh.set(px, ny, pz, 1, 0);
		mesh.set(px, hy, pz, 1, 0.5);

		mesh.set(nx, ny, nz, 1, 0);
		mesh.set(nx, py, nz, 1, 1);
		mesh.set(px, py, nz, 0, 1);

		mesh.set(nx, ny, nz, 1, 0);
		mesh.set(px, py, nz, 0, 1);
		mesh.set(px, ny, nz, 0, 0);
		
		mesh.build();
		
		return mesh;
	
	};
};
