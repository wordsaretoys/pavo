/**

	Signs Object
	Maintains collection of signs.
	
**/

PAVO.signs = new function() {

	var VIEW_RADIUS = 50;
	var FADE_RADIUS =  5;
	var SPIN_RATE = 0.01;

	var self = this;
	var list = [];
	var mesh;

	var scratch = {
		pos: new FOAM.Vector()
	};
	
	this.init = function() {
		var ss = PAVO.game.signs;
		var i, il, s;
		mesh = PAVO.models.createSignMesh();
		for (i = 0, il = ss.length; i < il; i++) {
			s = new FOAM.Thing();
			s.position.copy(ss[i].position);
			s.index = ss[i].index;
			list.push(s);
		}
	};
	
	this.update = function() {
		var ss = PAVO.game.signs;
		var i, il;
		for (i = 0, il = ss.length; i < il; i++) {
			list[i].turn(0, SPIN_RATE, 0);
		}
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("signs");
		var i, il, s, a, d, t;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.panels, "signs");
		for (i = 0, il = list.length; i < il; i++) {
			s = list[i];
			d = s.position.distance(cam.position);
			if (d <= VIEW_RADIUS) {
				a = Math.clamp((VIEW_RADIUS - d) / FADE_RADIUS, 0, 1);
				gl.uniform3f(program.center, s.position.x, s.position.y, s.position.z);
				gl.uniform1f(program.alpha, a);
				gl.uniform1f(program.index, s.index);
				gl.uniformMatrix4fv(program.rotations, false, s.matrix.transpose);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);
	};
	
};

