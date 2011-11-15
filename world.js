/**

	World Object
	Maintains all actor, space, and narrative objects,
	handling all interactions among them.

**/

PAVO.world = new function() {

	var self = this;
	var bots = [];

	var nospace = false;
	
	this.createPalette = function() {
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

	this.init = function() {
		var r;
		
		this.createPalette();
	
		PAVO.space.init();
		PAVO.player.init();
		
		PAVO.models.createBotMesh();
		
		var i, bot;
		var prng = new FOAM.Prng();
		for (i = 0; i < 25; i++) {
			PAVO.Bot.prototype = new FOAM.Thing();
			bot = new PAVO.Bot();
			bot.init(PAVO.defines.bots.boz);
			do {		
				bot.position.set(prng.get() * 256, prng.get() * 256, prng.get() * 256);
			} while (!PAVO.space.inside(bot.position.x, bot.position.y, bot.position.z));
			
			bots.push(bot);
		}
		
		
		PAVO.player.position.copy(PAVO.defines.player.position);
//		r = PAVO.defines.player.rotation;
//		PAVO.player.camera.turn(r.x, r.y, r.z);
		
		PAVO.space.generate();

		//
		// TODO: REMOVE AFTER TESTING COMPLETE		
		//
		window.addEventListener("keydown", function(e) {
			if (e.keyCode === FOAM.KEY.N)
				nospace = !nospace;
		});		
	};
	
	this.update = function() {
		PAVO.player.update();
		var i, il;
		for (i = 0, il = bots.length; i < il; i++)
			bots[i].update();
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player.camera;
		var program;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
		if (!nospace)
			PAVO.space.draw();

		program = FOAM.shaders.activate("bot");
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(1, program.panels, "bots");
		var i, il;
		for (i = 0, il = bots.length; i < il; i++)
			bots[i].draw(gl, program);
		gl.disable(gl.CULL_FACE);
	};
};
