/**

	World Object
	Maintains all actor, space, and narrative objects.

**/

PAVO.world = new function() {

	var NOISE_SIZE = 64;

	var self = this;
	var nospace = false;
	
	this.generateTextures = function() {
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

		var noise = context.createImageData(NOISE_SIZE, NOISE_SIZE);
		var prng = new FOAM.Prng();
		
		var i, il;
		
		for (i = 0, il = pastels.length; i < il; i++)
			palette.data[i] = pastels[i];
		FOAM.textures.buildFromImageData("block-palette", palette);
		
		for (i = 0, il = 4 * NOISE_SIZE * NOISE_SIZE; i < il; i++) {
			noise.data[i] = 256 * (prng.get() + prng.get() + prng.get() + prng.get()) / 4;
		}
		FOAM.textures.buildFromImageData("noise", noise);
	};

	this.init = function() {
		var r;
		
		this.generateTextures();
	
		PAVO.space.init();
		PAVO.player.init();
		PAVO.debris.init();
		PAVO.ghosts.init();
		PAVO.signs.init();
		PAVO.dialogue.init();
		
		PAVO.player.position.copy(PAVO.game.player.position);
		PAVO.player.position.copy(PAVO.game.player.position);
		PAVO.player.turn(0, 7 * Math.PI / 6, 0);
		
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
		PAVO.ghosts.update();
		PAVO.signs.update();
		PAVO.player.update();
		PAVO.hud.update();
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player.camera;
		var program;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		if (!nospace)
			PAVO.space.draw();
//		PAVO.debris.draw();
		PAVO.ghosts.draw();
					
		gl.disable(gl.CULL_FACE);

		PAVO.signs.draw();
	};
};
