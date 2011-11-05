/**

	World Object
	Maintains all actor, map, and narrative objects,
	handling all interactions among them.

**/

PAVO.world = new function() {

	var self = this;

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

		this.createPalette();
	
		PAVO.space.init();
		PAVO.player.init();
		
		PAVO.space.generate();
		PAVO.player.position.copy(PAVO.defines.space.start);
	};
	
	this.update = function() {
		PAVO.player.update();
	};
	
	this.draw = function() {
		var gl = FOAM.gl;

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		PAVO.space.draw();
	};
};
