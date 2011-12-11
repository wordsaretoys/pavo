/**

	Consoles Object
	Maintains collection of consoles.
	
**/

PAVO.consoles = new function() {

	var VIEW_RADIUS = 100;
	var FADE_RADIUS = 5;
	var TALK_RADIUS = 5;

	var self = this;
	var list = [];
	var mesh;

	var scratch = {
		pos: new FOAM.Vector()
	};

	this.listening = null;
	
	this.init = function() {
		var cs = PAVO.game.consoles;
		var i, il, c;
		mesh = PAVO.models.createConsoleMesh();
		for (i = 0, il = cs.length; i < il; i++) {
			c = new FOAM.Thing();
			c.position.copy(cs[i].position);
			c.position.y += 1;
			c.turn(0, 0, 0);
			list.push(c);
		}
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("console");
		var i, il, c, a, d, t;
		var lt = null;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.panels, "console");
		for (i = 0, il = list.length; i < il; i++) {
			c = list[i];
			d = c.position.distance(cam.position);
			if (d <= VIEW_RADIUS) {
			
				if (d <= TALK_RADIUS) {
					scratch.pos.copy(cam.position).sub(c.position).norm();
					t = scratch.pos.dot(cam.orientation.front);
					if (t > 0.95) {
						lt = c;
					}
				}
			
				a = Math.clamp((VIEW_RADIUS - d) / FADE_RADIUS, 0, 1);
				gl.uniform3f(program.center, c.position.x, c.position.y, c.position.z);
				gl.uniform1f(program.alpha, a);
				gl.uniformMatrix4fv(program.rotations, false, c.matrix.transpose);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);

		if (lt !== this.listening) {
			PAVO.hud.promptToUse(lt);
			this.listening = lt;
		}
	};
	
};

