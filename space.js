/**

	Space Object
	Generates the map and mesh for the current space.
	Assists in collision detection.
	
**/

PAVO.space = new function() {

	var THRESHOLD = 0.5;
	var RESOLUTION = 8;
	var HALF_RES = RESOLUTION / 2;
	var LENGTH = new FOAM.Vector();
	var SOURCE = new FOAM.Vector();
	var LLIMIT = new FOAM.Vector();
	var ULIMIT = new FOAM.Vector();

	var self = this;
	var mesh;
	
	var field;
	var color;
	var light;
	var panel;
	
	var temp = {
		pos0: new FOAM.Vector(),
		pos1: new FOAM.Vector(),
		norm: new FOAM.Vector(),
		vel0: new FOAM.Vector()
	};
	
	this.init = function() {
		var gspace = PAVO.game.space;

		LENGTH.copy(gspace.size);
		SOURCE.copy(LENGTH).div(RESOLUTION);
		LLIMIT.set(RESOLUTION, RESOLUTION, RESOLUTION);
		ULIMIT.copy(LENGTH).sub(LLIMIT);
		LLIMIT.set();	// reset floor to zero

		field = new FOAM.Noise3D(gspace.field.seed, 1.0, SOURCE.x, gspace.field.scale.x, 
			SOURCE.y, gspace.field.scale.y, SOURCE.z, gspace.field.scale.z);
		color = new FOAM.Noise3D(gspace.color.seed, 1.0, SOURCE.x, gspace.color.scale.x, 
			SOURCE.y, gspace.color.scale.y, SOURCE.z, gspace.color.scale.z);
		light = new FOAM.Noise3D(gspace.light.seed, 1.0, SOURCE.x, gspace.light.scale.x, 
			SOURCE.y, gspace.light.scale.y, SOURCE.z, gspace.light.scale.z);
		panel = new FOAM.Prng(gspace.panel.seed);

		this.field = field;
		this.light = light;

		light.gets = function(x, y, z) {
			return Math.pow(light.get(x, y, z), gspace.light.power) + gspace.light.base;
		};
		panel.gets = function() {
			var p = panel.get();
			if (p > 0.03)
				return 0;
			else
				return Math.floor(7 * panel.get()) + 1;
		};
	};

	this.pinside = function(p) {
		if (p.x < LLIMIT.x || p.y < LLIMIT.y || p.z < LLIMIT.z || 
			p.x > ULIMIT.x || p.y > ULIMIT.y || p.z > ULIMIT.z)
			return false;
		return field.get(p.x + HALF_RES, p.y + HALF_RES, p.z + HALF_RES) > THRESHOLD;
	}
	
	this.inside = function(x, y, z) {
		temp.pos0.set(x, y, z).dejitter(RESOLUTION, Math.floor);
		return this.pinside(temp.pos0);
	};
	
	this.generate = function() {
		var nx, px, ny, py, nz, pz;
		var x, y, z, o, p, c, l, w;
		var program;
		
		program = FOAM.shaders.get("block");
		mesh = new FOAM.Mesh();
		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);
		mesh.add(program.a_color, 1);
		mesh.add(program.a_light, 1);
		mesh.add(program.a_panel, 1);

		for (x = -RESOLUTION; x <= LENGTH.x; x += RESOLUTION) {
			nx = x;
			px = x + RESOLUTION;
			for (y = -RESOLUTION; y <= LENGTH.y; y += RESOLUTION) {
				ny = y;
				py = y + RESOLUTION;
				for (z = -RESOLUTION; z <= LENGTH.z; z += RESOLUTION) {
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
	
	this.collision = function(p, v) {
		var surf;
		
		temp.pos1.copy(p).dejitter(RESOLUTION, Math.floor).x -= RESOLUTION;
		surf = temp.pos1.x + RESOLUTION + 2;
		if (!this.pinside(temp.pos1) && p.x <= surf) {
			p.x = surf;
			v.x = v.x > 0 ? v.x : 0;
		}
		temp.pos1.copy(p).dejitter(RESOLUTION, Math.floor).x += RESOLUTION;
		surf = temp.pos1.x - 2;
		if (!this.pinside(temp.pos1) && p.x >= surf) {
			p.x = surf;
			v.x = v.x < 0 ? v.x : 0;
		}

		temp.pos1.copy(p).dejitter(RESOLUTION, Math.floor).y -= RESOLUTION;
		surf = temp.pos1.y + RESOLUTION + 2;
		if (!this.pinside(temp.pos1) && p.y <= surf) {
			p.y = surf;
			v.y = v.y > 0 ? v.y : 0;
		}
		temp.pos1.copy(p).dejitter(RESOLUTION, Math.floor).y += RESOLUTION;
		surf = temp.pos1.y - 2;
		if (!this.pinside(temp.pos1) && p.y >= surf) {
			p.y = surf;
			v.y = v.y < 0 ? v.y : 0;
		}
		
		temp.pos1.copy(p).dejitter(RESOLUTION, Math.floor).z -= RESOLUTION;
		surf = temp.pos1.z + RESOLUTION + 2;
		if (!this.pinside(temp.pos1) && p.z <= surf) {
			p.z = surf;
			v.z = v.z > 0 ? v.z : 0;
		}
		temp.pos1.copy(p).dejitter(RESOLUTION, Math.floor).z += RESOLUTION;
		surf = temp.pos1.z - 2;
		if (!this.pinside(temp.pos1) && p.z >= surf) {
			p.z = surf;
			v.z = v.z < 0 ? v.z : 0;
		}
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player.camera;
		var program;
	
		program = FOAM.shaders.activate("block");
		
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.palette, "block-palette");
		FOAM.textures.bind(1, program.panels, "walls");
		mesh.draw();
	};

	this.findFreeSpace = function(prng, p) {
		do {		
			p.set(prng.get() * LENGTH.x, prng.get() * LENGTH.y, prng.get() * LENGTH.z);
		} while (!this.pinside(p));
	};
	
	this.checkFloorSpace = function(p) {
		var above, below;
		p.dejitter(RESOLUTION, Math.floor);
		above = this.pinside(p);
		while (p.y >= LLIMIT.y) {
			p.y -= RESOLUTION;
			below = this.pinside(p);
			if (above && !below) {
				p.y += RESOLUTION;
				p.x += HALF_RES;
				p.z += HALF_RES;
				return true;
			}
			above = below;
		}
		return false;
	}

};
