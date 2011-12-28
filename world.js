/**

	World Object
	Maintains all actor, space, and narrative objects.

**/

PAVO.world = new function() {

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
		var i, il;
		for (i = 0, il = pastels.length; i < il; i++)
			palette.data[i] = pastels[i];
		FOAM.textures.buildFromImageData("block-palette", palette);
	};

	this.init = function() {
		var r;
		
		this.generateTextures();

		PAVO.space.init();
		PAVO.player.init();
		PAVO.ghosts.init();
		PAVO.panels.init();
		PAVO.dialogue.init("#vignettes");
		
		PAVO.player.position.copy(PAVO.game.player.position);
		PAVO.player.turn(0, PAVO.game.player.rotation, 0);

		PAVO.space.generate();
		
		PAVO.hud.start();
	};
	
	this.update = function() {
		PAVO.ghosts.update();
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
		PAVO.ghosts.draw();
		PAVO.panels.draw();
					
		gl.disable(gl.CULL_FACE);
	};
};
