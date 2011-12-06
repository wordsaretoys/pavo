/**

	Debris Object
	Maintains collection of debris.
	
**/

PAVO.debris = new function() {

	var DEBRIS_HEIGHT = 0.01;

	var self = this;
	var mesh;
	var noise;

	var scratch = {
		pos0: new FOAM.Vector(),
		pos1: new FOAM.Vector(),
		diff: new FOAM.Vector()
	};
	
	this.init = function() {
		var program = FOAM.shaders.get("debris");
		var dl = PAVO.game.debris;
		var gl = PAVO.game.ghosts;
		var i, il;
	
		function addArea(p0, p1) {
			mesh.set(p0.x, DEBRIS_HEIGHT, p0.z, 1, 0);
			mesh.set(p0.x, DEBRIS_HEIGHT, p1.z, 1, 1);
			mesh.set(p1.x, DEBRIS_HEIGHT, p0.z, 0, 0);

			mesh.set(p0.x, DEBRIS_HEIGHT, p1.z, 1, 1);
			mesh.set(p1.x, DEBRIS_HEIGHT, p1.z, 0, 1);
			mesh.set(p1.x, DEBRIS_HEIGHT, p0.z, 0, 0);
		};

		mesh = new FOAM.Mesh();
		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);

		for (i = 0, il = dl.length; i < il; i++) {
			scratch.pos0.copy(dl[i].p0);
			scratch.pos1.copy(dl[i].p1);
			addArea(scratch.pos0, scratch.pos1);
		}

		// all ghosts have a pile of debris under them
		scratch.diff.set(2, 0, 2);
		for (i = 0, il = gl.length; i < il; i++) {
			scratch.pos0.copy(gl[i].position).sub(scratch.diff);
			scratch.pos1.copy(gl[i].position).add(scratch.diff);
			addArea(scratch.pos0, scratch.pos1);
		}
		
		mesh.build();
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("debris");
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.noise, "noise");
		mesh.draw();
		gl.disable(gl.BLEND);
	};

};

