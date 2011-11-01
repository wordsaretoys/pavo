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
	var panel;
	
	var temp = {
		pos0: new FOAM.Vector(),
		pos1: new FOAM.Vector()
	};
	
	this.init = function() {
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
	
	this.generate = function() {
		var defines = PAVO.defines.space;
		var nx, px, ny, py, nz, pz;
		var x, y, z, o, p, c, l, w;
		var program;
		

		field = new FOAM.Noise3D(defines.field.seed, 1.0, SOURCE, defines.field.scale);
		color = new FOAM.Noise3D(defines.color.seed, 1.0, SOURCE, defines.color.scale);
		light = new FOAM.Noise3D(defines.light.seed, 1.0, SOURCE, defines.light.scale);
		panel = new FOAM.Prng(defines.panel.seed);

		light.gets = function(x, y, z) {
			return (y / LENGTH) * Math.pow(light.get(x, y, z), defines.light.power);
		};
		panel.gets = function() {
			var p = panel.get();
			if (p > 0.02)
				return 0;
			else
				return Math.floor(7 * panel.get()) + 1;
		};

		program = FOAM.shaders.get("block");
		mesh = new FOAM.Mesh();
		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);
		mesh.add(program.a_color, 1);
		mesh.add(program.a_light, 1);
		mesh.add(program.a_panel, 1);

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
						w = panel.gets();
						mesh.set(px, ny, nz, 1, 0, c, light.gets(px, ny, nz), w);
						mesh.set(px, py, nz, 1, 1, c, light.gets(px, py, nz), w);
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz), w);
				
						mesh.set(px, ny, nz, 1, 0, c, light.gets(px, ny, nz), w);
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz), w);
						mesh.set(px, ny, pz, 0, 0, c, light.gets(px, ny, pz), w);
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						w = panel.gets();
						mesh.set(px, ny, nz, 0, 0, c, light.gets(px, ny, nz), w);
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz), w);
						mesh.set(px, py, nz, 0, 1, c, light.gets(px, py, nz), w);
				
						mesh.set(px, ny, nz, 0, 0, c, light.gets(px, ny, nz), w);
						mesh.set(px, ny, pz, 1, 0, c, light.gets(px, ny, pz), w);
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz), w);
					}
					
					p = this.inside(x, y + RESOLUTION, z);
					if ( !o && p ) {
						c = color.get(x, y, z);
						w = panel.gets();
						mesh.set(nx, py, nz, 1, 0, c, light.gets(nx, py, nz), w);
						mesh.set(nx, py, pz, 1, 1, c, light.gets(nx, py, pz), w);
						mesh.set(px, py, nz, 0, 0, c, light.gets(px, py, nz), w);
				
						mesh.set(nx, py, pz, 1, 1, c, light.gets(nx, py, pz), w);
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz), w);
						mesh.set(px, py, nz, 0, 0, c, light.gets(px, py, nz), w);
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						w = panel.gets();
						mesh.set(nx, py, nz, 1, 1, c, light.gets(nx, py, nz), w);
						mesh.set(px, py, nz, 0, 1, c, light.gets(px, py, nz), w);
						mesh.set(nx, py, pz, 1, 0, c, light.gets(nx, py, pz), w);
				
						mesh.set(nx, py, pz, 1, 0, c, light.gets(nx, py, pz), w);
						mesh.set(px, py, nz, 0, 1, c, light.gets(px, py, nz), w);
						mesh.set(px, py, pz, 0, 0, c, light.gets(px, py, pz), w);
					}
					
					p = this.inside(x, y, z + RESOLUTION);
					if ( !o && p ) {
						c = color.get(x, y, z);
						w = panel.gets();
						mesh.set(nx, ny, pz, 0, 0, c, light.gets(nx, ny, pz), w);
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz), w);
						mesh.set(nx, py, pz, 0, 1, c, light.gets(nx, py, pz), w);

						mesh.set(nx, ny, pz, 0, 0, c, light.gets(nx, ny, pz), w);
						mesh.set(px, ny, pz, 1, 0, c, light.gets(px, ny, pz), w);
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz), w);
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						w = panel.gets();
						mesh.set(nx, ny, pz, 1, 0, c, light.gets(nx, ny, pz), w);
						mesh.set(nx, py, pz, 1, 1, c, light.gets(nx, py, pz), w);
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz), w);

						mesh.set(nx, ny, pz, 1, 0, c, light.gets(nx, ny, pz), w);
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz), w);
						mesh.set(px, ny, pz, 0, 0, c, light.gets(px, ny, pz), w);
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
		FOAM.textures.bind(1, program.panels, "walls");
		mesh.draw();

		gl.disable(gl.CULL_FACE);
	};

};
