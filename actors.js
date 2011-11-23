t/**

	Actors Object
	Maintains collection of actor objects.
	
**/

PAVO.actors = new function() {

	var DELETE_RADIUS = 75;
	var CREATE_RADIUS = 50;
	var VIEW_RADIUS = 40;
	var MAX_BOTS = 1;

	var self = this;
	var list = [];
	var prng;
	var mesh;

	this.init = function() {
		prng = new FOAM.Prng();
		mesh = PAVO.models.createBotMesh();
	};
	
	this.addBot = function() {
		var bot = PAVO.makeBot();
		bot.spin(0, 0);	// generates orientation matrix
		bot.position.set(prng.get(), prng.get(), prng.get()).norm().mul(CREATE_RADIUS);
		bot.position.add(PAVO.player.position);
		bot.mood = Math.floor(3 * prng.get());
		list.push(bot);
	}
	
	this.update = function() {
		var cutoff = Math.pow( (MAX_BOTS - list.length) / MAX_BOTS, 2 );
		var p = PAVO.player.position;
		var i, bot;
		
		if (prng.get() < cutoff) {
			this.addBot();
		}
		
		for (i = list.length - 1; i >= 0; i--) {
			bot = list[i];
			bot.update();
			
			if (p.distance(bot.position) > DELETE_RADIUS) {
				list.splice(i, 1);
			}
		}
	};

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("bot");
		var i, il, p, bot, a, d;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		for (i = 0, il = list.length; i < il; i++) {
			bot = list[i];
			p = bot.position;
			d = p.distance(PAVO.player.position);
			a = 0.75 * (VIEW_RADIUS - d) / VIEW_RADIUS;
			a = a > 0 ? a : 0;

			switch (bot.mood) {
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
			gl.uniform1f(program.alpha, a);
			gl.uniformMatrix4fv(program.rotations, false, bot.matrix.transpose);
			mesh.draw();
		}

		gl.disable(gl.BLEND);
	};
	
};

