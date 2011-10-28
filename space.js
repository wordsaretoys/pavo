/**

	Space Object
	Generates the map and mesh for the current space.
	Assists in collision detection.
	
**/

PAVO.space = new function() {

	var THRESHOLD = 0.5;
	var RESOLUTION = 8;
	var LENGTH = 256;
	var SOURCE = LENGTH / RESOLUTION;

	var self = this;
	var mesh;
	
	var field;
	var color;
	var light;
	
	var temp = {
		pos0: new FOAM.Vector(),
		pos1: new FOAM.Vector()
	};
	
	this.init = function() {
		// create color palette and decals
		PAVO.decals.createPalette("block-palette");
		PAVO.decals.createWallPanels("block-panels");
	};

	this.inside = function(x, y, z) {
		var ll = RESOLUTION;
		var ul = LENGTH - RESOLUTION;
		x = Math.floor(x / RESOLUTION) * RESOLUTION;
		y = Math.floor(y / RESOLUTION) * RESOLUTION;
		z = Math.floor(z / RESOLUTION) * RESOLUTION;
		if (x < ll || y < ll || z < ll || x > ul || y > ul || z > ul)
			return false;
		return field.get(x, y, z) > THRESHOLD;
	};
	
	this.generate = function(defines) {
		var nx, px, ny, py, nz, pz;
		var x, y, z, o, p, c, l;

		field = new FOAM.Noise3D(defines.field.seed, 1.0, SOURCE, defines.field.scale);
		color = new FOAM.Noise3D(defines.color.seed, 1.0, SOURCE, defines.color.scale);
		light = new FOAM.Noise3D(defines.light.seed, 1.0, SOURCE, defines.light.scale);

		light.gets = function(x, y, z) {
			return Math.pow(light.get(x, y, z), defines.light.power) + defines.light.base;
		};

		mesh = new FOAM.Mesh();
		mesh.add(mesh.POSITION, 3);
		mesh.TEXTURE = 1;
		mesh.add(mesh.TEXTURE, 2);
		mesh.COLOR = 2;
		mesh.add(mesh.COLOR, 1);
		mesh.LIGHT = 3;
		mesh.add(mesh.LIGHT, 1);

		for (x = 0; x <= LENGTH; x += RESOLUTION) {
			nx = x;
			px = x + RESOLUTION;
			for (y = 0; y <= LENGTH; y += RESOLUTION) {
				ny = y;
				py = y + RESOLUTION;
				for (z = 0; z <= LENGTH; z += RESOLUTION) {
					nz = z;
					pz = z + RESOLUTION;
					
					o = this.inside(x, y, z);
					p = this.inside(x + RESOLUTION, y, z);
					if ( !o && p ) {
						c = color.get(x, y, z);
						mesh.set(px, ny, nz, 1, 0, c, light.gets(px, ny, nz));
						mesh.set(px, py, nz, 1, 1, c, light.gets(px, py, nz));
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz));
				
						mesh.set(px, ny, nz, 1, 0, c, light.gets(px, ny, nz));
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz));
						mesh.set(px, ny, pz, 0, 0, c, light.gets(px, ny, pz));
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						mesh.set(px, ny, nz, 1, 0, c, light.gets(px, ny, nz));
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz));
						mesh.set(px, py, nz, 1, 1, c, light.gets(px, py, nz));
				
						mesh.set(px, ny, nz, 1, 0, c, light.gets(px, ny, nz));
						mesh.set(px, ny, pz, 0, 0, c, light.gets(px, ny, pz));
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz));
					}
					
					p = this.inside(x, y + RESOLUTION, z);
					if ( !o && p ) {
						c = color.get(x, y, z);
						mesh.set(nx, py, nz, 0, 0, c, light.gets(nx, py, nz));
						mesh.set(nx, py, pz, 0, 1, c, light.gets(nx, py, pz));
						mesh.set(px, py, nz, 1, 0, c, light.gets(px, py, nz));
				
						mesh.set(nx, py, pz, 0, 1, c, light.gets(nx, py, pz));
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz));
						mesh.set(px, py, nz, 1, 0, c, light.gets(px, py, nz));
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						mesh.set(nx, py, nz, 0, 0, c, light.gets(nx, py, nz));
						mesh.set(px, py, nz, 1, 0, c, light.gets(px, py, nz));
						mesh.set(nx, py, pz, 0, 1, c, light.gets(nx, py, pz));
				
						mesh.set(nx, py, pz, 0, 1, c, light.gets(nx, py, pz));
						mesh.set(px, py, nz, 1, 0, c, light.gets(px, py, nz));
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz));
					}
					
					p = this.inside(x, y, z + RESOLUTION);
					if ( !o && p ) {
						c = color.get(x, y, z);
						mesh.set(nx, ny, pz, 0, 0, c, light.gets(nx, ny, pz));
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz));
						mesh.set(nx, py, pz, 0, 1, c, light.gets(nx, py, pz));

						mesh.set(nx, ny, pz, 0, 0, c, light.gets(nx, ny, pz));
						mesh.set(px, ny, pz, 1, 0, c, light.gets(px, ny, pz));
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz));
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						mesh.set(nx, ny, pz, 0, 0, c, light.gets(nx, ny, pz));
						mesh.set(nx, py, pz, 0, 1, c, light.gets(nx, py, pz));
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz));

						mesh.set(nx, ny, pz, 0, 0, c, light.gets(nx, ny, pz));
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz));
						mesh.set(px, ny, pz, 1, 0, c, light.gets(px, ny, pz));
					}
				}
			}
		}
		mesh.build();
	};

	this.testCollision = function(p, v) {
		var nx = (v.x > 0) ? 1 : -1;
		var ny = (v.y > 0) ? 1 : -1;
		var nz = (v.z > 0) ? 1 : -1;
		return this.inside(p.x, p.y, p.z) != 
			this.inside(p.x + v.x + nx, p.y + v.y + ny, p.z + v.z + nz);
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = FOAM.camera;
		var pos = cam.position;
		var program;
	
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		program = FOAM.shaders.activate("block");
		
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.palette, "block-palette");
		FOAM.textures.bind(1, program.panels, "block-panels");
		mesh.draw();

		gl.disable(gl.CULL_FACE);
	};

};
