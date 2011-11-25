/**

	Debris Object
	Maintains collection of debris.
	
**/

PAVO.debris = new function() {

	var VIEW_RADIUS = 50;
	var FADE_RADIUS =  5;
	var EXAMINE_RADIUS = 5;

	var self = this;
	var pile = [];
	var prng;
	var mesh;

	var scratch = {
		pos: new FOAM.Vector()
	};
	
	var examining = null;
	
	this.init = function() {
		var dl = PAVO.game.debris;
		var gl = PAVO.game.ghosts;
		var i, il, d;
	
		prng = new FOAM.Prng();
		mesh = PAVO.models.createDebrisMesh();

		for (i = 0, il = dl.length; i < il; i++) {
			d = { 
				position: new FOAM.Vector()
			};
			d.position.copy(dl[i].position);
			d.position.y -= 0.5;
			pile.push(d);
		}

		// all ghosts have a pile of debris under them
		for (i = 0, il = gl.length; i < il; i++) {
			d = { 
				position: new FOAM.Vector()
			};
			d.position.copy(gl[i].position);
			d.position.y -= 0.5;
			pile.push(d);
		}
	};
	
	this.update = function() {
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("debris");
		var i, il, p, a, d, t;
		var et = null;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.panels, "debris");
		for (i = 0, il = pile.length; i < il; i++) {
			p = pile[i];
			d = p.position.distance(cam.position);
			if (d <= VIEW_RADIUS) {
			
				if (d <= EXAMINE_RADIUS) {
					scratch.pos.copy(cam.position).sub(p.position).norm();
					t = scratch.pos.dot(cam.orientation.front);
					if (t > 0.95) {
						et = p;
					}
				}
			
				a = (VIEW_RADIUS - d) / FADE_RADIUS;
				gl.uniform3f(program.center, p.position.x, p.position.y, p.position.z);
				gl.uniform1f(program.alpha, a);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);
		
		if (et !== examining) {
			PAVO.hud.promptToExamine(et);
			examining = et;
		}
	};
	
};

