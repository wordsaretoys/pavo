/**

	Actors Object
	Maintains collection of actor objects.
	
**/

PAVO.actors = new function() {

	var VIEW_DISTANCE = PAVO.game.bots.viewDistance;

	var self = this;
	var bot  = [];
	var prng;
	var mesh;
	
	this.init = function() {
		var bots = PAVO.game.bots;
		var size = PAVO.game.space.size;
		var i, il, p, s, b;
		prng = new FOAM.Prng(bots.base.seed);
		for (i = 0, il = bots.count; i < il; i++) {
			b = new FOAM.Thing();
			PAVO.space.findFreeSpace(prng, b.position);
			b.size = 0.1 + prng.get() * 4;
			bot.push(b);
		}
		
		// re-randomize prng for driving bot behavior
		prng.reseed();
		
		mesh = PAVO.models.createBotMesh();
	};
	
	this.update = function() {
	};

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player.camera;
		var program = FOAM.shaders.activate("bot");
		var i, il, p, b, a, d;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.panels, "bots");
		for (i = 0, il = bot.length; i < il; i++) {
			b = bot[i];
			p = b.position;
			d = p.distance(PAVO.player.position);
			if (d < VIEW_DISTANCE) {
				a = 0.75 * (VIEW_DISTANCE - d) / VIEW_DISTANCE;
				b.turn(0, 0.1, 0);
				gl.uniform3f(program.center, p.x, p.y, p.z);
				gl.uniform1f(program.size, b.size);
				gl.uniform1f(program.alpha, a);
				gl.uniformMatrix4fv(program.rotations, false, b.matrix.transpose);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);
	};
	
};

