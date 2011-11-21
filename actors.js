/**

	Actors Object
	Maintains collection of actor objects.
	
**/

PAVO.actors = new function() {

	var ENCOUNTER_RADIUS = 75;
	var VIEW_RADIUS = 50;
	var ENCOUNTER_BASE = 1;
	var MAX_BOTS = 1;

	var self = this;
	var bot  = [];
	var prng;
	var mesh;

	var temp = {
		pos: new FOAM.Vector()
	};

	this.init = function() {
		prng = new FOAM.Prng();
		mesh = PAVO.models.createBotMesh();
	};
	
	this.makeBot = function() {
		var b = PAVO.makeMover();
		var i = 100;
		b.spin(0, 0);	// generates orientation matrix
		b.position.set(prng.get(), prng.get(), prng.get()).norm().mul(ENCOUNTER_RADIUS - 1);
		b.position.add(PAVO.player.position);
		b.mood = Math.floor(3 * prng.get());
		bot.push(b);
	}
	
	this.update = function() {
		var cutoff = ENCOUNTER_BASE * Math.pow( (MAX_BOTS - bot.length) / MAX_BOTS, 2 );
		var p = PAVO.player.position;
		var i;
		
		if (prng.get() < cutoff) {
			this.makeBot();
		}
		
		for (i = bot.length - 1; i >= 0; i--) {
		
			temp.pos.copy(p).sub(bot[i].position).norm();
			temp.pos.cross(bot[i].orientation.front);
//			bot[i].spin(0, -temp.pos.y * 0.1);
		
			if (p.distance(bot[i].position) > ENCOUNTER_RADIUS) {
				bot.splice(i, 1);
			}
		}
	};

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("bot");
		var i, il, p, b, a, d;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		for (i = 0, il = bot.length; i < il; i++) {
			b = bot[i];
			p = b.position;
			d = p.distance(PAVO.player.position);
			a = 0.75 * (VIEW_RADIUS - d) / VIEW_RADIUS;
			a = a > 0 ? a : 0;

			switch (b.mood) {
			case 0: 
				FOAM.textures.bind(0, program.panels, "angrybot");
				break;
			case 1: 
				FOAM.textures.bind(0, program.panels, "ennuibot");
				break;
			case 2: 
				FOAM.textures.bind(0, program.panels, "happybot");
				break;
			}
			gl.uniform3f(program.center, p.x, p.y, p.z);
			gl.uniform1f(program.alpha, 1);
			gl.uniformMatrix4fv(program.rotations, false, b.matrix.transpose);
			mesh.draw();
		}

		gl.disable(gl.BLEND);
	};
	
};

