/**

	World Object
	Maintains all actor, space, and narrative objects,
	handling all interactions among them.

**/

PAVO.world = new function() {

	var self = this;
	var bot = [];

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
		var prng = new FOAM.Prng();
		var i;
	
		this.createPalette();
	
		PAVO.space.init();
		PAVO.player.init();
		
		for (i = 0; i < 1000; i++) {
			PAVO.Bot.prototype = new FOAM.Thing();
			bot[i] = new PAVO.Bot();
			bot[i].init();
			bot[i].position.set(256 * prng.get(), 256 * prng.get(), 256 * prng.get());
		}
		
		PAVO.space.generate();
		PAVO.player.position.copy(PAVO.defines.space.start);
	};
	
	this.update = function() {
		var i, il;
		PAVO.player.update();
		for (i = 0, il = bot.length; i < il; i++) {
			bot[i].update();
		}
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = FOAM.camera;
		var program;
		var i, il;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
		PAVO.space.draw();

		program = FOAM.shaders.activate("bot");
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.palette, "block-palette");
		FOAM.textures.bind(1, program.panels, "bots");
		for (i = 0, il = bot.length; i < il; i++) {
			bot[i].draw(gl, program);
		}
		gl.disable(gl.CULL_FACE);
	};
};
