/**
	generate the map and mesh for the game space
	provide methods to assist in collision detection
	
	@namespace PAVO
	@class space
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
	var image;
	
	var scratch = {
		pos0: new FOAM.Vector(),
		pos1: new FOAM.Vector(),
		norm: new FOAM.Vector(),
		vel0: new FOAM.Vector()
	};
	
	/**
		generate the 3D noise fields that will shape/color/light the game space
		
		@method init
	**/

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
		image = new FOAM.Prng(gspace.image.seed);

		this.field = field;
		this.light = light;

		// wrapper method for light
		// expresses 1/r^2 intensity relationship
		light.gets = function(x, y, z) {
			return Math.pow(light.get(x, y, z), 2);
		};
		
		// wrapper method for image
		// provides 10% chance of a non-default wall image
		image.gets = function(a, b) {
			var i = image.get();
			if (i > 0.1)
				return 0;
			else
				return Math.floor((b - a) * image.get()) + a;
		};
		
		this.generatePalette();
		
	};

	/**
		generate the color palette for the space
		
		@method generatePalette
	**/

	this.generatePalette = function() {
		var pastels = [
			224, 224, 224, 255,
			224, 224, 255, 255,
			224, 255, 224, 255,
			224, 255, 255, 255,
			255, 224, 224, 255,
			255, 224, 255, 255,
			255, 255, 224, 255,
			255, 255, 255, 255
		];
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var palette = context.createImageData(1, pastels.length / 4);
		var i, il;
		for (i = 0, il = pastels.length; i < il; i++)
			palette.data[i] = pastels[i];
		FOAM.textures.buildFromImageData("block-palette", palette);
	};

	/**
		return whether a point is inside the game space

		@method pinside
		@param p the point to test
		@return true if the point is inside the space
	**/

	this.pinside = function(p) {
		if (p.x < LLIMIT.x || p.y < LLIMIT.y || p.z < LLIMIT.z || 
			p.x > ULIMIT.x || p.y > ULIMIT.y || p.z > ULIMIT.z)
			return false;
		return field.get(p.x + HALF_RES, p.y + HALF_RES, p.z + HALF_RES) > THRESHOLD;
	}
	
	/**
		return whether a block defined by a point is inside the game space
		
		block extends from (x, y, z) to (x + r, y + r, z + r) where r = RESOLUTION

		@method inside
		@param x the x-coordinate of the point to test
		@param y the y-coordinate of the point to test
		@param z the z-coordinate of the point to test
		@return true if the point is inside the space
	**/

	this.inside = function(x, y, z) {
		scratch.pos0.set(x, y, z).dejitter(RESOLUTION, Math.floor);
		return this.pinside(scratch.pos0);
	};
	
	/**
		generates the game space mesh
		
		this is just a simplification of the marching cubes algorithm
		we march through a 3D noise field and generate a polygon when
		we cross the "surface" of the field; that is, when the values
		cross a threshold value

		@method generate
	**/

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
		mesh.add(program.a_image, 1);

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
						w = image.gets(3, 7);
						mesh.set(px, ny, nz, 1, 0, c, light.gets(px, ny, nz), w);
						mesh.set(px, py, nz, 1, 1, c, light.gets(px, py, nz), w);
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz), w);
				
						mesh.set(px, ny, nz, 1, 0, c, light.gets(px, ny, nz), w);
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz), w);
						mesh.set(px, ny, pz, 0, 0, c, light.gets(px, ny, pz), w);
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						w = image.gets(3, 7);
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
						w = 0;	// floor always blank
						mesh.set(nx, py, nz, 1, 0, c, light.gets(nx, py, nz), w);
						mesh.set(nx, py, pz, 1, 1, c, light.gets(nx, py, pz), w);
						mesh.set(px, py, nz, 0, 0, c, light.gets(px, py, nz), w);
				
						mesh.set(nx, py, pz, 1, 1, c, light.gets(nx, py, pz), w);
						mesh.set(px, py, pz, 0, 1, c, light.gets(px, py, pz), w);
						mesh.set(px, py, nz, 0, 0, c, light.gets(px, py, nz), w);
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						w = image.gets(0, 2);
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
						w = image.gets(3, 7);
						mesh.set(nx, ny, pz, 0, 0, c, light.gets(nx, ny, pz), w);
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz), w);
						mesh.set(nx, py, pz, 0, 1, c, light.gets(nx, py, pz), w);

						mesh.set(nx, ny, pz, 0, 0, c, light.gets(nx, ny, pz), w);
						mesh.set(px, ny, pz, 1, 0, c, light.gets(px, ny, pz), w);
						mesh.set(px, py, pz, 1, 1, c, light.gets(px, py, pz), w);
					}
					if ( o && !p ) {
						c = color.get(x, y, z);
						w = image.gets(3, 7);
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
	
	/**
		tests whether a point in motion is about to collide with the game space
		
		note that the call changes the contents of the vectors the caller supplies
		instead of returning a true/false value; it's simpler just to make all the
		changes right where you're doing the detection.

		@method collision
		@param p point to test
		@param v velocity of the point 
	**/

	this.collision = function(p, v) {
		var surf;
		
		scratch.pos1.copy(p).dejitter(RESOLUTION, Math.floor).x -= RESOLUTION;
		surf = scratch.pos1.x + RESOLUTION + 2;
		if (!this.pinside(scratch.pos1) && p.x <= surf) {
			p.x = surf;
			v.x = v.x > 0 ? v.x : 0;
		}
		scratch.pos1.copy(p).dejitter(RESOLUTION, Math.floor).x += RESOLUTION;
		surf = scratch.pos1.x - 2;
		if (!this.pinside(scratch.pos1) && p.x >= surf) {
			p.x = surf;
			v.x = v.x < 0 ? v.x : 0;
		}

		scratch.pos1.copy(p).dejitter(RESOLUTION, Math.floor).y -= RESOLUTION;
		surf = scratch.pos1.y + RESOLUTION + 2;
		if (!this.pinside(scratch.pos1) && p.y <= surf) {
			p.y = surf;
			v.y = v.y > 0 ? v.y : 0;
		}
		scratch.pos1.copy(p).dejitter(RESOLUTION, Math.floor).y += RESOLUTION;
		surf = scratch.pos1.y - 2;
		if (!this.pinside(scratch.pos1) && p.y >= surf) {
			p.y = surf;
			v.y = v.y < 0 ? v.y : 0;
		}
		
		scratch.pos1.copy(p).dejitter(RESOLUTION, Math.floor).z -= RESOLUTION;
		surf = scratch.pos1.z + RESOLUTION + 2;
		if (!this.pinside(scratch.pos1) && p.z <= surf) {
			p.z = surf;
			v.z = v.z > 0 ? v.z : 0;
		}
		scratch.pos1.copy(p).dejitter(RESOLUTION, Math.floor).z += RESOLUTION;
		surf = scratch.pos1.z - 2;
		if (!this.pinside(scratch.pos1) && p.z >= surf) {
			p.z = surf;
			v.z = v.z < 0 ? v.z : 0;
		}
	};
	
	/**
		draw the game space

		@method draw
	**/

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program;
	
		program = FOAM.shaders.activate("block");
		
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.palette, "block-palette");
		FOAM.textures.bind(1, program.images, "walls");
		FOAM.textures.bind(2, program.noise, "noise");
		mesh.draw();
	};

};

