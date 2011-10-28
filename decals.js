/**

	Decals Object
	Generates PAVO textures.
	
**/

PAVO.decals = new function() {

	var canvas;
	var context;

	this.init = function() {
		canvas = document.createElement("canvas");
		context = canvas.getContext("2d");
	};

	this.createPalette = function(tname) {
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
		var palette = context.createImageData(1, pastels.length / 4);
		var i, il;
		for (i = 0, il = pastels.length; i < il; i++)
			palette.data[i] = pastels[i];
		FOAM.textures.buildFromImageData(tname, palette);
	};

	this.createWallPanels = function(tname) {
		context.fillStyle = "#fff";
		context.fillRect(0, 0, 128, 128);
		// draw a border
		context.strokeStyle = "#000";
		context.lineWidth = 2.5;
		context.beginPath();
		context.rect(0, 0, 128, 128);
		context.stroke();
		// draw rivets
		context.beginPath();
		context.arc(10, 10, 2, 0, Math.PI * 2, false);
		context.stroke();
		context.beginPath();
		context.arc(10, 118, 2, 0, Math.PI * 2, false);
		context.stroke();
		context.beginPath();
		context.arc(118, 10, 2, 0, Math.PI * 2, false);
		context.stroke();
		context.beginPath();
		context.arc(118, 118, 2, 0, Math.PI * 2, false);
		context.stroke();
		// grab the pixels
		var img = context.getImageData(0, 0, 128, 128);
		FOAM.textures.buildFromImageData(tname, img);
	};
};
